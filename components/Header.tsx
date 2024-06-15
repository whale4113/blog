import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import LangSwitch from './LangSwitch'
import SearchButton from './SearchButton'
import { createTranslation } from '@/i18n/server'

const Header = async ({ lang }: { lang: string }) => {
  const { t } = await createTranslation(lang)

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href={`/${lang}`} aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {t(siteMetadata.headerTitle)}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={`/${lang}${link.href}`}
              className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
            >
              {t(link.title)}
            </Link>
          ))}
        <SearchButton />
        <ThemeSwitch lang={lang} />
        <LangSwitch lang={lang} />
        <MobileNav lang={lang} />
      </div>
    </header>
  )
}

export default Header
