// Static placeholder content for the Cẩm nang (blog) section.
// There is no CMS/API for articles yet — replace this with a real data
// source (API route, headless CMS, or MDX files) when one exists. Keep this
// constant as the single place that needs to change.

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
