'use client'

import { Fragment } from 'react'
import { Menu, RadioGroup, Transition } from '@headlessui/react'
import { languages } from '@/i18n/settings'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/client'

const replacePathname = (pathname: string, lang: string) => {
  const [, ...rest] = pathname.slice(1).split('/')

  return '/' + [lang, ...rest].join('/')
}

const ThemeSwitch = ({ lang }: { lang: string }) => {
  const pathname = usePathname()
  const { t } = useTranslation(lang)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center justify-center">
        <Menu.Button className="max-w-20 truncate md:max-w-32 lg:max-w-36 xl:max-w-48">
          {t(lang)}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black focus:outline-none dark:bg-gray-800">
          <RadioGroup value={lang}>
            <div className="p-1">
              {languages.map((language) => (
                <RadioGroup.Option key={language} value={language}>
                  <Menu.Item>
                    <button className="group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm">
                      <Link href={replacePathname(pathname, language)}>{t(language)}</Link>
                    </button>
                  </Menu.Item>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ThemeSwitch
