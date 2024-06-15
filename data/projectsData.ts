interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

export const allProjects = (lang: string): Project[] => {
  switch (lang) {
    case 'en-US':
      return [
        {
          title: 'Cloud Document Converter',
          description:
            'A Chrome extension that supports copying and downloading Lark documents as Markdown.',
          imgSrc: '/static/images/cloud-document-converter.png',
          href: 'https://chromewebstore.google.com/detail/cloud-document-converter/ehkomhhcinhikfddnmklbloahaakploh',
        },
        {
          title: 'MOOC Helper',
          description:
            'Find answers to unit quizzes, unit assignments, and midterm/final tests for 中国大学MOOC.',
          imgSrc: '/static/images/mooc-helper.png',
          href: 'https://github.com/lujunji4113/mooc-helper',
        },
      ]
    case 'zh-CN':
      return [
        {
          title: 'Cloud Document Converter',
          description: '一个 Chrome 浏览器扩展，支持复制、下载飞书文档为 Markdown。',
          imgSrc: '/static/images/cloud-document-converter.png',
          href: 'https://chromewebstore.google.com/detail/cloud-document-converter/ehkomhhcinhikfddnmklbloahaakploh',
        },
        {
          title: 'MOOC Helper',
          description: '查询中国大学MOOC(慕课)课程的单元测验、单元作业、期中/期末测试的答案。',
          imgSrc: '/static/images/mooc-helper.png',
          href: 'https://github.com/lujunji4113/mooc-helper',
        },
      ]
    default:
      return []
  }
}
