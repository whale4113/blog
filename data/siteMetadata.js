/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'title',
  author: 'lujunji',
  headerTitle: 'header-title',
  description: 'description',
  theme: 'system',
  siteUrl: 'https://lujunji.vercel.app/',
  siteRepo: 'https://github.com/lujunji4113/blog',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  github: 'https://github.com/lujunji4113/blog',
  locale: 'en-US',
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: 'search.json',
    },
  },
}

module.exports = siteMetadata
