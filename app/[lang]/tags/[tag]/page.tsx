import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { createTranslation } from '@/i18n/server'
import { NS, languages } from '@/i18n/settings'
import { allBlogs, allTags } from '@/data/index'

const POSTS_PER_PAGE = 5

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>
}): Promise<Metadata> {
  const { lang, tag: rawTag } = await params
  const { t } = await createTranslation(lang)
  const { t: translateTags } = await createTranslation(lang, NS.Tags)
  const tag = decodeURI(rawTag)
  const translatedTag = translateTags(tag)

  return genPageMetadata({
    lang,
    title: translatedTag,
    description: `${t(siteMetadata.title)} ${translatedTag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': new URL(`${lang}/tags/${tag}/feed.xml`, siteMetadata.siteUrl),
      },
    },
  })
}

export const generateStaticParams = async (): Promise<PageParams[]> => {
  return languages
    .map((lang) => {
      const tagCounts = allTags(lang)
      const tagKeys = Object.keys(tagCounts)
      const paths = tagKeys.map((tag) => ({
        lang,
        tag: encodeURI(tag),
      }))
      return paths
    })
    .flat(1)
}

interface PageParams {
  lang: string
  tag: string
}

export default async function TagPage({ params }: { params: Promise<PageParams> }) {
  const { lang, tag: rawTag } = await params
  const tag = decodeURI(rawTag)
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs(lang).filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return <ListLayout lang={lang} posts={filteredPosts} title={title}   initialDisplayPosts={initialDisplayPosts}
  pagination={pagination} />
}
