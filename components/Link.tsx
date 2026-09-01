import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/**
 * Site-wide Link. Viewport prefetching is disabled by default because vinext 1.0.0-beta.3's client
 * prefetch path throws "getPrefetchInterceptionContext is not a function" in the browser console.
 * Navigation itself is unaffected; pass `prefetch` explicitly to opt back in once the framework is fixed.
 */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
