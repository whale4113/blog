import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from '@/data/index'
import { createTranslation } from '@/i18n/server'

const POSTS_PER_PAGE = 5

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = params
  const { t } = await createTranslation(lang)
  return await genPageMetadata({ lang, title: t('blog') })
}

export default async function BlogPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const posts = allCoreContent(sortPosts(allBlogs(lang)))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
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
