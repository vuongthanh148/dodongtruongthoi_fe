// Home screen

function ScreenHome({ onOpenProduct, onOpenCategory, onOpenSaved, onMenu, savedCount = 0 }) {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div data-screen-label="01 Home" style={{ background: 'var(--ivory)', minHeight: '100%' }} className="paper">
      <TopBar showLogo onMenu={onMenu} onOpenSaved={onOpenSaved} savedCount={savedCount} />

      {/* Hero */}
      <div style={{ position: 'relative', margin: '14px 16px 0', borderRadius: 14, overflow: 'hidden', background: '#1a120a', aspectRatio: '4/5' }}>
        {/* hero "photo" placeholder — monospace label describes what goes here */}
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(255,200,120,0.25), transparent 55%),' +
            'radial-gradient(ellipse at 70% 80%, rgba(139,30,30,0.3), transparent 60%),' +
            'linear-gradient(135deg, #2a1a0c 0%, #160c06 100%)',
        }} />
        <div className="ph dark" style={{
          position: 'absolute', left: 14, top: 14, right: 14, bottom: 14, borderRadius: 10,
          flexDirection: 'column', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end',
          background:
            'repeating-linear-gradient(45deg, rgba(201,169,97,0.10) 0 8px, rgba(201,169,97,0.02) 8px 16px)',
        }}>
          <div style={{ textAlign: 'left', width: '100%' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(201,169,97,0.6)', letterSpacing: '0.15em', marginBottom: 20 }}>
              [ hero-photo.jpg — ảnh nghệ nhân đang gò đồng, làng Đại Bái, ánh sáng ấm, cận cảnh bàn tay ]
            </div>
          </div>
        </div>

        {/* Overlay content */}
        <div style={{
          position: 'absolute', inset: 0, padding: '28px 22px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(20,14,9,0.25) 0%, transparent 40%, rgba(20,14,9,0.85) 100%)',
        }}>
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase',
            }}>Làng nghề · Est. 1968</div>
          </div>
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 32, fontWeight: 500, lineHeight: 1.05,
              color: '#f4ede0', marginBottom: 8,
              textWrap: 'balance',
            }}>
              Tinh hoa<br/>đồng Việt<br/>
              <i style={{ fontFamily: 'Lora, serif', fontWeight: 400, fontSize: 20, color: 'var(--gold)' }}>
                — gò bằng tay, thổi hồn bằng tâm
              </i>
            </div>
            <div style={{ color: 'rgba(244,237,224,0.75)', fontSize: 12.5, lineHeight: 1.55, marginBottom: 16, maxWidth: 280 }}>
              Hơn bốn thập kỷ, nghệ nhân làng Đại Bái gửi gắm vào từng nét chạm. Mỗi bức tranh là một câu chuyện.
            </div>
            <button style={{
              background: 'var(--son)', color: 'white', border: 'none',
              padding: '11px 20px', borderRadius: 2,
              fontFamily: 'Be Vietnam Pro', fontWeight: 500, fontSize: 13,
              letterSpacing: '0.05em', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }} onClick={() => onOpenCategory('tranh-phong-thuy')}>
              Xem bộ sưu tập <IconChevron size={14} color="white" />
            </button>
          </div>
        </div>
      </div>

      <div className="dongson-border" style={{ margin: '24px 16px 0' }} />

      {/* Categories */}
      <div style={{ padding: '22px 0 0' }}>
        <SectionHeading eyebrow="Danh mục" title="Chọn theo sản phẩm" />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, padding: '0 16px',
        }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => onOpenCategory(c.id)} style={{
              background: '#fffdf7',
              border: '1px solid var(--line)',
              borderRadius: 8, padding: 10,
              display: 'flex', flexDirection: 'column', gap: 8,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <ArtPiece bg={c.tone} frame="bronze" label={c.name} pad={4} aspect="16/10" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.15 }}>
                  {c.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--muted)' }}>
                  {String(c.count).padStart(2, '0')}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding: '28px 0 0' }}>
        <SectionHeading eyebrow="Nổi bật" title="Được chọn nhiều nhất" action="Xem tất cả" />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, padding: '0 16px',
        }}>
          {featured.map(p => (
            <ProductCard key={p.id} p={p} onOpen={() => onOpenProduct(p.id)} />
          ))}
        </div>
      </div>

      {/* Craft story strip */}
      <div style={{ margin: '28px 16px 0', padding: '22px 18px', background: 'var(--ink)', borderRadius: 10, color: 'var(--ivory)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.08 }}>
          <DrumMark size={140} color="var(--gold)" />
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>
          Câu chuyện nghề
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 500, lineHeight: 1.2, marginBottom: 10, position: 'relative' }}>
          Một bức tranh — <i>hai mươi ngày</i> — ba thế hệ thợ
        </div>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(244,237,224,0.7)', margin: 0 }}>
          Chúng tôi vẫn giữ nguyên cách làm của cụ ông: đồng thoi nung đỏ, đập mỏng trên đe đá, gò từng nét bằng chiếc búa gỗ mít.
        </p>
        <button style={{
          marginTop: 14, background: 'transparent', border: '1px solid var(--gold)',
          color: 'var(--gold)', padding: '8px 14px', borderRadius: 2,
          fontFamily: 'Be Vietnam Pro', fontSize: 11, letterSpacing: '0.1em',
          cursor: 'pointer', textTransform: 'uppercase',
        }}>Tìm hiểu làng nghề</button>
      </div>

      {/* Footer */}
      <div style={{ margin: '28px 16px 24px', padding: '20px 0', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <DrumMark size={32} color="var(--son)" />
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 15, color: 'var(--son)', marginTop: 6 }}>
          Đồ Đồng Trường Thơi
        </div>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
          Xưởng: Đại Bái · Gia Bình · Bắc Ninh
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>Hotline · 0899·01·2288</div>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}

window.ScreenHome = ScreenHome;
