import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { createTranslation } from '@/i18n/server'
import { NS, languages } from '@/i18n/settings'
import { allBlogs, allTags } from '@/data/index'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
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
      return Object.keys(tagCounts).flatMap((tag) => {
        const postCount = tagCounts[tag]
        const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
        return Array.from({ length: totalPages }, (_, i) => ({
          lang,
          tag: encodeURI(tag),
          page: (i + 1).toString(),
        }))
      })
    })
    .flat(1)
}

interface PageParams {
  lang: string
  tag: string
  page: string
}

export default async function TagPage({ params }: { params: Promise<PageParams> }) {
  const { lang, tag: rawTag, page } = await params

  const tag = decodeURI(rawTag)
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs(lang).filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))
    )
  )

  const pageNumber = parseInt(page)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      lang={lang}
      posts={filteredPosts}
      title={title}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
    />
  )
}
