import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from '../theme-providers'
import { Metadata } from 'next'
import { createTranslation } from '@/i18n/server'
import { produce } from 'immer'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const { lang } = params
  const { t } = await createTranslation(lang)
  const siteTitle = t(siteMetadata.title)
  const siteDescription = t(siteMetadata.description)

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: './',
      siteName: siteTitle,
      images: [siteMetadata.socialBanner],
      locale: lang,
      type: 'website',
    },
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': new URL(`/${lang}/feed.xml`, siteMetadata.siteUrl).toString(),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: siteTitle,
      card: 'summary_large_image',
      images: [siteMetadata.socialBanner],
    },
  }
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { lang } = params

  return (
    <html
      lang={lang}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`/${lang}/feed.xml`} />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          {siteMetadata.analytics ? (
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          ) : null}
          <SectionContainer>
            <div className="flex h-screen flex-col justify-between font-sans">
              <SearchProvider
                searchConfig={produce(siteMetadata.search as SearchConfig, (draft) => {
                  if (draft.provider === 'kbar' && draft.kbarConfig.searchDocumentsPath) {
                    draft.kbarConfig.searchDocumentsPath = `${lang}/${draft.kbarConfig.searchDocumentsPath}`
                  }
                })}
              >
                <Header lang={lang} />
                <main className="mb-auto">{children}</main>
              </SearchProvider>
              <Footer lang={lang} />
            </div>
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
