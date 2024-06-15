import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', siteMetadata.siteUrl).toString(),
    host: new URL(siteMetadata.siteUrl).host,
  }
}
