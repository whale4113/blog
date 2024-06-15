import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from '@/data/index'
import Main from '../Main'

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params
  const sortedPosts = sortPosts(allBlogs(lang))
  const posts = allCoreContent(sortedPosts)
  return <Main lang={lang} posts={posts} />
}
