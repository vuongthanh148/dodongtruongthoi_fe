// App shell: 3 iPhones showing Home, Category, Product — plus Saved + Menu screens.

const { useState, useEffect } = React;

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

  // Per-phone nav stacks (simple last-screen tracking)
  const [homeNav,    setHomeNav]    = useState({ screen: 'home' });
  const [catNav,     setCatNav]     = useState({ screen: 'category', categoryId: 'tranh-phong-thuy' });
  const [productNav, setProductNav] = useState({ screen: 'product',  productId: 'canh-dong-que' });

  // Menu drawer state — per phone
  const [menuOpen, setMenuOpen] = useState({ home: false, cat: false, prod: false });

  // Shared across all phones: recently viewed + saved (wishlist)
  const [recent, setRecent] = useState(['ma-dao-thanh-cong', 'vinh-hoa-phu-quy', 'cuu-ngu-quan-hoi', 'thuan-buom-xuoi-gio']);
  const [saved, setSaved]   = useState(['vinh-hoa-phu-quy', 'cuu-ngu-quan-hoi']);

  const pushRecent = (id) => setRecent(r => [id, ...r.filter(x => x !== id)].slice(0, 8));
  const toggleSave = (id) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [id, ...s]);

  const openProduct = (setter) => (id) => { pushRecent(id); setter({ screen: 'product', productId: id }); };
  const openSaved   = (setter) => ()   => setter(nav => ({ ...nav, screen: 'saved', prev: nav }));
  const openMenu    = (key)    => ()   => setMenuOpen(m => ({ ...m, [key]: true }));
  const closeMenu   = (key)    => ()   => setMenuOpen(m => ({ ...m, [key]: false }));

  const navigateFromMenu = (setter, key) => (id) => {
    setMenuOpen(m => ({ ...m, [key]: false }));
    if (id === 'home')   setter({ screen: 'home' });
    else if (id === 'saved') setter({ screen: 'saved' });
    else if (id.startsWith('category')) {
      const map = { 'category': 'tranh-phong-thuy', 'category2': 'tranh-que-huong', 'category3': 'dinh-dong' };
      setter({ screen: 'category', categoryId: map[id] || 'tranh-phong-thuy' });
    }
  };

  const Phone = ({ children, label, sub, menuKey, menuVisible, onCloseMenu, onMenuNavigate }) => (
    <div className="screen-wrap">
      <IOSDevice width={390} height={844}>
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', overflow: 'auto' }} className="noscroll">
            {children}
          </div>
          <ContactBubbles />
          {menuVisible && (
            <ScreenMenu
              onClose={onCloseMenu}
              onNavigate={onMenuNavigate}
              savedCount={saved.length}
            />
          )}
        </div>
      </IOSDevice>
      <div className="screen-label">{label}<b>{sub}</b></div>
    </div>
  );

  const renderScreen = (nav, setNav, key, fallback) => {
    if (nav.screen === 'saved') {
      return <ScreenSaved
        savedIds={saved}
        onBack={() => setNav(nav.prev || fallback)}
        onRemove={toggleSave}
        onOpenProduct={openProduct(setNav)} />;
    }
    if (nav.screen === 'home') {
      return <ScreenHome
        savedCount={saved.length}
        onOpenProduct={openProduct(setNav)}
        onOpenCategory={(id) => setNav({ screen: 'category', categoryId: id })}
        onOpenSaved={() => setNav({ screen: 'saved', prev: nav })}
        onMenu={openMenu(key)}
      />;
    }
    if (nav.screen === 'category') {
      return <ScreenCategory categoryId={nav.categoryId}
        savedCount={saved.length}
        onBack={() => setNav(fallback)}
        onOpenProduct={openProduct(setNav)}
        onOpenSaved={() => setNav({ screen: 'saved', prev: nav })}
      />;
    }
    return <ScreenProduct productId={nav.productId}
      recentIds={recent}
      savedCount={saved.length}
      isSaved={saved.includes(nav.productId)}
      onToggleSave={toggleSave}
      onOpenProduct={openProduct(setNav)}
      onOpenSaved={() => setNav({ screen: 'saved', prev: nav })}
      onBack={() => setNav(fallback)} />;
  };

  const accents = ['#8b1e1e', '#6b4423', '#4a3a2e', '#1e140a'];
  const golds   = ['#c9a961', '#b08a3e', '#d9b865', '#a67c2e'];
  const bgs     = ['#f4ede0', '#ece3d1', '#f7f1e4', '#ebe1c8'];

  return (
    <div className="stage">
      <div className="stage-heading">
        <div className="eyebrow">Mockup · Mobile site · v1</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif' }}>Đồ Đồng Trường Thơi</h1>
        <p>Ba màn hình chính của trang bán đồ đồng thủ công mỹ nghệ. Bấm vào sản phẩm, danh mục, biểu tượng <b style={{ color: 'var(--gold)' }}>♥</b> để xem danh sách đã lưu, hoặc biểu tượng ☰ ở góc trên để mở menu. Bật tab <b style={{ color: 'var(--gold)' }}>Tweaks</b> để thử nghiệm màu, font.</p>
      </div>

      <div className="screens-row">
        <Phone label="01" sub="Trang chủ"
          menuKey="home"
          menuVisible={menuOpen.home}
          onCloseMenu={closeMenu('home')}
          onMenuNavigate={navigateFromMenu(setHomeNav, 'home')}>
          {renderScreen(homeNav, setHomeNav, 'home', { screen: 'home' })}
        </Phone>
        <Phone label="02" sub="Danh mục"
          menuKey="cat"
          menuVisible={menuOpen.cat}
          onCloseMenu={closeMenu('cat')}
          onMenuNavigate={navigateFromMenu(setCatNav, 'cat')}>
          {renderScreen(catNav, setCatNav, 'cat', { screen: 'category', categoryId: 'tranh-phong-thuy' })}
        </Phone>
        <Phone label="03" sub="Chi tiết sản phẩm"
          menuKey="prod"
          menuVisible={menuOpen.prod}
          onCloseMenu={closeMenu('prod')}
          onMenuNavigate={navigateFromMenu(setProductNav, 'prod')}>
          {renderScreen(productNav, setProductNav, 'prod', { screen: 'product', productId: 'canh-dong-que' })}
        </Phone>
      </div>

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
            Thay đổi được áp dụng trực tiếp trên cả 3 màn hình. Tất cả biến thể nền/khung của sản phẩm vẫn giữ riêng màu đặc trưng.
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TweakableRoot />);
