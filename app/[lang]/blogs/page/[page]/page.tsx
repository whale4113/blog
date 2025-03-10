import { allBlogs } from '@/data/index'
import { createTranslation } from '@/i18n/server'
import { languages } from '@/i18n/settings'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async (): Promise<PageParams[]> => {
  return languages
    .map((lang) => {
      const totalPages = Math.ceil(allBlogs(lang).length / POSTS_PER_PAGE)
      const paths = Array.from({ length: totalPages }, (_, i) => ({
        lang,
        page: (i + 1).toString(),
      }))
      return paths
    })
    .flat(1)
}

interface PageParams {
  lang: string
  page: string
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { lang, page } = await params
  const posts = allCoreContent(sortPosts(allBlogs(lang)))
  const pageNumber = parseInt(page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  
  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  const { t } = await createTranslation(lang)

  return (
    <ListLayout
      lang={lang}
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={t('all-posts')}
    />
  )
}
