// Static placeholder copy for the storefront. Sample copy from the design handoff
// (HANDOFF "Copy", "Decisions"): occasions, craft steps, gift service, craft band,
// empty and error states. Replace each block with CMS-editable settings when they
// exist. Blog posts have no CMS/API yet, so BLOG_POSTS is the single place that needs
// to change for articles.

export interface BlogPost {
  id: string
  tag: string
  title: string
  date: string
  readMinutes: number
  excerpt: string
  body: {
    intro: string
    sections: { heading: string; paragraphs: string[] }[]
  }
  // Optional reference table shown in the article's info card (board: article-*).
  table?: { title: string; rows: { label: string; value: string }[] }
}

export interface ContentPageMeta {
  topTitle: string
  crumbs: { label: string; href?: string }[]
  withVisit: boolean
}

// Shell and route metadata for every content page. Used by the pages and by ContentState
// (loading.tsx / error.tsx) so both render the same header, title and breadcrumbs.
export const CONTENT_PAGE_META = {
  blog: {
    topTitle: 'Cẩm nang',
    crumbs: [{ label: 'Trang chủ', href: '/' }, { label: 'Cẩm nang' }],
    withVisit: true,
  },
  article: {
    topTitle: 'Cẩm nang',
    crumbs: [{ label: 'Trang chủ', href: '/' }, { label: 'Cẩm nang', href: '/cam-nang' }, { label: '…' }],
    withVisit: true,
  },
  contact: {
    topTitle: 'Liên hệ',
    crumbs: [{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }],
    withVisit: false,
  },
  faq: {
    topTitle: 'Câu Hỏi Thường Gặp',
    crumbs: [{ label: 'Trang chủ', href: '/' }, { label: 'Câu hỏi thường gặp' }],
    withVisit: true,
  },
  guide: {
    topTitle: 'Hướng Dẫn Mua Hàng',
    crumbs: [{ label: 'Trang chủ', href: '/' }, { label: 'Hướng dẫn mua hàng' }],
    withVisit: true,
  },
  craft: {
    topTitle: 'Giới thiệu',
    crumbs: [{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }],
    withVisit: true,
  },
} satisfies Record<string, ContentPageMeta>

export type ContentKind = keyof typeof CONTENT_PAGE_META

export const BLOG_COPY = {
  title: 'Cẩm nang đồ đồng',
  sub: 'Kiến thức chọn, bày và giữ gìn đồ đồng cho gia đình.',
  topicsLabel: 'Chủ đề',
  allTag: 'Tất cả',
  readMore: 'Đọc bài →',
  readTime: (minutes: number) => `${minutes} phút đọc`,
  infoTitle: 'Thông tin bài viết',
  infoCategory: 'Chuyên mục',
  infoDate: 'Ngày đăng',
  infoReadTime: 'Thời gian đọc',
  zaloTitle: 'Chưa chắc kích thước?',
  zaloBody: 'Gửi ảnh bức tường qua Zalo, nghệ nhân sẽ tư vấn miễn phí.',
  zaloCta: 'Nhắn Zalo',
  relatedEyebrow: 'Đọc tiếp',
  relatedTitle: 'Bài viết liên quan',
}

export const FAQ_COPY = {
  title: 'Câu hỏi thường gặp',
  sub: 'Chưa thấy câu trả lời? Gọi 0899 012 288 hoặc nhắn Zalo.',
}

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Sản phẩm có bảo hành không?',
    a: 'Có. Chúng tôi hỗ trợ bảo hành theo chính sách kỹ thuật cho từng dòng sản phẩm và hỗ trợ vệ sinh/bảo dưỡng định kỳ.',
  },
  {
    q: 'Giao hàng mất bao lâu?',
    a: 'Nội thành thường từ 1–3 ngày. Tỉnh thành khác từ 3–7 ngày tùy khu vực và lịch vận chuyển.',
  },
  {
    q: 'Có thể đặt hàng theo yêu cầu không?',
    a: 'Có. Bạn có thể đặt theo kích thước, tông nền, khung và nội dung khắc riêng theo nhu cầu. Liên hệ hotline để được tư vấn chi tiết.',
  },
  {
    q: 'Sản phẩm có phải đồng thật không?',
    a: 'Sản phẩm được chế tác từ đồng với quy trình thủ công tại làng nghề Đại Bái, có tư vấn chi tiết từng chất liệu khi đặt hàng.',
  },
  {
    q: 'Cách bảo quản đồ đồng?',
    a: 'Giữ nơi khô ráo, lau bằng khăn mềm, tránh hóa chất mạnh. Định kỳ đánh bóng theo hướng dẫn từ xưởng để giữ độ sáng bóng.',
  },
  {
    q: 'Cách thanh toán?',
    a: 'Bạn có thể chuyển khoản hoặc thanh toán theo hình thức được tư vấn khi xác nhận đơn hàng. Không thu phí thêm.',
  },
  {
    q: 'Đổi trả như thế nào?',
    a: 'Hỗ trợ đổi trả trong trường hợp hư hại do vận chuyển hoặc lỗi sản xuất. Liên hệ hotline trong vòng 48 giờ kể từ khi nhận hàng.',
  },
]

export const GUIDE_COPY = {
  title: 'Hướng dẫn mua hàng',
  sub: 'Năm bước để chọn đúng tác phẩm cho không gian của bạn.',
}

export const GUIDE_STEPS: { n: number; title: string; subtitle: string; body: string }[] = [
  {
    n: 1,
    title: 'Chọn kích thước phù hợp',
    subtitle: 'Dựa trên diện tích tường và không gian',
    body: 'Với phòng khách nhỏ, ưu tiên khổ vừa để tạo điểm nhấn tinh tế. Với không gian lớn, bạn có thể chọn tác phẩm khổ lớn hoặc bộ đôi cân xứng.',
  },
  {
    n: 2,
    title: 'Chọn nền tranh và khung',
    subtitle: 'Tư vấn theo ánh sáng và màu nội thất',
    body: 'Nền vàng hợp không gian ấm, nền đỏ nổi bật cho phòng thờ/trang trọng, nền đen cổ tạo chiều sâu hiện đại. Nhân viên sẽ tư vấn theo ánh sáng và màu nội thất.',
  },
  {
    n: 3,
    title: 'Xác nhận đơn và thông tin giao nhận',
    subtitle: 'Qua hotline hoặc Zalo',
    body: 'Liên hệ qua hotline hoặc Zalo để xác nhận biến thể, giá, thời gian hoàn thiện và địa chỉ giao hàng. Đơn hàng được xác nhận qua điện thoại.',
  },
  {
    n: 4,
    title: 'Thanh toán',
    subtitle: 'Chuyển khoản hoặc theo tư vấn',
    body: 'Chuyển khoản hoặc theo hình thức được tư vấn. Không thu thêm phụ phí. Thông tin thanh toán được gửi sau khi xác nhận đơn.',
  },
  {
    n: 5,
    title: 'Nhận hàng và lắp đặt',
    subtitle: 'Hỗ trợ lắp đặt tận nơi',
    body: 'Kiểm tra kỹ khi nhận hàng. Đội ngũ hỗ trợ lắp đặt và bảo hành định kỳ. Liên hệ hotline trong 48 giờ nếu có vấn đề sau khi nhận.',
  },
]

export const CONTACT_COPY = {
  title: 'Liên hệ',
  sub: 'Ghé xưởng tại làng Đại Bái hoặc nhắn cho chúng tôi, phản hồi trong giờ hành chính.',
  mapAction: 'Chỉ đường →',
  mapTitle: (name: string) => `Bản đồ ${name}`,
  infoTitle: 'Thông tin',
  hotlineLabel: 'Hotline · Zalo',
  addressLabel: 'Xưởng & showroom',
  hoursLabel: 'Giờ mở cửa',
  hoursFallback: 'Thứ 2 – Chủ nhật · 7:30 – 18:00',
  emailLabel: 'Email',
  call: 'Gọi ngay',
  zalo: 'Zalo',
  formTitle: 'Gửi tin nhắn',
  nameLabel: 'Họ và tên',
  namePlaceholder: 'Nguyễn Văn A',
  phoneLabel: 'Số điện thoại',
  phonePlaceholder: '09xx xxx xxx',
  messageLabel: 'Nội dung',
  messagePlaceholder: 'Bạn cần tư vấn sản phẩm nào, kích thước, ngân sách…',
  submit: 'Gửi tin nhắn',
  submitting: 'Đang gửi…',
  successTitle: 'Đã nhận tin nhắn',
  successBody: 'Chúng tôi sẽ gọi lại trong vòng 2 giờ làm việc.',
  sendAnother: 'Gửi tin khác',
  nameRequired: 'Vui lòng nhập họ và tên.',
  phoneRequired: 'Vui lòng nhập số điện thoại.',
  messageRequired: 'Vui lòng nhập nội dung tin nhắn.',
  failed: 'Không gửi được tin nhắn, vui lòng thử lại hoặc gọi trực tiếp.',
}

export const CRAFT_PAGE_COPY = {
  eyebrow: 'Làng Đại Bái · Bắc Ninh',
  title: 'Hành trình của lửa, búa và bàn tay người thợ',
  visitTitle: 'Ghé xưởng tại làng Đại Bái',
  visitMeta: 'Làng Đại Bái, Bắc Ninh · Mở cửa hàng ngày',
  visitCta: 'Xem sản phẩm',
}

export const CRAFT_STORIES: { label: string; title: string; body: string; bg: 'bronze' | 'gold' | 'dark'; frame: 'gold' | 'bronze' | 'carved' }[] = [
  {
    label: 'Lịch sử',
    title: 'Trên 1000 năm nghề đúc đồng',
    body: 'Đại Bái là một trong những làng nghề đúc đồng lâu đời ở Bắc Ninh. Từ vật dụng thờ cúng đến tác phẩm nghệ thuật trang trí, mỗi sản phẩm đều là kết tinh của kinh nghiệm truyền đời và tinh thần gìn giữ nghề cổ.',
    bg: 'bronze',
    frame: 'gold',
  },
  {
    label: 'Nghề thủ công',
    title: 'Bàn tay nghệ nhân và lửa lò',
    body: 'Người thợ làm đồng trải qua nhiều công đoạn: tạo mẫu, nấu đồng, đổ khuôn, gò chạm, xử lý bề mặt và hoàn thiện. Mỗi đường nét đều đòi hỏi sự kiên nhẫn và đôi tay chắc nghề.',
    bg: 'gold',
    frame: 'bronze',
  },
  {
    label: 'Di sản',
    title: 'Mang văn hoá Việt vào không gian sống',
    body: 'Chúng tôi mong muốn mỗi tác phẩm không chỉ đẹp trong không gian sống, mà còn mang theo câu chuyện văn hóa Việt: sự bền bỉ, tinh tế và lòng tự hào với nghề truyền thống.',
    bg: 'dark',
    frame: 'carved',
  },
]

export const CONTENT_STATE_COPY = {
  loading: 'Đang tải nội dung…',
  errorTitle: 'Chưa tải được nội dung',
  errorBody: 'Kết nối tới cửa hàng đang gián đoạn. Anh/chị thử tải lại, hoặc gọi để được tư vấn trực tiếp.',
  contactErrorTitle: 'Chưa tải được bản đồ và thông tin',
  contactErrorBody: 'Anh/chị vẫn có thể gọi hoặc nhắn Zalo cho cửa hàng. Địa chỉ: Làng nghề Đại Bái, Gia Bình, Bắc Ninh.',
  retry: 'Thử lại',
  call: 'Gọi cửa hàng',
  zalo: 'Nhắn Zalo',
}

export const BLOG_TAGS = ['Tất cả', 'Phong thủy', 'Hướng dẫn', 'Thờ cúng', 'Bảo quản', 'Văn hoá', 'Quà tặng'] as const

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'chon-tranh-theo-menh',
    tag: 'Phong thủy',
    title: 'Chọn tranh đồng theo tuổi và mệnh gia chủ',
    date: '24/09/2026',
    readMinutes: 6,
    excerpt: 'Mỗi mệnh hợp một nhóm đề tài và màu nền khác nhau. Bài viết tổng hợp cách chọn nhanh cho phòng khách.',
    body: {
      intro: 'Mỗi mệnh hợp một nhóm đề tài và màu nền khác nhau. Bài viết tổng hợp cách chọn nhanh cho phòng khách, dựa trên ngũ hành và hướng treo phổ biến trong nhà ở Việt Nam.',
      sections: [
        {
          heading: 'Chọn theo ngũ hành',
          paragraphs: [
            'Mệnh Kim và Thổ hợp với nền vàng đồng, khung antique ấm áp. Mệnh Mộc và Hỏa hợp với nền đỏ hoặc các gam trầm có ánh đồng. Mệnh Thủy nên ưu tiên nền tối, khung đen mun để giữ sự cân bằng.',
            'Đây là nguyên tắc tổng quát — nếu gia chủ đã xem tuổi kỹ, nghệ nhân có thể tư vấn phối màu nền và khung theo đúng lá số.',
          ],
        },
        {
          heading: 'Chọn theo vị trí treo',
          paragraphs: [
            'Phòng khách hướng Nam hợp tranh phong cảnh, tứ quý. Phòng làm việc hợp tranh chữ thư pháp mang ý chí, sự nghiệp. Phòng thờ luôn ưu tiên đề tài truyền thống, không dùng tranh trừu tượng.',
          ],
        },
      ],
    },
  },
  {
    id: 'kich-thuoc-tranh',
    tag: 'Hướng dẫn',
    title: 'Kích thước tranh đồng nào hợp với phòng khách của bạn?',
    date: '18/09/2026',
    readMinutes: 4,
    excerpt: 'Quy tắc 2/3 chiều dài sofa và những kích thước phổ biến nhất: 1.2m, 1.55m, 1.97m.',
    body: {
      intro: 'Quy tắc 2/3 chiều dài sofa và những kích thước phổ biến nhất: 1.2m, 1.55m, 1.97m. Chọn đúng kích thước giúp bức tranh cân đối với không gian thay vì bị lọt thỏm hoặc quá khổ.',
      sections: [
        {
          heading: 'Quy tắc 2/3',
          paragraphs: [
            'Chiều ngang tranh nên bằng khoảng hai phần ba chiều dài sofa hoặc kệ bên dưới. Sofa 1.8m hợp với tranh khoảng 1.2m; sofa 2.4m hợp với tranh 1.55m.',
          ],
        },
        {
          heading: 'Độ cao treo',
          paragraphs: [
            'Tâm tranh đặt ngang tầm mắt người đứng, khoảng 1.5–1.6m tính từ sàn. Khi treo trên sofa, mép dưới tranh cách lưng ghế 20–30cm.',
          ],
        },
      ],
    },
    table: {
      title: 'Kích thước phổ biến',
      rows: [
        { label: '1.2m × 0.8m', value: 'Phòng khách 15–20m²' },
        { label: '1.55m × 0.95m', value: 'Phòng khách 20–30m²' },
        { label: '1.97m × 1.1m', value: 'Sảnh, phòng lớn trên 30m²' },
      ],
    },
  },
  {
    id: 'bay-dinh-dong',
    tag: 'Thờ cúng',
    title: 'Cách bày đỉnh đồng và bộ tam sự đúng trên ban thờ',
    date: '10/09/2026',
    readMinutes: 5,
    excerpt: 'Vị trí đỉnh, hạc, chân nến theo lối bày truyền thống miền Bắc.',
    body: {
      intro: 'Vị trí đỉnh, hạc, chân nến theo lối bày truyền thống miền Bắc — giúp ban thờ vừa trang nghiêm vừa thuận theo phong tục.',
      sections: [
        {
          heading: 'Bố cục cơ bản',
          paragraphs: [
            'Đỉnh đồng đặt chính giữa, ngay trước bát hương. Đôi hạc thờ đặt hai bên, chân nến hoặc đèn thờ đặt ngoài cùng, đối xứng qua trục giữa ban thờ.',
          ],
        },
      ],
    },
  },
  {
    id: 'bao-quan-do-dong',
    tag: 'Bảo quản',
    title: 'Lau chùi và bảo quản đồ đồng để luôn sáng đẹp',
    date: '02/09/2026',
    readMinutes: 3,
    excerpt: 'Những việc nên và không nên làm để lớp hoàn thiện giả cổ không bị mất.',
    body: {
      intro: 'Những việc nên và không nên làm để lớp hoàn thiện giả cổ không bị mất theo thời gian.',
      sections: [
        {
          heading: 'Nên làm',
          paragraphs: ['Lau bằng khăn mềm, khô. Đặt nơi khô ráo, tránh ẩm trực tiếp và ánh nắng gắt kéo dài.'],
        },
        {
          heading: 'Không nên',
          paragraphs: ['Tránh dùng hóa chất tẩy rửa mạnh hoặc giấy nhám — sẽ làm mất lớp patina cổ được xử lý thủ công.'],
        },
      ],
    },
  },
  {
    id: 'y-nghia-mat-trong',
    tag: 'Văn hoá',
    title: 'Ý nghĩa hoa văn trên mặt trống đồng Đông Sơn',
    date: '26/08/2026',
    readMinutes: 7,
    excerpt: 'Ngôi sao 14 cánh, chim Lạc và vòng hoa văn kể lại đời sống người Việt cổ.',
    body: {
      intro: 'Ngôi sao nhiều cánh ở tâm mặt trống, đàn chim Lạc và các vòng hoa văn đồng tâm kể lại đời sống, tín ngưỡng của người Việt cổ thời Đông Sơn.',
      sections: [
        {
          heading: 'Ngôi sao trung tâm',
          paragraphs: ['Số cánh sao (thường 12–14 cánh) tượng trưng cho mặt trời — tín ngưỡng phồn thực và nông nghiệp lúa nước.'],
        },
      ],
    },
  },
  {
    id: 'qua-tang-tan-gia',
    tag: 'Quà tặng',
    title: 'Gợi ý quà tân gia bằng đồng theo ngân sách',
    date: '19/08/2026',
    readMinutes: 4,
    excerpt: 'Từ vài trăm nghìn tới vài triệu: những món nhỏ để bàn mà vẫn trang trọng.',
    body: {
      intro: 'Từ vài trăm nghìn tới vài triệu: những món nhỏ để bàn mà vẫn trang trọng, phù hợp tặng tân gia.',
      sections: [
        {
          heading: 'Dưới 1 triệu',
          paragraphs: ['Tượng linh vật phong thủy cỡ nhỏ, chân đèn đơn — dễ chọn, luôn hợp không gian mới.'],
        },
      ],
    },
  },
]

// ── Home ─────────────────────────────────────────────────────────────────────

export interface OccasionCard {
  id: string
  title: string
  subtitle: string
  picks: string
  fromPrice: number
  tag?: string
  dark?: boolean
  href: string
}

export const HOME_OCCASIONS: OccasionCard[] = [
  {
    id: 'bieu',
    title: 'Biếu sếp, đối tác',
    subtitle: 'Trang trọng, ý nghĩa thăng tiến và thành công',
    picks: 'Mã Đáo Thành Công · Cửu Ngư Quần Hội',
    fromPrice: 11200000,
    tag: 'Kèm hộp quà và thiệp',
    dark: true,
    href: '/categories',
  },
  {
    id: 'bome',
    title: 'Tặng bố mẹ, mừng thọ',
    subtitle: 'Gợi nhớ cội nguồn, cầu phúc thọ an khang',
    picks: 'Cội Nguồn Quê Hương · Đỉnh đồng',
    fromPrice: 2500000,
    href: '/categories',
  },
  {
    id: 'tangia',
    title: 'Mừng tân gia',
    subtitle: 'Rước lộc, giữ vững nền nhà mới',
    picks: 'Tranh Núi Nước · Tranh Hoa Tím',
    fromPrice: 1800000,
    href: '/categories',
  },
  {
    id: 'nha',
    title: 'Trang trí nhà, phòng thờ',
    subtitle: 'Không gian trang nghiêm cho gia tiên',
    picks: 'Đỉnh đồng 3 chân · Bộ tam sự',
    fromPrice: 4500000,
    href: '/categories',
  },
]

export const OCCASIONS_COPY = {
  eyebrow: 'Chọn quà theo dịp',
  title: 'Mỗi món quà, một lời chúc',
  action: 'Nhờ tư vấn qua Zalo',
}

export const CRAFT_STEPS: { title: string; body: string }[] = [
  { title: 'Vẽ mẫu', body: 'Phác hoạ bố cục, hoa văn lên giấy' },
  { title: 'Chọn đồng', body: 'Đồng vàng, đồng đỏ đúng độ dày cho từng mẫu' },
  { title: 'Gò nổi', body: 'Gò từ mặt sau để tạo khối' },
  { title: 'Chạm chi tiết', body: 'Chạm từng nét nhỏ ở mặt trước' },
  { title: 'Xử lý màu', body: 'Hun, đánh bóng, giả cổ theo mẫu' },
  { title: 'Hoàn thiện', body: 'Phủ bảo vệ, lắp khung, kiểm tra' },
]

export const CRAFT_DETAIL_COPY = {
  eyebrow: 'Chi tiết thủ công',
  title: 'Nhìn gần từng đường chạm',
  stepsTitle: '6 công đoạn thủ công cho mỗi sản phẩm',
  note: 'Kích thước, độ dày đồng, chất liệu khung và thời gian chế tác ghi riêng trên trang từng sản phẩm.',
  photoCaption: 'Ảnh xưởng · thay bằng ảnh thật',
}

export const CRAFT_BAND_COPY = {
  eyebrow: 'Làng Đại Bái',
  title: 'Hành trình của lửa, búa và bàn tay người thợ',
  body: 'Người thợ đồng làm việc qua nhiều công đoạn: vẽ mẫu, chọn đồng, gò nổi, chạm chi tiết, xử lý màu và hoàn thiện. Mỗi đường nét đều đòi hỏi sự kiên nhẫn và đôi tay chắc nghề.',
  link: 'Câu chuyện làng nghề →',
  photoCaption: 'Ảnh xưởng · thay bằng ảnh thật',
}

export const GIFT_SERVICE_COPY = {
  eyebrow: 'Quà biếu trọn gói',
  title: 'Món quà được chuẩn bị chu đáo đến từng chi tiết',
  items: [
    { title: 'Hộp gỗ lót nhung', body: 'Khắc logo Trường Thơi, vừa khít từng tác phẩm.' },
    { title: 'Khắc tên hoặc lời chúc', body: 'Trên tấm đồng nhỏ gắn ở khung, miễn phí.' },
    { title: 'Thiệp thư pháp viết tay', body: 'Nội dung theo ý bạn, viết bằng bút lông.' },
    { title: 'Giấy chứng nhận chế tác', body: 'Ghi chất liệu, kích thước, chữ ký nghệ nhân.' },
    { title: 'Giao tận tay, lắp đặt', body: 'Không kèm giá trong hộp. Hẹn giờ giao theo người nhận.' },
  ],
  photoCaption: 'Ảnh chụp hộp quà mở nắp: tranh, thiệp và giấy chứng nhận',
  primaryCta: 'Tư vấn quà biếu',
}

export const CATEGORY_INDEX_COPY = {
  title: 'Danh mục sản phẩm',
  sub: 'Chọn theo mục đích: trang trí, thờ cúng hay làm quà tặng.',
}

// ── Listing and states ───────────────────────────────────────────────────────

export const LISTING_COPY = {
  moreButton: 'Xem thêm sản phẩm',
  empty: {
    title: 'Danh mục đang được cập nhật',
    body: 'Sản phẩm trong danh mục này sẽ sớm có mặt. Trong lúc chờ, anh/chị có thể xem các danh mục khác.',
    primary: 'Xem danh mục khác',
    secondary: 'Xem tất cả sản phẩm',
  },
  filtered: {
    title: 'Không có sản phẩm khớp bộ lọc',
    body: 'Chưa có sản phẩm khớp các bộ lọc đã chọn. Bỏ bớt một bộ lọc, hoặc nhắn Zalo để được tư vấn đặt làm riêng.',
    primary: 'Xoá bộ lọc',
    secondary: 'Liên hệ tư vấn',
  },
  error: {
    title: 'Chưa tải được sản phẩm',
    body: 'Kết nối tới cửa hàng đang gián đoạn. Bộ lọc anh/chị đã chọn vẫn được giữ lại.',
    retry: 'Thử lại',
    call: 'Gọi cửa hàng',
  },
}

export const CATEGORIES_INDEX_STATE = {
  error: {
    title: 'Chưa tải được danh mục',
    body: 'Kết nối tới cửa hàng đang gián đoạn. Anh/chị thử tải lại, hoặc gọi để được tư vấn trực tiếp.',
    retry: 'Thử lại',
    call: 'Gọi cửa hàng',
  },
  empty: {
    title: 'Danh mục đang được cập nhật',
    body: 'Các danh mục sản phẩm sẽ sớm có mặt. Trong lúc chờ, anh/chị có thể xem tất cả sản phẩm.',
    action: 'Xem tất cả sản phẩm',
  },
}

// No-results copy for search (overlay, header dropdown, listing with ?q=). Board: st-search-*.
export const SEARCH_EMPTY_COPY = {
  title: 'Không tìm thấy kết quả',
  body: (q: string) => `Không có sản phẩm khớp “${q}”.`,
  tipsTitle: 'Thử tìm cách khác',
  tips: [
    'Dùng ít từ hơn, ví dụ “tranh rồng”',
    'Bỏ kích thước, chọn sau ở trang sản phẩm',
    'Kiểm tra dấu tiếng Việt',
  ],
  suggestions: [
    { label: 'Xem theo danh mục', href: '/categories' },
    { label: 'Xem tất cả sản phẩm', href: '/products' },
  ],
}

// Active-filter chips above the listing grid (board: list-a-*). Price labels live in
// FilterSidebar; the tone names are the swatch names shown in the filter.
export const LISTING_CHIP_COPY = {
  clearAll: 'Xóa tất cả',
  remove: 'Bỏ lọc',
  tones: {
    gold: 'Nền vàng',
    red: 'Nền đỏ',
    bronze: 'Nền nâu đồng',
    dark: 'Nền đen cổ',
  } as Record<string, string>,
}

// ── Product page, share, saved (board: pdp-a-*, pdp-camp-*, share-*, saved-*, sync-*) ────

export const PDP_COPY = {
  tabs: {
    description: 'Mô tả',
    meaning: 'Ý nghĩa',
    specs: 'Thông số',
    reviews: 'Đánh giá',
  },
  sizeLabel: 'Kích thước',
  surchargeNone: 'Đã gồm',
  freeOption: 'Miễn phí',
  inclVat: 'Đã gồm VAT',
  subtotal: 'Tạm tính',
  compare: 'So sánh biến thể',
  addToCart: 'Thêm vào giỏ',
  buyNow: 'Mua ngay',
  save: 'Lưu',
  saved: 'Đã lưu',
  saveLabel: 'Lưu sản phẩm',
  unsaveLabel: 'Bỏ lưu sản phẩm',
  consult: 'Cần tư vấn kích thước? Gọi',
  consultOr: 'hoặc',
  consultZalo: 'nhắn Zalo',
  addToCartShort: 'Thêm giỏ',
  specsCardTitle: 'Thông số chính',
  relatedEyebrow: 'Gợi ý',
  relatedTitle: 'Sản phẩm liên quan',
  recentEyebrow: 'Gợi nhớ',
  recentTitle: 'Đã xem gần đây',
  placeTitle: 'Vị trí phù hợp',
  zodiacTitle: 'Tuổi phong thủy',
  aboutTitle: 'Về tác phẩm',
  reviewFormTitle: 'Viết đánh giá',
  campaignSaving: (amount: string) => `tiết kiệm ${amount}`,
  campaignOriginal: 'Giá gốc',
}

export const SHARE_COPY = {
  trigger: 'Chia sẻ sản phẩm',
  title: 'Chia sẻ sản phẩm',
  targets: {
    zalo: 'Zalo',
    zaloOpening: 'Đang mở Zalo…',
    facebook: 'Facebook',
    messenger: 'Messenger',
    copy: 'Sao chép liên kết',
    copied: 'Đã sao chép',
    nativeShare: 'Chia sẻ bằng ứng dụng khác…',
  },
  copiedLine: 'Đã sao chép liên kết. Dán vào tin nhắn để gửi.',
  fallbackTitle: 'Trình duyệt chặn sao chép. Chọn liên kết bên dưới và sao chép thủ công.',
  linkLabel: 'Liên kết sản phẩm',
  note: 'Liên kết giữ nguyên lựa chọn nền, khung và kích thước.',
  close: 'Đóng',
}

export const SAVED_COPY = {
  title: 'Sản phẩm đã lưu',
  deviceNote: 'đang lưu trên trình duyệt này',
  syncedNote: (phone: string) => `đồng bộ với ${phone}`,
  addAll: 'Thêm tất cả vào giỏ',
  emptyTitle: 'Chưa có sản phẩm yêu thích',
  emptyBody: 'Bấm vào biểu tượng trái tim ở trang sản phẩm để lưu tác phẩm.',
  emptyCta: 'Khám phá sản phẩm',
  remove: 'Bỏ lưu',
  countSuffix: 'sản phẩm',
}

export const SAVED_SYNC_COPY = {
  eyebrow: 'Đồng bộ đã lưu',
  title: 'Lưu danh sách theo số điện thoại',
  body: 'Dùng cùng số điện thoại đặt hàng. Mở trên máy khác bằng mã OTP gửi qua Zalo hoặc SMS.',
  phoneLabel: 'Số điện thoại',
  phonePlaceholder: 'Số điện thoại',
  consent: 'Tôi đồng ý để cửa hàng lưu số điện thoại cho danh sách đã lưu.',
  sendOtp: 'Gửi mã OTP',
  sending: 'Đang gửi…',
  phoneInvalid: 'Số điện thoại chưa đúng, cần 10 số.',
  otpTitle: 'Nhập mã xác minh',
  otpBody: (phone: string) => `Mã 6 số đã gửi qua Zalo tới ${phone}.`,
  otpLabel: 'Mã xác minh 6 số',
  verify: 'Xác minh',
  verifying: 'Đang xác minh…',
  changePhone: 'Đổi số',
  resendIn: (time: string) => `Gửi lại mã sau ${time}`,
  resend: 'Gửi lại mã',
  limitNote: 'tối đa 5 lần / giờ',
  limitReached: 'Bạn đã gửi đủ 5 mã trong 1 giờ. Thử lại sau.',
  otpWrong: 'Mã không đúng. Kiểm tra lại mã trong tin nhắn.',
  otpExpired: 'Mã đã hết hạn hoặc đã dùng. Bấm gửi lại mã.',
  onTitle: (phone: string) => `Đang đồng bộ với ${phone}`,
  onBody: 'Mở trang Đã lưu trên máy khác, xác minh cùng số điện thoại để xem danh sách này.',
  turnOff: 'Tắt đồng bộ',
  turningOff: 'Đang tắt…',
  unavailable: 'Đồng bộ chưa khả dụng, lưu trên thiết bị này.',
  error: 'Chưa thực hiện được. Thử lại sau, hoặc gọi cửa hàng.',
  sessionExpired: 'Phiên đồng bộ đã hết hạn. Xác minh lại số điện thoại.',
  turnOffFailed: 'Chưa tắt được đồng bộ. Thử lại.',
}

// TODO(Phase 9): bank account details are PLACEHOLDERS. The owner must supply the real
// account before launch, and the settings endpoint should then serve them (CMS-editable).
// Until then the transfer panel shows "[chưa cấu hình]". Do not replace with a real
// number that has not been confirmed by the owner.
export const BANK_ACCOUNT = {
  bankName: '[chưa cấu hình]',
  accountName: '[chưa cấu hình]',
  accountNumber: '[chưa cấu hình]',
}

export const CART_COPY = {
  title: 'Giỏ hàng',
  countSuffix: 'sản phẩm',
  colProduct: 'Sản phẩm',
  colQty: 'Số lượng',
  colTotal: 'Thành tiền',
  listLabel: 'Sản phẩm trong giỏ',
  changeOptions: 'Đổi tùy chọn',
  remove: 'Xóa',
  decrease: 'Giảm số lượng',
  increase: 'Tăng số lượng',
  continueShopping: '← Tiếp tục mua sắm',
  endedNotice: 'Khuyến mãi đã kết thúc, giá được cập nhật.',
  summaryTitle: 'Tóm tắt đơn hàng',
  subtotal: 'Tạm tính',
  shipping: 'Phí giao hàng',
  shippingValue: 'Miễn phí',
  installation: 'Lắp đặt',
  installationValue: 'Miễn phí nội thành HN',
  total: 'Tổng cộng',
  checkout: 'Tiến hành đặt hàng',
  staffNote: 'Nhân viên sẽ gọi xác nhận đơn trong 30 phút (giờ hành chính).',
  emptyTitle: 'Giỏ hàng trống',
  emptyBody: 'Khám phá bộ sưu tập tranh đồng và đỉnh đồng truyền thống.',
  emptyCta: 'Tiếp tục mua sắm',
}

export const CHECKOUT_COPY = {
  title: 'Đặt hàng',
  recipientTitle: 'Thông tin người nhận',
  nameLabel: 'Họ và tên',
  namePlaceholder: 'Nguyễn Văn A',
  phoneLabel: 'Số điện thoại',
  phonePlaceholder: '0912 345 678',
  addressLabel: 'Địa chỉ giao hàng',
  addressPlaceholder: 'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành',
  noteLabel: 'Ghi chú',
  notePlaceholder: 'Thời gian nhận, yêu cầu lắp đặt…',
  paymentTitle: 'Thanh toán',
  methods: {
    cod: { label: 'Thanh toán khi nhận', desc: 'COD' },
    transfer: { label: 'Chuyển khoản', desc: 'Nhận STK sau khi đặt' },
    showroom: { label: 'Tại showroom', desc: 'Làng Đại Bái' },
  },
  itemsTitle: 'Sản phẩm',
  submit: 'Xác nhận đặt hàng',
  submitting: 'Đang xử lý...',
  back: '← Quay lại giỏ hàng',
  terms: 'Bằng việc đặt hàng, bạn đồng ý với chính sách bảo hành & đổi trả.',
  staffNote: 'Nhân viên sẽ gọi xác nhận đơn trong 30 phút (giờ hành chính).',
}

export const BANK_COPY = {
  title: 'Thông tin chuyển khoản',
  checkoutIntro: 'Sau khi đặt hàng, chuyển khoản vào tài khoản dưới đây. Nội dung chuyển khoản là mã đơn hàng.',
  bankLabel: 'Ngân hàng',
  accountNameLabel: 'Chủ tài khoản',
  accountNumberLabel: 'Số tài khoản',
  amountLabel: 'Số tiền',
  memoLabel: 'Nội dung chuyển khoản',
  memoPending: 'Mã sẽ hiển thị sau khi đặt hàng',
  memoHint: 'Ghi đúng nội dung này để đơn được xác nhận nhanh.',
  staffNote: 'Nhân viên sẽ xác nhận trong 30 phút (giờ hành chính).',
  copy: 'Sao chép',
  copied: 'Đã sao chép',
  copyAria: (label: string) => `Sao chép ${label}`,
  loading: 'Đang tải thông tin tài khoản…',
  errorBody: 'Chưa tải được số tài khoản. Thử lại, hoặc gọi cửa hàng hoặc nhắn Zalo để nhận thông tin chuyển khoản.',
  retry: 'Thử lại',
  callShop: 'Gọi cửa hàng',
  zalo: 'Nhắn Zalo',
  paidButton: 'Tôi đã chuyển khoản',
  paidTitle: 'Đã ghi nhận, chúng tôi sẽ kiểm tra.',
  paidBody: 'Ghi nhận này chỉ lưu trên thiết bị này, chưa phải xác nhận thanh toán.',
}

export const CONFIRM_COPY = {
  title: 'Đặt hàng thành công',
  body: (phone: string) => `Đơn của bạn đã được ghi nhận. Chúng tôi sẽ gọi ${phone} để xác nhận.`,
  codeLabel: 'Mã đơn hàng',
  codeHint: 'Dùng mã này cùng số điện thoại để tra cứu đơn hàng.',
  nextTitle: 'Điều gì tiếp theo?',
  nextBody: 'Nhân viên sẽ gọi xác nhận đơn trong 30 phút, trong giờ hành chính.',
  track: 'Theo dõi đơn hàng',
  continueShopping: 'Tiếp tục mua sắm',
  itemsTitle: 'Đơn hàng của bạn',
  paymentLabel: 'Thanh toán',
}

// Order lookup (/orders) and order detail (/orders/[id]). Board: orders-*, lk-*, st-lookup-offline-*, order-*.
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_confirm: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  completed: 'Đã giao',
  cancelled: 'Đã hủy',
}

export const ORDER_STEPS: { status: string; label: string }[] = [
  { status: 'pending_confirm', label: 'Đã đặt' },
  { status: 'confirmed', label: 'Đã xác nhận' },
  { status: 'processing', label: 'Đang xử lý' },
  { status: 'shipped', label: 'Đang giao' },
  { status: 'completed', label: 'Hoàn thành' },
]

export const ORDER_LOOKUP_COPY = {
  title: 'Tra cứu đơn hàng',
  sub: 'Nhập số điện thoại đã dùng khi đặt hàng.',
  phoneLabel: 'Số điện thoại đặt hàng',
  phonePlaceholder: '09xx xxx xxx',
  phoneSubmit: 'Tra cứu',
  phoneInvalid: 'Vui lòng nhập số điện thoại hợp lệ.',
  phoneNote: 'Chỉ hiện thông tin tóm tắt. Để xem địa chỉ và chi tiết, bạn cần mã tra cứu.',
  sample: 'Dùng số mẫu',
  listCount: (n: number) => `${n} đơn hàng của`,
  changePhone: 'Đổi số',
  listColCode: 'Mã đơn',
  listColDate: 'Ngày đặt',
  listColItems: 'Sản phẩm',
  listColStatus: 'Trạng thái',
  viewDetail: 'Xem chi tiết →',
  listMaskedNote: 'Giá tiền, địa chỉ và tên người nhận được ẩn cho tới khi xác minh.',
  emptyTitle: 'Không tìm thấy đơn hàng',
  emptyBody: 'Vui lòng kiểm tra lại số điện thoại, hoặc liên hệ hotline để được hỗ trợ.',
  requestFailed: 'Có lỗi khi tra cứu đơn hàng.',
  verifyTitle: (code: string) => `Xác minh để xem đơn ${code}`,
  verifyBody: 'Để bảo vệ địa chỉ và thông tin của bạn, vui lòng nhập mã tra cứu 6 ký tự.',
  verifyTitleDirect: 'Xác minh để xem đơn hàng',
  verifyPhoneLabel: 'Số điện thoại đặt hàng',
  codeLabel: 'Mã tra cứu',
  codePlaceholder: 'VD: 3F9A1C',
  codeHint: 'Mã tra cứu có trong trang xác nhận sau khi đặt hàng.',
  codeLength: 'Mã tra cứu gồm 6 ký tự.',
  tabCode: 'Nhập mã tra cứu',
  tabOtp: 'Nhận mã OTP',
  otpSoon: 'Sắp có',
  wrongCode: 'Mã tra cứu không đúng.',
  remaining: (n: number) => `Còn ${n} lần thử.`,
  verifying: 'Đang xác minh...',
  verifySubmit: 'Xem chi tiết đơn',
  verifyError: 'Có lỗi khi xác minh. Vui lòng thử lại.',
  detailError: 'Có lỗi khi tải thông tin đơn hàng.',
  sessionInvalid: 'Phiên xác minh không hợp lệ. Vui lòng thử lại.',
  backToList: '← Chọn đơn khác',
  forgotCode: (hotline: string) => `Quên mã? Gọi ${hotline}`,
  lockTitle: 'Tạm khóa tra cứu',
  unlockIn: 'Mở lại sau',
  lockTitleCountdown: (mm: string) => `Tạm khóa tra cứu · còn ${mm}`,
  lockBody: 'Bạn đã nhập sai quá 5 lần. Để bảo vệ thông tin khách hàng, việc tra cứu tạm dừng. Nếu cần gấp, hãy liên hệ trực tiếp.',
  lockUnknownTime: 'Vui lòng thử lại sau hoặc liên hệ trực tiếp.',
  lockEnded: 'Đã hết thời gian khóa. Nhập lại mã tra cứu.',
  callLabel: (hotline: string) => `Gọi ${hotline}`,
  zaloLabel: 'Nhắn Zalo',
  verifiedBanner: 'Đã xác minh · phiên xem hết hạn sau 15 phút',
  sessionEnded: 'Phiên xem đã hết hạn. Nhập lại mã tra cứu để xem đơn.',
  back: '← Về danh sách đơn',
  otherOrder: '← Tra cứu đơn khác',
  lookupByPhone: '← Tra cứu bằng số điện thoại',
  offlineTitle: 'Không kết nối được máy chủ',
  offlineBody:
    'Hệ thống tra cứu đang tạm gián đoạn. Đơn hàng của anh/chị không bị ảnh hưởng. Bấm “Thử lại” sau ít phút, hoặc gọi cửa hàng và đọc mã đơn để được báo trạng thái.',
  offlineRetry: 'Thử lại',
  offlineRetrying: 'Đang thử lại...',
  offlineContact: 'Liên hệ cửa hàng để được hỗ trợ.',
}

export const ORDER_DETAIL_COPY = {
  orderPrefix: 'Đơn',
  placedOn: (date: string) => `Đặt ngày ${date}`,
  progressTitle: 'Tiến trình',
  itemsTitle: 'Sản phẩm',
  paymentTitle: 'Thanh toán',
  subtotal: 'Tạm tính',
  shipping: 'Phí giao hàng',
  shippingFree: 'Miễn phí',
  paymentMethod: 'Phương thức',
  paymentCod: 'COD',
  total: 'Tổng cộng',
  deliveryTitle: 'Giao đến',
  maskedNote: 'Địa chỉ và số điện thoại được che một phần kể cả sau khi xác minh.',
  contactOrder: 'Liên hệ về đơn hàng',
  cancelOrder: 'Hủy đơn hàng',
  cancelConfirm: 'Bạn chắc chắn muốn hủy đơn hàng này?',
  cancelKeep: 'Giữ đơn',
  cancelYes: 'Hủy đơn',
  cancelling: 'Đang hủy...',
  cancelFailed: 'Không thể hủy đơn hàng. Vui lòng thử lại.',
  cancelNotAllowed: 'Đơn hàng không còn có thể hủy.',
  cancelledTitle: 'Đơn hàng đã hủy',
  cancelledBody: 'Liên hệ hotline nếu bạn cần hỗ trợ thêm.',
  noAddress: '—',
  customerFallback: 'Khách hàng',
  continueShopping: 'Tiếp tục mua sắm',
  notFound: 'Không tìm thấy đơn hàng.',
  loading: 'Đang tải...',
  lookupAgain: 'Tra cứu đơn hàng',
  bannerTitles: {
    pending_confirm: 'Đặt hàng thành công!',
    confirmed: 'Đơn hàng đã xác nhận',
    processing: 'Đang chuẩn bị đơn hàng',
    shipped: 'Đang trên đường giao',
    completed: 'Giao hàng thành công',
  } as Record<string, string>,
  bannerBodies: {
    pending_confirm: 'Chúng tôi sẽ liên hệ xác nhận trong 30 phút (giờ hành chính).',
    confirmed: 'Chúng tôi đang chuẩn bị sản phẩm cho bạn.',
    processing: 'Sản phẩm của bạn đang được chế tác và hoàn thiện.',
    shipped: 'Đơn hàng đang được vận chuyển đến địa chỉ của bạn.',
    completed: 'Cảm ơn bạn đã tin tưởng Đồ Đồng Trường Thơi.',
  } as Record<string, string>,
}

// CMS (admin) copy: shell navigation and dashboard. Placeholder-free UI text only.
export const ADMIN_COPY = {
  brandName: 'Trường Thơi',
  brandSub: 'Quản trị nội dung',
  nav: {
    dashboard: 'Tổng quan',
    orders: 'Đơn hàng',
    products: 'Sản phẩm',
    campaigns: 'Khuyến mãi',
    categories: 'Danh mục',
    images: 'Ảnh',
    banners: 'Banner',
    customerPhotos: 'Ảnh khách hàng',
    contacts: 'Liên hệ',
    contactMessages: 'Tin nhắn liên hệ',
    auditLog: 'Nhật ký',
    reviews: 'Đánh giá',
    settings: 'Cài đặt',
  },
  menuOpen: 'Mở menu',
  menuClose: 'Đóng menu',
  logout: 'Đăng xuất',
  dashboard: {
    title: 'Tổng quan',
    sub: 'Số liệu cửa hàng và việc cần xử lý',
    loading: 'Đang tải số liệu',
    loadError: 'Không tải được',
    retry: 'Thử lại',
    viewList: 'Xem danh sách',
    kpi: {
      products: 'Sản phẩm',
      categories: 'Danh mục',
      pendingOrders: 'Đơn chờ xác nhận',
      activeCampaigns: 'Khuyến mãi đang chạy',
    },
    kpiHint: {
      products: 'Tổng số sản phẩm',
      categories: 'Tổng số danh mục',
      pendingOrders: 'Cần xác nhận với khách',
      activeCampaigns: 'Đang áp dụng trên cửa hàng',
    },
    queueTitle: 'Việc cần làm',
    queue: {
      pendingOrders: 'Đơn chờ xác nhận',
      unhandled: 'Tin nhắn chưa xử lý',
      pendingReviews: 'Đánh giá chờ duyệt',
    },
    oldestLessThanHour: 'Cũ nhất: dưới 1 giờ trước',
    oldestHours: (n: number) => `Cũ nhất: ${n} giờ trước`,
    oldestDays: (n: number) => `Cũ nhất: ${n} ngày trước`,
    clearTitle: 'Không có việc cần xử lý',
    clearBody: 'Không còn đơn chờ xác nhận, tin nhắn hay đánh giá tồn đọng.',
    recentTitle: 'Đơn gần đây',
    viewAllOrders: 'Tất cả đơn',
    recentLoadError: 'Không tải được đơn gần đây',
    recentLoadErrorBody: 'Các số liệu khác vẫn hiển thị. Thử lại sau ít phút.',
    emptyTitle: 'Chưa có đơn hàng',
    emptyBody: 'Đơn mới từ website sẽ hiện ở đây. Kiểm tra banner và khuyến mãi đang chạy để kéo khách.',
    emptyCta: 'Xem khuyến mãi',
    customerFallback: 'Khách hàng',
  },
  orderStatus: {
    pending_confirm: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  } as Record<string, string>,
  orders: {
    title: 'Đơn hàng',
    sub: 'Theo dõi và cập nhật trạng thái đơn',
    loading: 'Đang tải đơn hàng',
    loadError: 'Không tải được danh sách đơn',
    loadErrorBody: 'Kiểm tra kết nối mạng rồi thử lại. Nếu lỗi lặp lại, báo cho quản trị viên.',
    emptyTitle: 'Chưa có đơn hàng',
    emptyBody: 'Đơn mới từ website sẽ hiện ở đây.',
    noMatchTitle: 'Không có đơn phù hợp',
    noMatchBody: 'Không tìm thấy đơn khớp với bộ lọc hiện tại. Thử bỏ bớt bộ lọc.',
    clearFilters: 'Xoá bộ lọc',
    retry: 'Thử lại',
    searchPlaceholder: 'Tìm mã đơn, tên hoặc số điện thoại',
    searchLabel: 'Tìm đơn hàng',
    statusAll: 'Tất cả',
    dateFrom: 'Từ ngày',
    dateTo: 'Đến ngày',
    selectMode: 'Chọn',
    selectModeDone: 'Xong',
    selectAll: 'Chọn tất cả đơn trên trang',
    selectRow: (code: string) => `Chọn đơn ${code}`,
    selectedCount: (n: number) => `Đã chọn ${n} đơn`,
    clearSelection: 'Bỏ chọn',
    bulkTarget: 'Trạng thái mới',
    bulkTargetPlaceholder: 'Chọn trạng thái',
    bulkApply: 'Chuyển trạng thái',
    bulkRunning: (done: number, total: number) => `Đang cập nhật ${done}/${total}`,
    bulkDone: (ok: number, total: number, label: string) => `Đã chuyển ${ok}/${total} đơn sang “${label}”.`,
    bulkFailed: (n: number) => `${n} đơn chưa cập nhật`,
    bulkFailedHint: 'Các đơn này vẫn được chọn để thử lại.',
    bulkCancelConfirm: (n: number) => `Hủy ${n} đơn đã chọn? Trạng thái sẽ đổi thành “Đã hủy”.`,
    dismiss: 'Đóng',
    exportCsv: 'Xuất CSV',
    exporting: 'Đang xuất…',
    exported: (file: string, n: number) => `Đã tải xuống ${file} (${n} đơn)`,
    exportEmpty: 'Không có đơn để xuất',
    showing: (from: number, to: number, total: number) => `Hiển thị ${from}–${to} trong ${total} đơn`,
    pageOf: (page: number, pages: number) => `Trang ${page} / ${pages}`,
    prev: 'Trang trước',
    next: 'Trang sau',
    columns: {
      code: 'Mã đơn',
      customer: 'Khách hàng',
      phone: 'Điện thoại',
      items: 'Sản phẩm',
      total: 'Tổng tiền',
      status: 'Trạng thái',
      date: 'Ngày đặt',
    },
    itemsMore: (n: number) => `+${n} sản phẩm`,
    customerFallback: 'Khách lẻ',
    open: 'Chi tiết',
    openOrder: (code: string) => `Mở đơn ${code}`,
    callCustomer: (name: string) => `Gọi ${name}`,
    updatingRow: 'Đang cập nhật',
  },
  orderDetail: {
    back: 'Đơn hàng',
    loading: 'Đang tải đơn hàng',
    loadError: 'Không tải được đơn hàng',
    loadErrorBody: 'Máy chủ không phản hồi hoặc đơn không tồn tại. Dữ liệu đơn không bị ảnh hưởng.',
    retry: 'Thử lại',
    placedAt: (time: string) => `Đặt lúc ${time}`,
    print: 'In hoá đơn',
    cancel: 'Hủy đơn',
    cancelConfirm: (code: string) => `Hủy đơn ${code}? Trạng thái sẽ đổi thành “Đã hủy”.`,
    nextLabel: 'Bước tiếp theo',
    next: {
      pending_confirm: 'Xác nhận đơn',
      confirmed: 'Bắt đầu chế tác',
      processing: 'Giao cho vận chuyển',
      shipped: 'Hoàn thành đơn',
    } as Record<string, string>,
    hints: {
      pending_confirm: 'Gọi khách xác nhận mẫu, kích thước và địa chỉ trước khi xác nhận.',
      confirmed: 'Chuyển đơn cho xưởng khi đã chốt mẫu và nhận cọc (nếu có).',
      processing: 'Khi hàng rời xưởng, chuyển sang đang giao.',
      shipped: 'Hoàn thành khi khách đã nhận hàng.',
    } as Record<string, string>,
    finished: 'Đơn đã kết thúc, không còn bước tiếp theo.',
    cancelledBanner: 'Đơn này đã hủy.',
    updating: 'Đang cập nhật…',
    updated: 'Đã cập nhật đơn hàng',
    updateFailed: 'Không cập nhật được đơn. Trạng thái đã được khôi phục.',
    items: (n: number) => `Sản phẩm (${n})`,
    subtotal: 'Tạm tính',
    total: 'Tổng cộng',
    progress: 'Tiến trình đơn',
    progressNext: 'bước tiếp theo',
    customer: 'Khách hàng',
    phone: 'Điện thoại',
    call: 'Gọi',
    zalo: 'Zalo',
    copyPhone: 'Sao chép',
    phoneCopied: 'Đã sao chép số điện thoại',
    phoneCopyFailed: 'Không thể sao chép số điện thoại',
    address: 'Địa chỉ giao',
    noAddress: 'Chưa có địa chỉ',
    customerNote: 'Ghi chú của khách',
    noCustomerNote: 'Khách không ghi chú',
    payment: 'Thanh toán',
    paymentMethod: 'Hình thức',
    paymentUnknown: 'Không rõ',
    notes: 'Ghi chú nội bộ',
    notesHint: 'Chỉ nhân viên thấy',
    notesPlaceholder: 'Thêm ghi chú nội bộ…',
    noNotes: 'Chưa có ghi chú cho đơn này.',
    saveNotes: 'Lưu ghi chú',
    savingNotes: 'Đang lưu…',
    notesSaved: 'Đã lưu ghi chú',
    lineHeaders: { product: 'Sản phẩm', qty: 'SL', unit: 'Đơn giá', total: 'Thành tiền' },
    customerSection: 'Khách hàng',
  },
  invoice: {
    back: 'Quay lại đơn',
    print: 'In hoá đơn',
    paper: 'Khổ A4 · dọc',
    title: 'Hoá đơn bán hàng',
    number: 'Số',
    date: 'Ngày',
    buyer: 'Khách hàng',
    phone: 'Điện thoại',
    address: 'Địa chỉ',
    payment: 'Thanh toán',
    paymentUnknown: 'Chưa ghi nhận',
    no: 'STT',
    product: 'Sản phẩm',
    qty: 'SL',
    unit: 'Đơn giá',
    amount: 'Thành tiền',
    subtotal: 'Tạm tính',
    total: 'Tổng cộng',
    buyerSign: 'Người mua hàng',
    sellerSign: 'Người bán hàng',
    signHint: '(Ký, ghi rõ họ tên)',
    hotline: 'Hotline',
    thanks: 'Cảm ơn quý khách đã tin chọn đồ đồng Trường Thơi.',
    loadError: 'Không tải được hoá đơn',
    loadErrorBody: 'Máy chủ không phản hồi hoặc đơn không tồn tại. Thử lại sau ít phút.',
    retry: 'Thử lại',
  },
  inbox: {
    title: 'Tin nhắn liên hệ',
    subtitle: 'Gọi hoặc nhắn Zalo trong 2 giờ làm việc · đánh dấu đã xử lý sau khi tư vấn',
    loadError: 'Không tải được tin nhắn',
    loadErrorBody: 'Kiểm tra kết nối mạng rồi thử lại. Tin mới vẫn được lưu trên máy chủ.',
    retry: 'Thử lại',
    empty: 'Không còn tin chưa xử lý',
    emptyBody: 'Tin nhắn mới từ form liên hệ và trang sản phẩm sẽ hiện ở đây.',
    unhandled: 'Chưa xử lý',
    handled: 'Đã xử lý',
    call: 'Gọi',
    markHandled: 'Đánh dấu đã xử lý',
    undo: 'Hoàn tác',
    marking: 'Đang lưu…',
    markedHandled: 'Đã đánh dấu xử lý',
    markedUnhandled: 'Đã chuyển về chưa xử lý',
    updateError: 'Không cập nhật được trạng thái tin nhắn.',
  },
  auditLog: {
    title: 'Nhật ký',
    subtitle: 'Lịch sử thay đổi đơn hàng, sản phẩm, khuyến mãi',
    loading: 'Đang tải nhật ký',
    loadError: 'Không tải được nhật ký',
    loadErrorBody: 'Kiểm tra kết nối mạng rồi thử lại. Dữ liệu vẫn được lưu trên máy chủ.',
    retry: 'Thử lại',
    empty: 'Chưa có nhật ký',
    emptyBody: 'Các thay đổi trên đơn hàng, sản phẩm và khuyến mãi sẽ hiện ở đây.',
    allTypes: 'Tất cả',
    typeOrder: 'Đơn hàng',
    typeProduct: 'Sản phẩm',
    typeCampaign: 'Khuyến mãi',
    columns: {
      time: 'Thời gian',
      entity: 'Loại',
      entityId: 'ID',
      action: 'Hành động',
      actor: 'Người thực hiện',
      change: 'Thay đổi',
    },
    actionStatusChange: 'Cập nhật trạng thái',
    actionUpdate: 'Cập nhật',
    actionCreate: 'Tạo mới',
  },
}
