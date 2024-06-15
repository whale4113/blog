import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

const handler = siteMetadata.newsletter
  ? NewsletterAPI({
      provider: siteMetadata.newsletter.provider,
    })
  : () =>
      new Response(null, {
        status: 200,
      })

export { handler as GET, handler as POST }
