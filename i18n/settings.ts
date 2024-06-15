import { InitOptions } from 'i18next'

export const fallbackLng = 'en-US'
export const languages = [fallbackLng, 'zh-CN']
export const cookieName = 'i18next'

export function getOptions(lng = fallbackLng, ns = NS.Default): InitOptions {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: NS.Default,
    defaultNS: NS.Default,
    ns,
    load: 'currentOnly',
  }
}

export enum NS {
  /**
   * 默认
   */
  Default = 'translation',
  /**
   * 标签
   */
  Tags = 'tags',
  /**
   * 作者
   */
  Authors = 'authors',
}
