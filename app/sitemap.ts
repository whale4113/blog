import { MetadataRoute } from 'next'
import { allEnUSBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { fallbackLng } from '@/i18n/settings'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allEnUSBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: new URL(post.path, siteUrl).toString(),
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blogs', 'projects', 'tags'].map((route) => ({
    url: new URL(`${fallbackLng}/${route}`, siteUrl).toString(),
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
