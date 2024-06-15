interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

export const allProjects = (lang: string): Project[] => {
  switch (lang) {
    case 'en-US':
      return []
    case 'zh-CN':
      return []
    default:
      return []
  }
}
