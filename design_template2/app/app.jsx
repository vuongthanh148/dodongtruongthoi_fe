// App shell — Design canvas with multiple iPhone artboards across 3 sections

const { useState, useEffect } = React;

function PhoneArt({ children, ...rest }) {
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <IOSDevice width={390} height={844}>
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', overflow: 'auto' }} className="noscroll">
            {children}
          </div>
          <ContactBubbles />
          {rest.menuVisible && (
            <ScreenMenu
              onClose={rest.onCloseMenu}
              onNavigate={rest.onMenuNavigate}
              savedCount={rest.savedCount}
              cartCount={rest.cartCount}
            />
          )}
        </div>
      </IOSDevice>
    </div>
  );
}

function TweakableRoot() {
  const defaults = /*EDITMODE-BEGIN*/{
    "accent": "#8b1e1e",
    "accentGold": "#c9a961",
    "bgColor": "#f4ede0",
    "heading": "Cormorant Garamond",
    "ui": "Be Vietnam Pro",
    "script": "Lora"
  }/*EDITMODE-END*/;

  const [tweaks, setTweaks] = useState(defaults);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--son', tweaks.accent);
    r.style.setProperty('--gold', tweaks.accentGold);
    r.style.setProperty('--ivory', tweaks.bgColor);
  }, [tweaks]);

  useEffect(() => {
    const handler = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setTweaksOpen(true);
      if (d.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const setKey = (k, v) => {
    setTweaks(t => ({ ...t, [k]: v }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  // ── Each artboard has its own nav state, so screens are independent.
  // We use a single big map of artboard-id → screen state.
  const [navMap, setNavMap] = useState({});
  const setNav = (key, next) => setNavMap(m => ({ ...m, [key]: typeof next === 'function' ? next(m[key]) : next }));
  const getNav = (key, fallback) => navMap[key] || fallback;

  // ── Per-artboard menu drawer state
  const [menuMap, setMenuMap] = useState({});
  const openMenu  = (k) => setMenuMap(m => ({ ...m, [k]: true }));
  const closeMenu = (k) => setMenuMap(m => ({ ...m, [k]: false }));

  // ── Globally shared: recently viewed, saved, cart
  const [recent, setRecent] = useState(['cuu-ngu-quan-hoi', 'tranh-ma-dao', 'tranh-hoa-tim', 'dinh-dong-3-chan']);
  const [saved,  setSaved]  = useState(['cuu-ngu-quan-hoi', 'tranh-hoa-tim']);
  const [cart,   setCart]   = useState([
    { pid: 'tranh-nui-nuoc',   qty: 1, size: '1.2m × 0.8m', bg: 'Nền Vàng', frame: 'Khung Nâu Đồng' },
    { pid: 'dinh-dong-3-chan', qty: 1 },
  ]);

  const pushRecent = (id) => setRecent(r => [id, ...r.filter(x => x !== id)].slice(0, 8));
  const toggleSave = (id) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [id, ...s]);
  const addToCart  = (pid, opts = {}) => setCart(c => {
    const found = c.find(it => it.pid === pid);
    if (found) return c.map(it => it.pid === pid ? { ...it, qty: it.qty + 1 } : it);
    return [...c, { pid, qty: 1, ...opts }];
  });
  const updateQty = (pid, qty) => setCart(c => qty < 1 ? c.filter(it => it.pid !== pid) : c.map(it => it.pid === pid ? { ...it, qty } : it));
  const removeCart = (pid) => setCart(c => c.filter(it => it.pid !== pid));

  // ── A single navigation router used by all menu drawers / footer links / etc.
  const navigate = (key) => (target) => {
    closeMenu(key);
    if (target === 'home')         setNav(key, { screen: 'home' });
    else if (target === 'saved')   setNav(key, { screen: 'saved' });
    else if (target === 'cart')    setNav(key, { screen: 'cart' });
    else if (target === 'orders')  setNav(key, { screen: 'orders' });
    else if (target === 'craft')   setNav(key, { screen: 'craft' });
    else if (target === 'guide')   setNav(key, { screen: 'guide' });
    else if (target === 'faq')     setNav(key, { screen: 'faq' });
    else if (target === 'search')  setNav(key, { screen: 'search' });
    else if (target.startsWith('category:')) {
      setNav(key, { screen: 'category', categoryId: target.split(':')[1] });
    }
    else setNav(key, { screen: 'home' });
  };

  // ── Render a screen for a given artboard
  const renderScreen = (key, initial) => {
    const nav  = getNav(key, initial);
    const back = () => setNav(key, initial);
    const openProduct = (id) => { pushRecent(id); setNav(key, { screen: 'product', productId: id }); };
    const openCategory = (id) => setNav(key, { screen: 'category', categoryId: id });
    const openSaved   = ()   => setNav(key, { screen: 'saved' });
    const openOrder   = (id) => setNav(key, { screen: 'order-detail', orderId: id });

    const common = {
      onMenu: () => openMenu(key),
      onOpenSaved: openSaved,
      savedCount: saved.length,
      onNavigate: navigate(key),
      onOpenSearch: () => setNav(key, { screen: 'search' }),
    };

    switch (nav.screen) {
      case 'home':
        return <ScreenHome {...common}
          onOpenProduct={openProduct}
          onOpenCategory={openCategory} />;
      case 'category':
        return <ScreenCategory categoryId={nav.categoryId} {...common}
          onBack={back}
          onOpenProduct={openProduct} />;
      case 'product':
        return <ScreenProduct productId={nav.productId}
          {...common}
          onBack={back}
          recentIds={recent}
          isSaved={saved.includes(nav.productId)}
          onToggleSave={toggleSave}
          onOpenProduct={openProduct}
          onOpenCategory={openCategory}
          onAddToCart={(pid, opts) => { addToCart(pid, opts); setNav(key, { screen: 'cart' }); }}
          onBuyNow={(pid, opts) => { addToCart(pid, opts); setNav(key, { screen: 'checkout' }); }} />;
      case 'saved':
        return <ScreenSaved savedIds={saved}
          onBack={back}
          onRemove={toggleSave}
          onOpenProduct={openProduct} />;
      case 'cart':
        return <ScreenCart {...common}
          onBack={back}
          items={cart}
          onUpdateQty={updateQty}
          onRemove={removeCart}
          onCheckout={() => setNav(key, { screen: 'checkout' })}
          onContinue={back} />;
      case 'checkout':
        return <ScreenCheckout {...common} onBack={() => setNav(key, { screen: 'cart' })} items={cart} />;
      case 'orders':
        return <ScreenOrders {...common} onBack={back} onOpenOrder={openOrder} />;
      case 'order-detail':
        return <ScreenOrderDetail {...common} onBack={() => setNav(key, { screen: 'orders' })} orderId={nav.orderId} />;
      case 'search':
        return <ScreenSearch onClose={back} onOpenProduct={openProduct} onOpenCategory={openCategory} />;
      case 'faq':    return <ScreenFAQ   onBack={back} />;
      case 'craft':  return <ScreenCraft onBack={back} />;
      case 'guide':  return <ScreenGuide onBack={back} />;
      default:       return <ScreenHome  {...common} onOpenProduct={openProduct} onOpenCategory={openCategory} />;
    }
  };

  // ── Artboard helper
  const Phone = ({ id, init }) => (
    <PhoneArt
      menuVisible={menuMap[id]}
      onCloseMenu={() => closeMenu(id)}
      onMenuNavigate={navigate(id)}
      savedCount={saved.length}
      cartCount={cart.length}>
      {renderScreen(id, init)}
    </PhoneArt>
  );

  const accents = ['#8b1e1e', '#6b4423', '#4a3a2e', '#1e140a'];
  const golds   = ['#c9a961', '#b08a3e', '#d9b865', '#a67c2e'];
  const bgs     = ['#f4ede0', '#ece3d1', '#f7f1e4', '#ebe1c8'];

  return (
    <>
      <DesignCanvas
        title="Đồ Đồng Trường Thơi"
        subtitle="Mockup mobile site · Hover & cuộn để xem các màn"
        storageKey="dotrungthoi-canvas-v1">

        <DCSection id="discovery" title="Khám phá" subtitle="Trang chủ · Tìm kiếm · Menu · Danh mục">
          <DCArtboard id="home" label="01 · Trang chủ" width={390} height={844}>
            <Phone id="home" init={{ screen: 'home' }} />
          </DCArtboard>
          <DCArtboard id="search" label="02 · Tìm kiếm" width={390} height={844}>
            <Phone id="search" init={{ screen: 'search' }} />
          </DCArtboard>
          <DCArtboard id="menu" label="03 · Menu drawer" width={390} height={844}>
            <PhoneArt
              menuVisible={true}
              onCloseMenu={() => {}}
              onMenuNavigate={() => {}}
              savedCount={saved.length}
              cartCount={cart.length}>
              <ScreenHome onMenu={() => {}} onOpenSaved={() => {}} savedCount={saved.length}
                onOpenProduct={() => {}} onOpenCategory={() => {}} onNavigate={() => {}} onOpenSearch={() => {}} />
            </PhoneArt>
          </DCArtboard>
          <DCArtboard id="category" label="04 · Danh mục" width={390} height={844}>
            <Phone id="category" init={{ screen: 'category', categoryId: 'tranh-phong-thuy' }} />
          </DCArtboard>
        </DCSection>

        <DCSection id="product" title="Sản phẩm" subtitle="Chi tiết · Đã lưu">
          <DCArtboard id="product" label="05 · Chi tiết sản phẩm" width={390} height={844}>
            <Phone id="product" init={{ screen: 'product', productId: 'tranh-ma-dao' }} />
          </DCArtboard>
          <DCArtboard id="product2" label="06 · Đỉnh đồng" width={390} height={844}>
            <Phone id="product2" init={{ screen: 'product', productId: 'dinh-dong-3-chan' }} />
          </DCArtboard>
          <DCArtboard id="saved" label="07 · Sản phẩm đã lưu" width={390} height={844}>
            <Phone id="saved" init={{ screen: 'saved' }} />
          </DCArtboard>
        </DCSection>

        <DCSection id="checkout" title="Mua hàng" subtitle="Giỏ · Đặt hàng · Tra cứu đơn">
          <DCArtboard id="cart" label="08 · Giỏ hàng" width={390} height={844}>
            <Phone id="cart" init={{ screen: 'cart' }} />
          </DCArtboard>
          <DCArtboard id="checkout" label="09 · Đặt hàng" width={390} height={844}>
            <Phone id="checkout" init={{ screen: 'checkout' }} />
          </DCArtboard>
          <DCArtboard id="orders" label="10 · Tra cứu đơn" width={390} height={844}>
            <Phone id="orders" init={{ screen: 'orders' }} />
          </DCArtboard>
          <DCArtboard id="order-detail" label="11 · Chi tiết đơn" width={390} height={844}>
            <Phone id="order-detail" init={{ screen: 'order-detail', orderId: 'DH-2026-0142' }} />
          </DCArtboard>
        </DCSection>

        <DCSection id="info" title="Thông tin" subtitle="Làng nghề · Hướng dẫn · FAQ">
          <DCArtboard id="craft" label="12 · Làng nghề" width={390} height={844}>
            <Phone id="craft" init={{ screen: 'craft' }} />
          </DCArtboard>
          <DCArtboard id="guide" label="13 · Hướng dẫn mua hàng" width={390} height={844}>
            <Phone id="guide" init={{ screen: 'guide' }} />
          </DCArtboard>
          <DCArtboard id="faq" label="14 · FAQ" width={390} height={844}>
            <Phone id="faq" init={{ screen: 'faq' }} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {tweaksOpen && (
        <div className="tweaks-panel">
          <h4>Tweaks</h4>

          <label>Màu đỏ son (accent)</label>
          <div className="row">
            {accents.map(c => (
              <button key={c} onClick={() => setKey('accent', c)}
                className={tweaks.accent === c ? 'on' : ''}
                style={{ background: tweaks.accent === c ? c : 'white', color: tweaks.accent === c ? 'white' : 'var(--ink)', borderColor: c }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, background: c, borderRadius: '50%', marginRight: 4, verticalAlign: 'middle' }} />
                {c}
              </button>
            ))}
          </div>

          <label>Vàng antique</label>
          <div className="row">
            {golds.map(c => (
              <button key={c} onClick={() => setKey('accentGold', c)}
                className={tweaks.accentGold === c ? 'on' : ''}>
                <span style={{ display: 'inline-block', width: 10, height: 10, background: c, borderRadius: '50%', marginRight: 4, verticalAlign: 'middle' }} />
                {c}
              </button>
            ))}
          </div>

          <label>Nền giấy</label>
          <div className="row">
            {bgs.map(c => (
              <button key={c} onClick={() => setKey('bgColor', c)}
                className={tweaks.bgColor === c ? 'on' : ''}>
                <span style={{ display: 'inline-block', width: 10, height: 10, background: c, borderRadius: '50%', marginRight: 4, verticalAlign: 'middle', border: '1px solid rgba(0,0,0,0.1)' }} />
                {c}
              </button>
            ))}
          </div>

          <label style={{ marginTop: 14 }}>Gợi ý</label>
          <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
            Bấm vào bất kỳ artboard nào để mở fullscreen. Các thay đổi áp dụng trên tất cả 14 màn.
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TweakableRoot />);
