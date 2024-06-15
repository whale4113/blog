import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { createTranslation } from '@/i18n/server'

interface PageSEOProps {
  lang: string
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export async function genPageMetadata({
  lang,
  title,
  description,
  image,
  ...rest
}: PageSEOProps): Promise<Metadata> {
  const { t } = await createTranslation(lang)
  const siteTitle = t(siteMetadata.title)
  const fallbackDescription = t(siteMetadata.description)

  return {
    title,
    description: description || fallbackDescription,
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: description || fallbackDescription,
      url: './',
      siteName: siteTitle,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: lang,
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteTitle}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
