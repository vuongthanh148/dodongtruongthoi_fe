// Mock data for Đồ Đồng Trường Thơi

const CATEGORIES = [
  { id: 'tranh-phong-thuy',    name: 'Tranh Phong Thủy',     count: 24, tone: 'gold'   },
  { id: 'dinh-dong-tho-cung',  name: 'Đỉnh Đồng Thờ Cúng',   count: 14, tone: 'bronze' },
  { id: 'tuong-dong-trang-tri',name: 'Tượng Đồng Trang Trí', count:  9, tone: 'red'    },
  { id: 'do-dung-nha-bep',     name: 'Đồ Dùng Nhà Bếp',      count:  6, tone: 'dark'   },
  { id: 'phu-kien-trang-tri',  name: 'Phụ Kiện Trang Trí',   count: 11, tone: 'bronze' },
];

// Background tones per variant
const BG_TONES = [
  { id: 'red',    name: 'Nền Đỏ',       hex: '#8b2020' },
  { id: 'gold',   name: 'Nền Vàng',     hex: '#c9a961' },
  { id: 'bronze', name: 'Nền Nâu Đồng', hex: '#6b4423' },
  { id: 'dark',   name: 'Nền Đen Cổ',   hex: '#1e140a' },
];

const FRAME_STYLES = [
  { id: 'bronze',  name: 'Khung Nâu Đồng',     cls: 'frame-bronze' },
  { id: 'gold',    name: 'Khung Vàng Antique', cls: 'frame-gold'   },
  { id: 'dark',    name: 'Khung Đen Mun',      cls: 'frame-dark'   },
  { id: 'carved',  name: 'Khung Chạm Khắc',    cls: 'frame-carved' },
];

const ZODIAC = [
  { id: 'ty',    name: 'Tý',    years: '1984, 1996, 2008, 2020' },
  { id: 'suu',   name: 'Sửu',   years: '1985, 1997, 2009, 2021' },
  { id: 'dan',   name: 'Dần',   years: '1986, 1998, 2010, 2022' },
  { id: 'mao',   name: 'Mão',   years: '1987, 1999, 2011, 2023' },
  { id: 'thin',  name: 'Thìn',  years: '1988, 2000, 2012, 2024' },
  { id: 'ty2',   name: 'Tỵ',    years: '1989, 2001, 2013, 2025' },
  { id: 'ngo',   name: 'Ngọ',   years: '1990, 2002, 2014, 2026' },
  { id: 'mui',   name: 'Mùi',   years: '1991, 2003, 2015, 2027' },
  { id: 'than',  name: 'Thân',  years: '1992, 2004, 2016, 2028' },
  { id: 'dau',   name: 'Dậu',   years: '1993, 2005, 2017, 2029' },
  { id: 'tuat',  name: 'Tuất',  years: '1994, 2006, 2018, 2030' },
  { id: 'hoi',   name: 'Hợi',   years: '1995, 2007, 2019, 2031' },
];

const SIZES = [
  { id: 's',  name: '0.8m × 0.6m', priceMul: 1.0  },
  { id: 'm',  name: '1.2m × 0.8m', priceMul: 1.4  },
  { id: 'l',  name: '1.5m × 1.0m', priceMul: 1.7  },
  { id: 'xl', name: '2.0m × 1.3m', priceMul: 2.2  },
];

const PRODUCTS = [
  {
    id: 'tranh-nui-nuoc',
    title: 'Tranh Núi Nước',
    subtitle: 'Tranh phong thủy truyền thống',
    categoryId: 'tranh-phong-thuy',
    rating: 4.7, reviews: 3,
    price: 2_500_000,
    defaultBg: 'gold',
    defaultFrame: 'bronze',
    bgTones: ['red', 'gold', 'bronze'],
    frames: ['bronze', 'gold', 'dark'],
    description: 'Tranh vẽ cảnh núi nước tuyệt đẹp, thể hiện sức mạnh và ổn định của thiên nhiên. Phù hợp với phong thủy của phòng khách và phòng làm việc.',
    meaning: 'Biểu tượng của sự vĩnh cửu, ổn định và thịnh vượng. Năng lượng của núi nước giúp cân bằng không gian sống.',
  },
  {
    id: 'tranh-hoa-tim',
    title: 'Tranh Hoa Tím',
    subtitle: 'Tranh phong thủy hoa tím cao quý',
    categoryId: 'tranh-phong-thuy',
    badge: 'Mới',
    rating: 5.0, reviews: 12,
    price: 1_800_000,
    defaultBg: 'gold',
    defaultFrame: 'bronze',
    bgTones: ['gold', 'bronze'],
    frames: ['bronze', 'gold', 'carved'],
    description: 'Bức tranh hoa tím đại diện cho vẻ đẹp tinh tế và sự cao quý. Phù hợp với không gian phòng khách hiện đại.',
    meaning: 'Hoa tím gắn với sự thanh tao, lòng chung thủy và năng lượng tích cực, mang lại cảm giác bình yên cho gia chủ.',
  },
  {
    id: 'dinh-dong-3-chan',
    title: 'Đỉnh Đồng 3 Chân',
    subtitle: 'Đỉnh đồng thờ cúng truyền thống',
    categoryId: 'dinh-dong-tho-cung',
    rating: 5.0, reviews: 8,
    price: 4_500_000,
    defaultBg: 'bronze',
    defaultFrame: 'dark',
    bgTones: ['bronze', 'dark', 'gold'],
    frames: ['dark', 'bronze', 'carved'],
    description: 'Đỉnh đồng ba chân thờ cúng, chạm nổi hoa văn long phụng và chữ Thọ. Đồng đỏ nguyên chất, gò đánh thủ công bởi nghệ nhân làng Đại Bái.',
    meaning: 'Bộ thờ trang nghiêm cho phòng thờ gia tiên, cầu mong trường thọ, phúc lộc bền lâu, gia đạo bình an.',
  },
  {
    id: 'tuong-phat-a-di-da',
    title: 'Tượng Phật A Di Đà',
    subtitle: 'Tượng Phật mang lại bình yên',
    categoryId: 'tuong-dong-trang-tri',
    badge: 'SALE',
    rating: 0, reviews: 0,
    price: 3_200_000,
    defaultBg: 'bronze',
    defaultFrame: 'dark',
    bgTones: ['bronze', 'gold'],
    frames: ['dark', 'bronze'],
    description: 'Tượng Phật A Di Đà bằng đồng vàng, đường nét trang nghiêm, đế gỗ chạm sen. Cao 35cm.',
    meaning: 'Tượng A Di Đà mang lại bình yên, hướng tâm về cõi an lành, phù hợp đặt phòng thờ hoặc bàn làm việc.',
  },
  {
    id: 'tranh-ma-dao',
    title: 'Tranh Mã Đáo Thành Công',
    subtitle: 'Tám ngựa phi đường dài',
    categoryId: 'tranh-phong-thuy',
    rating: 5.0, reviews: 64,
    price: 11_200_000,
    defaultBg: 'red',
    defaultFrame: 'gold',
    bgTones: ['red', 'gold', 'bronze'],
    frames: ['gold', 'bronze', 'carved'],
    description: 'Tám chú ngựa phi nước đại trên thảo nguyên, được chạm nổi tỉ mỉ từng thớ lông, từng vó ngựa. Nền đỏ son truyền thống làm bật khí thế.',
    meaning: 'Tượng trưng cho sự nghiệp thăng tiến, thành công viên mãn. Hợp treo phòng làm việc, công ty, showroom.',
  },
  {
    id: 'cuu-ngu-quan-hoi',
    title: 'Tranh Cửu Ngư Quần Hội',
    subtitle: 'Chín cá chép vờn trăng',
    categoryId: 'tranh-phong-thuy',
    rating: 4.9, reviews: 27,
    price: 13_400_000,
    defaultBg: 'dark',
    defaultFrame: 'gold',
    bgTones: ['dark', 'red', 'gold'],
    frames: ['gold', 'carved', 'bronze'],
    description: 'Chín chú cá chép đang vờn nhau quanh mặt trăng, xen kẽ hoa sen nở. Được đánh bóng và phủ sơn bảo vệ chống xỉn màu 10 năm.',
    meaning: 'Cửu ngư hội tụ — chiêu tài tiến bảo. Số 9 tượng trưng cho sự trường cửu, vĩnh hằng.',
  },
];

// Hero banners (carousel)
const BANNERS = [
  { id: 'tet',   eyebrow: 'Khuyến mãi', title: 'Tết 2026 — Ưu Đãi Đặc Biệt',  body: 'Giảm giá 30% cho tất cả sản phẩm', cta: 'Xem chi tiết', tone: 'dark' },
  { id: 'mid',   eyebrow: 'Bộ sưu tập', title: 'Tinh hoa làng nghề Đại Bái',   body: 'Tranh đồng — chế tác thủ công 100%', cta: 'Khám phá', tone: 'red' },
  { id: 'gift',  eyebrow: 'Quà tặng',   title: 'Quà tân gia & khai trương',   body: 'Đỉnh đồng, tượng linh vật mạ vàng', cta: 'Xem ngay', tone: 'bronze' },
];

const CUSTOMER_PHOTOS = [
  { id: 'p1', city: 'Hà Nội',     room: 'Phòng khách' },
  { id: 'p2', city: 'TP.HCM',     room: 'Phòng thờ' },
  { id: 'p3', city: 'Đà Nẵng',    room: 'Văn phòng' },
  { id: 'p4', city: 'Hải Phòng',  room: 'Sảnh biệt thự' },
  { id: 'p5', city: 'Bắc Ninh',   room: 'Phòng làm việc' },
];

const CAMPAIGNS = [
  { id: 'tet', label: 'Ưu đãi', title: 'Tết 2026 — Khuyến Mãi', body: 'Giảm 30% cho tất cả tranh phong thủy trong dịp Tết', deal: 'Giảm 30%', range: '27/4/2026 — 27/5/2026' },
];

const STORIES = [
  { id: 'craft',   eyebrow: 'Đến đâu tranh đến', title: 'Một bức tranh — hai mươi ngày — ba thế hệ thợ', tone: 'dark'  },
  { id: 'village', eyebrow: 'Làng nghề', title: 'Làng Đại Bái — gốc rễ của nghề đồng Việt', tone: 'bronze' },
];

const STORES = [
  { id: 'main', name: 'Xưởng sản xuất & Showroom', addr: 'Làng Đại Bái, Gia Bình, Bắc Ninh', phone: '0899012288', hours: 'T2–CN: 7:00 — 20:00' },
];

const FAQS = [
  { q: 'Sản phẩm có bảo hành không?',         a: 'Tất cả sản phẩm được bảo hành 12 tháng cho lỗi kỹ thuật từ nhà sản xuất, hỗ trợ bảo dưỡng định kỳ trọn đời.' },
  { q: 'Giao hàng mất bao lâu?',              a: 'Hà Nội & các tỉnh lân cận: 2–4 ngày. Toàn quốc: 5–7 ngày. Hàng đặt riêng cần thêm 15–20 ngày chế tác.' },
  { q: 'Có thể đặt hàng theo yêu cầu không?', a: 'Có. Chúng tôi nhận đặt riêng theo kích thước, nội dung, khung tùy biến. Vui lòng liên hệ hotline để được báo giá.' },
  { q: 'Sản phẩm có phải đồng thật không?',   a: 'Toàn bộ sản phẩm dùng đồng vàng/đồng đỏ nguyên chất 99%, chế tác thủ công. Có giấy bảo hành chất liệu kèm theo.' },
  { q: 'Cách bảo quản đồ đồng?',              a: 'Lau bằng khăn mềm khô, tránh ẩm thấp & ánh nắng trực tiếp. Có thể đánh bóng bằng kem chuyên dụng 6–12 tháng/lần.' },
  { q: 'Cách thanh toán?',                    a: 'Chuyển khoản, COD, hoặc trả tại showroom. Đơn lớn có thể trả góp qua đối tác ngân hàng.' },
];

const GUIDE_STEPS = [
  { n: '1', title: 'Chọn kích thước',     sub: 'Chọn tỷ lệ theo không gian trưng bày', body: 'Với phòng khách nhỏ, ưu tiên khổ vừa để tạo điểm nhấn tinh tế. Với không gian lớn, bạn có thể chọn tác phẩm khổ lớn hoặc bộ đôi cân xứng.' },
  { n: '2', title: 'Chọn chất liệu — nền tranh', sub: 'Nền vàng, đỏ, nâu đồng hay đen cổ', body: 'Nền vàng hợp không gian ấm, nền đỏ nổi bật cho phòng thờ/trang trọng, nền đen cổ tạo chiều sâu hiện đại. Nhân viên sẽ tư vấn theo ánh sáng và màu nội thất thực tế.' },
  { n: '3', title: 'Quy trình đặt hàng',  sub: '', body: '', steps: [
    'Chọn sản phẩm phù hợp theo kích thước và không gian.',
    'Liên hệ qua hotline/Zalo để được tư vấn biến thể nền — khung.',
    'Xác nhận đơn hàng, thông tin giao nhận và thời gian hoàn thiện.',
    'Thanh toán theo hướng dẫn từ nhân viên chăm sóc đơn hàng.',
    'Nhận hàng, kiểm tra và hỗ trợ lắp đặt/bảo hành nếu cần.',
  ]},
  { n: '4', title: 'Chính sách bảo hành', sub: '', body: 'Sản phẩm được hỗ trợ bảo hành theo chính sách hiện hành. Nếu có lỗi kỹ thuật từ nhà sản xuất, đội ngũ sẽ hỗ trợ xử lý và bảo dưỡng định kỳ.' },
];

const CRAFT_STORY = {
  intro: { eyebrow: 'Làng Đại Bái', title: 'Hành trình của lửa, búa và bàn tay người thợ' },
  history:  { eyebrow: 'Lịch sử',    body: 'Đại Bái là một trong những làng nghề đúc đồng lâu đời ở Bắc Ninh. Từ vật dụng thờ cúng đến tác phẩm nghệ thuật trang trí, mỗi sản phẩm đều là kết tinh của kinh nghiệm truyền đời và tinh thần gìn giữ nghề cổ.' },
  artisans: { eyebrow: 'Nghệ nhân',  body: 'Người thợ đồng làm việc qua nhiều công đoạn: tạo mẫu, nấu đồng, đổ khuôn, gò chạm, xử lý bề mặt và hoàn thiện. Mỗi đường nét đều đòi hỏi sự kiên nhẫn và đôi tay chắc nghề.' },
  heritage: { eyebrow: 'Di sản',     body: 'Trường Thơi tiếp nối nghề đồng Đại Bái với mong muốn đưa tinh hoa thủ công Việt vào từng không gian sống hiện đại — không phai mòn theo năm tháng.' },
};

// Mock orders
const ORDERS = [
  { id: 'DH-2026-0142', date: '12/04/2026', status: 'pending_confirm', statusLabel: 'Chờ xác nhận', items: [{ pid: 'tranh-nui-nuoc', qty: 1, sub: '1.2m × 0.8m · Nền Vàng' }], total: 3_500_000 },
  { id: 'DH-2026-0119', date: '02/03/2026', status: 'shipped',         statusLabel: 'Đã giao',      items: [{ pid: 'dinh-dong-3-chan', qty: 1, sub: 'Bộ Tam Sự · cao 60cm' }, { pid: 'tranh-hoa-tim', qty: 1, sub: '0.8m × 0.6m · Nền Vàng' }], total: 6_300_000 },
];

const REVIEWS = [
  { name: 'Anh Tuấn (Hà Nội)',   date: '03/2026', rating: 5, body: 'Tranh đẹp hơn cả hình, khung gỗ chắc chắn, anh giao hàng lắp tận nhà. Cảm ơn shop!' },
  { name: 'Chị Hương (Đà Nẵng)', date: '02/2026', rating: 5, body: 'Mua tặng bố, cả nhà ưng lắm. Đồng dày, chạm tỉ mỉ, đúng là hàng làng nghề.' },
  { name: 'Anh Minh (Sài Gòn)',  date: '01/2026', rating: 4, body: 'Sản phẩm đúng như mô tả, giao hơi chậm nhưng đóng gói rất kỹ.' },
];

const REVIEW_MEDIA = [
  { type: 'photo', caption: 'Tranh treo phòng khách' },
  { type: 'photo', caption: 'Chi tiết chạm nổi' },
  { type: 'video', caption: 'Video unbox' },
  { type: 'photo', caption: 'Góc nhìn nghiêng' },
];

// Attach defaults
PRODUCTS.forEach(p => {
  if (!p.zodiac) {
    const picks = {
      'tranh-nui-nuoc':       ['suu', 'mui', 'dan'],
      'tranh-hoa-tim':        ['mao', 'ty2', 'mui'],
      'dinh-dong-3-chan':     ['thin', 'ngo', 'dau'],
      'tuong-phat-a-di-da':   ['ngo', 'mui', 'than'],
      'tranh-ma-dao':         ['dan', 'ngo', 'tuat'],
      'cuu-ngu-quan-hoi':     ['hoi', 'tuat', 'ty'],
    };
    p.zodiac = picks[p.id] || ['ngo', 'dau', 'tuat'];
  }
  if (!p.purpose) {
    p.purpose = {
      place: ['Phòng khách', 'Phòng làm việc', 'Showroom / văn phòng'],
      use:   ['Làm quà tặng tân gia, khai trương', 'Tặng sếp, đối tác', 'Trang trí phong thủy nhà ở'],
      avoid: ['Không treo trong phòng ngủ, nhà bếp', 'Tránh nơi ẩm thấp, ánh nắng chiếu trực tiếp'],
    };
  }
  if (!p.specs) {
    p.specs = {
      material:  'Đồng vàng nguyên chất 99%',
      thickness: '1.2 mm',
      weight:    '8 – 24 kg (tùy kích thước)',
      technique: 'Gò, chạm nổi thủ công',
      frameMat:  'Gỗ gụ nguyên khối, ghép mộng',
      finish:    'Phủ sơn PU bảo vệ, chống xỉn 10 năm',
      origin:    'Làng Đại Bái, Gia Bình, Bắc Ninh',
      leadTime:  '15 – 20 ngày chế tác',
    };
  }
});

Object.assign(window, {
  CATEGORIES, BG_TONES, FRAME_STYLES, SIZES, PRODUCTS, ZODIAC,
  BANNERS, CUSTOMER_PHOTOS, CAMPAIGNS, STORIES, STORES,
  FAQS, GUIDE_STEPS, CRAFT_STORY, ORDERS,
  REVIEWS, REVIEW_MEDIA,
});
