// Mock data for Đồ Đồng Trường Thơi

const CATEGORIES = [
  { id: 'tranh-phong-thuy',   name: 'Tranh Phong Thủy',    count: 24, tone: 'gold'   },
  { id: 'tranh-que-huong',    name: 'Tranh Quê Hương',     count: 18, tone: 'red'    },
  { id: 'tranh-chu',          name: 'Tranh Chữ Thư Pháp',  count: 12, tone: 'dark'   },
  { id: 'tranh-ton-giao',     name: 'Tranh Thờ Cúng',      count:  9, tone: 'bronze' },
  { id: 'dinh-dong',          name: 'Đỉnh Đồng',           count: 14, tone: 'bronze' },
  { id: 'bo-tam-su',          name: 'Bộ Tam Sự / Ngũ Sự',  count:  8, tone: 'dark'   },
];

// Background tones per variant
const BG_TONES = [
  { id: 'gold',   name: 'Nền Vàng',     hex: '#c9a961' },
  { id: 'red',    name: 'Nền Đỏ',      hex: '#8b2020' },
  { id: 'bronze', name: 'Nền Nâu Đồng', hex: '#6b4423' },
  { id: 'dark',   name: 'Nền Đen Cổ',  hex: '#1e140a' },
];

const FRAME_STYLES = [
  { id: 'bronze',  name: 'Khung Nâu Đồng',    cls: 'frame-bronze' },
  { id: 'gold',    name: 'Khung Vàng Antique', cls: 'frame-gold' },
  { id: 'dark',    name: 'Khung Đen Mun',      cls: 'frame-dark' },
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

const YEAR_MODELS = [
  { id: '2022', name: 'Mẫu 2022', note: 'Bản cổ điển — nét chạm đậm, hoa văn dày' },
  { id: '2023', name: 'Mẫu 2023', note: 'Nét chạm sâu hơn, chi tiết cây cỏ được tinh chỉnh' },
  { id: '2024', name: 'Mẫu 2024', note: 'Bổ sung lớp mạ chống xỉn thế hệ mới' },
  { id: '2025', name: 'Mẫu 2025', note: 'Tỉ lệ bố cục mở rộng, nhiều không gian hơn' },
  { id: '2026', name: 'Mẫu 2026', note: 'Mẫu mới nhất — khung gỗ gụ ghép mộng truyền thống' },
];

const SIZES = [
  { id: 's', name: '1m55 × 0m88', price: 8_500_000 },
  { id: 'm', name: '1m76 × 0m90', price: 11_200_000 },
  { id: 'l', name: '2m17 × 1m07', price: 15_800_000 },
  { id: 'xl', name: '2m30 × 1m20', price: 19_500_000 },
];

const PRODUCTS = [
  {
    id: 'canh-dong-que',
    title: 'Tranh Cảnh Đồng Quê',
    subtitle: 'Đất vàng cò bay — kích thước 2m17',
    categoryId: 'tranh-que-huong',
    badge: 'Bán chạy',
    rating: 4.9, reviews: 128,
    price: 15_800_000,
    defaultBg: 'gold',
    defaultFrame: 'bronze',
    bgTones: ['gold', 'red', 'bronze', 'dark'],
    frames: ['bronze', 'gold', 'dark', 'carved'],
    description: 'Bức tranh khắc họa khung cảnh đồng quê Bắc Bộ với cây đa, giếng nước, sân đình, đàn cò trắng bay trên đồng lúa chín. Chế tác thủ công hoàn toàn bằng đồng vàng dày 1.2mm, dát thủ công bởi nghệ nhân làng Đại Bái có hơn 40 năm kinh nghiệm.',
    meaning: 'Mang ý nghĩa nhớ về cội nguồn, gợi lên ký ức quê hương, cầu mong cuộc sống no đủ, yên bình, gia đạo êm ấm. Treo phòng khách, phòng ăn, biệt thự, văn phòng.',
  },
  {
    id: 'ma-dao-thanh-cong',
    title: 'Tranh Mã Đáo Thành Công',
    subtitle: 'Tám ngựa phi đường dài 1m7',
    categoryId: 'tranh-phong-thuy',
    badge: 'Mới',
    rating: 5.0, reviews: 64,
    price: 11_200_000,
    defaultBg: 'red',
    defaultFrame: 'gold',
    bgTones: ['red', 'gold', 'bronze', 'dark'],
    frames: ['gold', 'bronze', 'carved', 'dark'],
    description: 'Hình ảnh tám chú ngựa phi nước đại trên thảo nguyên, được chạm nổi tỉ mỉ từng thớ lông, từng vó ngựa. Nền đỏ son truyền thống làm bật khí thế.',
    meaning: 'Tượng trưng cho sự nghiệp thăng tiến, thành công viên mãn. Rất hợp treo phòng làm việc, công ty, showroom.',
  },
  {
    id: 'vinh-hoa-phu-quy',
    title: 'Tranh Vinh Hoa Phú Quý',
    subtitle: 'Hoa mẫu đơn khổ 1m76',
    categoryId: 'tranh-phong-thuy',
    rating: 4.8, reviews: 92,
    price: 12_600_000,
    defaultBg: 'bronze',
    defaultFrame: 'carved',
    bgTones: ['bronze', 'gold', 'red', 'dark'],
    frames: ['carved', 'bronze', 'gold', 'dark'],
    description: 'Mẫu đơn nở rực rỡ được chạm bằng tay trên nền đồng đỏ. Từng cánh hoa, từng chiếc lá đều được nghệ nhân gò đánh kỳ công trong 20 ngày.',
    meaning: 'Hoa mẫu đơn là vua của các loài hoa, biểu trưng cho phú quý, sang trọng, tình yêu bền vững.',
  },
  {
    id: 'thuan-buom-xuoi-gio',
    title: 'Tranh Thuận Buồm Xuôi Gió',
    subtitle: 'Thuyền buồm khổ 1m55',
    categoryId: 'tranh-phong-thuy',
    rating: 4.9, reviews: 77,
    price: 9_800_000,
    defaultBg: 'gold',
    defaultFrame: 'bronze',
    bgTones: ['gold', 'red', 'bronze', 'dark'],
    frames: ['bronze', 'gold', 'dark', 'carved'],
    description: 'Con thuyền buồm căng gió trên biển mênh mông, với ánh mặt trời phản chiếu lên mặt nước. Mọi chi tiết cánh buồm, mái chèo đều được chạm ba lớp.',
    meaning: 'Cầu mong công việc làm ăn luôn hanh thông, vạn sự như ý, buôn may bán đắt.',
  },
  {
    id: 'cuu-ngu-quan-hoi',
    title: 'Tranh Cửu Ngư Quần Hội',
    subtitle: 'Chín cá chép vờn trăng 1m76',
    categoryId: 'tranh-phong-thuy',
    rating: 5.0, reviews: 54,
    price: 13_400_000,
    defaultBg: 'dark',
    defaultFrame: 'gold',
    bgTones: ['dark', 'red', 'gold', 'bronze'],
    frames: ['gold', 'carved', 'bronze', 'dark'],
    description: 'Chín chú cá chép đang vờn nhau quanh mặt trăng, xen kẽ hoa sen nở. Được đánh bóng và phủ sơn bảo vệ chống xỉn màu 10 năm.',
    meaning: 'Cửu ngư hội tụ — chiêu tài tiến bảo. Số 9 tượng trưng cho sự trường cửu, vĩnh hằng.',
  },
  {
    id: 'dinh-dong-chu-tho',
    title: 'Đỉnh Đồng Chữ Thọ',
    subtitle: 'Bộ Tam Sự cao 60cm',
    categoryId: 'dinh-dong',
    rating: 4.9, reviews: 41,
    price: 22_500_000,
    defaultBg: 'bronze',
    defaultFrame: 'dark',
    bgTones: ['bronze', 'gold', 'dark'],
    frames: ['dark', 'bronze', 'carved'],
    description: 'Đỉnh đồng chạm nổi chữ Thọ cùng hoa văn long phụng, đi kèm đôi hạc đứng trên lưng rùa. Đồng đỏ nguyên chất, gò đánh thủ công.',
    meaning: 'Bộ thờ trang nghiêm cho phòng thờ gia tiên, cầu mong trường thọ, phúc lộc bền lâu.',
  },
];

const REVIEWS = [
  { name: 'Anh Tuấn (Hà Nội)',    date: '03/2026', rating: 5, body: 'Tranh đẹp hơn cả hình, khung gỗ chắc chắn, anh giao hàng lắp tận nhà. Cảm ơn shop!' },
  { name: 'Chị Hương (Đà Nẵng)',  date: '02/2026', rating: 5, body: 'Mua tặng bố, cả nhà ưng lắm. Đồng dày, chạm tỉ mỉ, đúng là hàng làng nghề.' },
  { name: 'Anh Minh (Sài Gòn)',   date: '01/2026', rating: 4, body: 'Sản phẩm đúng như mô tả, giao hơi chậm nhưng đóng gói rất kỹ.' },
];

// Attach default year models to every product
PRODUCTS.forEach(p => {
  if (!p.years) p.years = ['2026', '2025', '2024', '2023'];
  if (!p.defaultYear) p.defaultYear = p.years[0];
  // Zodiac suitability — mock assignment; real data will be curated by shop
  if (!p.zodiac) {
    const picks = {
      'canh-dong-que':       ['suu', 'mui', 'dan'],
      'ma-dao-thanh-cong':   ['dan', 'ngo', 'tuat'],
      'vinh-hoa-phu-quy':    ['mao', 'ty2', 'mui'],
      'thuan-buom-xuoi-gio': ['than', 'ty', 'thin'],
      'cuu-ngu-quan-hoi':    ['hoi', 'tuat', 'ty'],
      'dinh-dong-chu-tho':   ['thin', 'ngo', 'dau'],
    };
    p.zodiac = picks[p.id] || ['ngo', 'dau', 'tuat'];
  }
  if (!p.purpose) {
    p.purpose = {
      place: ['Phòng khách', 'Phòng làm việc', 'Showroom / văn phòng', 'Biệt thự / sảnh lớn'],
      use:   ['Làm quà tặng tân gia, khai trương', 'Tặng sếp, đối tác', 'Trang trí phong thủy nhà ở'],
      avoid: ['Không treo trong phòng ngủ, nhà bếp', 'Tránh nơi ẩm thấp, ánh nắng chiếu trực tiếp'],
    };
  }
  if (!p.specs) {
    p.specs = {
      material:  'Đồng vàng nguyên chất 99%',
      thickness: '1.2 mm',
      weight:    '18 – 24 kg (tùy kích thước)',
      technique: 'Gò, chạm nổi thủ công',
      frameMat:  'Gỗ gụ nguyên khối, ghep mộng',
      finish:    'Phủ sơn PU bảo vệ, chống xỉn 10 năm',
      origin:    'Làng Đại Bái, Gia Bình, Bắc Ninh',
      leadTime:  '15 – 20 ngày chế tác',
    };
  }
});

// Reviews with media
const REVIEW_MEDIA = [
  { type: 'photo', caption: 'Tranh treo phòng khách' },
  { type: 'photo', caption: 'Chi tiết chạm nổi' },
  { type: 'video', caption: 'Video unbox' },
  { type: 'photo', caption: 'Góc nhìn nghiêng' },
];

Object.assign(window, { CATEGORIES, BG_TONES, FRAME_STYLES, YEAR_MODELS, SIZES, PRODUCTS, REVIEWS, ZODIAC, REVIEW_MEDIA });
