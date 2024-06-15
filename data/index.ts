import {
  EnUSAuthors,
  EnUSBlog,
  ZhCNAuthors,
  ZhCNBlog,
  allEnUSAuthors,
  allEnUSBlogs,
  allZhCNAuthors,
  allZhCNBlogs,
} from 'contentlayer/generated'
import allEnUSTags from './en-US/tag-data.json'
import allZhCNTags from './zh-CN/tag-data.json'

export type Blog = EnUSBlog | ZhCNBlog

export const allBlogs = (lang: string): Blog[] => {
  switch (lang) {
    case 'en-US':
      return allEnUSBlogs
    case 'zh-CN':
      return allZhCNBlogs
    default:
      return []
  }
}

export type Author = EnUSAuthors | ZhCNAuthors

export const allAuthors = (lang: string): Author[] => {
  switch (lang) {
    case 'en-US':
      return allEnUSAuthors
    case 'zh-CN':
      return allZhCNAuthors
    default:
      return []
  }
}

export const allTags = (lang: string): Record<string, number> => {
  switch (lang) {
    case 'en-US':
      return allEnUSTags
    case 'zh-CN':
      return allZhCNTags
    default:
      return {}
  }
}
