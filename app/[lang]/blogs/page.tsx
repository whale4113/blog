import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from '@/data/index'
import { createTranslation } from '@/i18n/server'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = params
  const { t } = await createTranslation(lang)
  return await genPageMetadata({ lang, title: t('blog') })
}

export default async async function BlogPage({ params }: { params: { lang: string } }props: { searchParams: Promise<{ page: string }> }) {
  const { lang } = params
  const posts = allCoreContent(sortPosts(allBlogs(lang)))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
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
