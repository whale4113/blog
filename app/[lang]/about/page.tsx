import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { Author, allAuthors } from '@/data/index'
import { createTranslation } from '@/i18n/server'

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = params
  const { t } = await createTranslation(lang)
  return await genPageMetadata({ lang, title: t('about') })
}

export default function Page({ params }: { params: { lang: string } }) {
  const { lang } = params
  const author = allAuthors(lang).find((p) => p.slug === 'default') as Author
  const mainContent = coreContent(author)

  if (!author) {
    return null
  }

  return (
    <>
      <AuthorLayout lang={lang} content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
