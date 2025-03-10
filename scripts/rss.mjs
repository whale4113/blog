import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import siteMetadata from '../data/siteMetadata.js'
import allEnUSTags from '../data/en-US/tag-data.json' with { type: 'json' }
import allZhCNTags from '../data/zh-CN/tag-data.json' with { type: 'json' }
import { allEnUSBlogs, allZhCNBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const allTags = (lang) => {
  switch (lang) {
    case 'en-US':
      return allEnUSTags
    case 'zh-CN':
      return allZhCNTags
    default:
      return {}
  }
}

const createTranslation = async (lng, ns = 'translation') => {
  const i18nInstance = createInstance()

  await i18nInstance
    .use(
      resourcesToBackend(
        (language, namespace) =>
          import(`../i18n/locales/${language}/${namespace}.json`, {
            assert: { type: 'json' },
          })
      )
    )
    .init({
      supportedLngs: ['en-US', 'zh-CN'],
      fallbackLng: 'en-US',
      lng,
      fallbackNS: 'translation',
      defaultNS: 'translation',
      ns,
      load: 'currentOnly',
    })

  return i18nInstance.getFixedT(lng, ns)
}

const generateRssItem = async (lang, config, post) => {
  const translateTag = await createTranslation(lang, 'tags')
  const translateAuthor = await createTranslation(lang, 'authors')

  const author = config.email
    ? `${config.email} (${translateAuthor(config.author)})`
    : translateAuthor(config.author)

  const link = new URL(`/${lang}/blogs/${post.slug}`, config.siteUrl)

  return `<item>
      <guid>${link}</guid>
      <title>${escape(post.title)}</title>
      <link>${link}</link>
      ${post.summary && `<description>${escape(post.summary)}</description>`}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${author}</author>
      ${post.tags && post.tags.map((t) => `<category>${translateTag(t)}</category>`).join('')}
    </item>`
}

const generateRss = async (lang, config, posts, page = 'feed.xml') => {
  const t = await createTranslation(lang)
  const translateAuthor = await createTranslation(lang, 'authors')
  const author = config.email
    ? `${config.email} (${translateAuthor(config.author)})`
    : translateAuthor(config.author)

  return `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(t(config.title))}</title>
    <link>${new URL(`/${lang}/blogs`, config.siteUrl)}</link>
    <description>${escape(t(config.description))}</description>
    <language>${lang}</language>
    <managingEditor>${author}</managingEditor>
    <webMaster>${author}</webMaster>
    <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
    <atom:link href="${new URL(`/${lang}/${page}`, config.siteUrl)}" rel="self" type="application/rss+xml"/>
    ${(await Promise.all(posts.map((post) => generateRssItem(lang, config, post)))).join('')}
  </channel>
</rss>`
}

async function generateRSS(lang, config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = await generateRss(lang, config, sortPosts(publishPosts))
    writeFileSync(`./${outputFolder}/${lang}/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(allTags(lang))) {
      const filteredPosts = allBlogs.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
      const rss = await generateRss(lang, config, filteredPosts, `/tags/${tag}/${page}`)
      const rssPath = path.join(outputFolder, lang, 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  }
}

const rss = () => {
  generateRSS('en-US', siteMetadata, allEnUSBlogs)
  generateRSS('zh-CN', siteMetadata, allZhCNBlogs)
  console.log('RSS feed generated...')
}
export default rss
