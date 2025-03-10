import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  lang: string
  text: string
}

const Tag = ({ lang, text }: Props) => {
  return (
    <Link
      href={`/${lang}/tags/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
