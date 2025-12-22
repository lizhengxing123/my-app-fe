/* React + Next.js friendly conversion of vitepress/src/client/theme-default/composables/outline.ts
   - use in client only (guarded by useEffect)
   - exposes: resolveTitle, getHeaders, resolveHeaders, useActiveAnchor (React hook)
   - small builtin throttleAndDebounce and CSS.escape fallback
*/

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

/** Types similar to VitePress DefaultTheme.OutlineItem (simplified) */
export interface OutlineItem {
  element: HTMLHeadingElement
  title: string
  link: string
  level: number
  children?: OutlineItem[]
}

/** Theme config shape used for resolveTitle (simplified) */
export type ThemeConfig = {
  outline?: any
  outlineTitle?: string
}

/** Safe CSS.escape fallback for older browsers/node */
function cssEscape(input: string): string {
  if (typeof (window as any)?.CSS?.escape === 'function') {
    return (window as any).CSS.escape(input)
  }
  // basic escape (not full spec), enough for attribute selectors with common chars
  return input.replace(/["\\]/g, (m) => '\\' + m).replace(/\s+/g, ' ')
}

/** Simple throttle+debounce combo similar to original */
export function throttleAndDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 100
): (...args: Parameters<T>) => void {
  let timeout: number | null = null
  let lastExec = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    const run = () => {
      lastExec = Date.now()
      fn(...args)
    }
    if (timeout) {
      window.clearTimeout(timeout)
      timeout = null
    }
    if (now - lastExec >= delay) {
      run()
    } else {
      timeout = window.setTimeout(run, delay)
    }
  }
}

/** Resolve title from a theme-like config */
export function resolveTitle(theme: ThemeConfig | undefined): string {
  if (!theme) return 'On this page'
  return (
    (typeof theme.outline === 'object' &&
      !Array.isArray(theme.outline) &&
      theme.outline?.label) ||
    theme.outlineTitle ||
    'On this page'
  )
}

/** Serialize heading element text, ignoring certain child classes */
const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

function serializeHeader(h: Element): string {
  let ret = ''
  for (const node of Array.from(h.childNodes)) {
    const txt = node.textContent || ''
    if (node.nodeType === 1) {
      if (ignoreRE.test((node as Element).className)) continue
      ret += txt
    } else if (node.nodeType === 3) {
      ret += txt
    }
  }
  return ret.trim()
}

/** Build nested outline tree from flat headers array */
function buildTree(
  data: OutlineItem[],
  min: number,
  max: number
): { tree: OutlineItem[]; resolved: { element: HTMLHeadingElement; link: string }[] } {
  const resolved: { element: HTMLHeadingElement; link: string }[] = []
  const result: OutlineItem[] = []
  const stack: (OutlineItem | { level: number; shouldIgnore: true })[] = []

  data.forEach((item) => {
    const node: OutlineItem = { ...item, children: [] }
    let parent = stack[stack.length - 1] as any

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    if (
      node.element.classList.contains('ignore-header') ||
      (parent && 'shouldIgnore' in parent)
    ) {
      stack.push({ level: node.level, shouldIgnore: true })
      return
    }

    if (node.level > max || node.level < min) return

    resolved.push({ element: node.element, link: node.link })

    if (parent && !('shouldIgnore' in parent)) parent.children!.push(node)
    else result.push(node)

    stack.push(node)
  })

  return { tree: result, resolved }
}

/** Resolve headers to nested tree based on range config (like vitepress) */
export function resolveHeaders(
  headers: OutlineItem[],
  range?: number | 'deep' | [number, number] | { level: number | 'deep' | [number, number] }
): OutlineItem[] {
  if (!range) return []

  const levelsRange =
    (typeof range === 'object' && !Array.isArray(range) ? (range as any).level : range) || 2

  const [high, low]: [number, number] =
    typeof levelsRange === 'number'
      ? [levelsRange, levelsRange]
      : levelsRange === 'deep'
      ? [2, 6]
      : (levelsRange as [number, number])

  const { tree } = buildTree(headers, high, low)
  return tree
}

/** Get headers from DOM (client only). Selector can be changed to fit your markdown container. */
export function getHeaders(range?: any, containerSelector = '.VPDoc'): OutlineItem[] {
  if (typeof window === 'undefined' || typeof document === 'undefined') return []

  const selector = `${containerSelector} h1, ${containerSelector} h2, ${containerSelector} h3, ${containerSelector} h4, ${containerSelector} h5, ${containerSelector} h6`
  const els = Array.from(document.querySelectorAll(selector)) as Element[]

  const headers = els
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1]) || 0
      return {
        element: el as HTMLHeadingElement,
        title: serializeHeader(el),
        link: '#' + el.id,
        level
      } as OutlineItem
    })

  return resolveHeaders(headers, range)
}

/** compute absolute top via getBoundingClientRect + pageYOffset (robust) */
function getAbsoluteTop(element: HTMLElement): number {
  const rect = element.getBoundingClientRect()
  return rect.top + window.pageYOffset
}

/** Hook: useActiveAnchor
 * - containerRef: ref to the navigation container that contains anchors linking to headings
 * - markerRef: ref to a marker element used to visually indicate the active item
 * - options:
 *    - isAsideEnabled?: () => boolean  (or boolean)
 *    - getScrollOffset?: () => number  (for fixed headers - default 0)
 *    - headerSelectorContainer?: string (used by getHeaders if you want the same file)
 */
export function useActiveAnchor(
  containerRef: RefObject<HTMLElement | null>,
  markerRef: RefObject<HTMLElement | null>,
  options?: {
    isAsideEnabled?: (() => boolean) | boolean
    getScrollOffset?: () => number
    headerSelectorContainer?: string
  }
) {
  const isAsideEnabled = options?.isAsideEnabled ?? (() => true)
  const getScrollOffset = options?.getScrollOffset ?? (() => 0)
  const headerContainer = options?.headerSelectorContainer ?? '.VPDoc'

  const resolvedHeadersRef = useRef<{ element: HTMLHeadingElement; link: string }[]>([])
  const prevActiveLinkRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // handler sets active link based on resolvedHeadersRef
    const setActiveLink = () => {
      const asideEnabled =
        typeof isAsideEnabled === 'function' ? isAsideEnabled() : Boolean(isAsideEnabled)
      if (!asideEnabled) return

      const scrollY = window.scrollY
      const innerHeight = window.innerHeight
      const offsetHeight = document.body.offsetHeight
      const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

      // compute top positions, filter NaN, sort
      const headers = resolvedHeadersRef.current
        .map(({ element, link }) => ({ link, top: getAbsoluteTop(element) }))
        .filter(({ top }) => !Number.isNaN(top))
        .sort((a, b) => a.top - b.top)

      if (!headers.length) {
        activateLink(null)
        return
      }

      if (scrollY < 1) {
        activateLink(null)
        return
      }

      if (isBottom) {
        activateLink(headers[headers.length - 1].link)
        return
      }

      let activeLink: string | null = null
      for (const { link, top } of headers) {
        if (top > scrollY + (getScrollOffset?.() ?? 0) + 4) {
          break
        }
        activeLink = link
      }
      activateLink(activeLink)
    }

    // make a throttled/debounced listener for scroll
    const onScroll = throttleAndDebounce(setActiveLink, 100)

    // initialize resolvedHeadersRef from DOM by calling getHeaders
    const reinitHeaders = () => {
      const selector = headerContainer
      const selectorAll = `${selector} h1, ${selector} h2, ${selector} h3, ${selector} h4, ${selector} h5, ${selector} h6`
      const els = Array.from(document.querySelectorAll(selectorAll)) as Element[]

      const headers = els
        .filter((el) => el.id && el.hasChildNodes())
        .map((el) => {
          const level = Number(el.tagName[1]) || 0
          return {
            element: el as HTMLHeadingElement,
            title: serializeHeader(el),
            link: '#' + el.id,
            level
          } as OutlineItem
        })

      const { resolved } = buildTree(headers, 2, 3) // default depth 2..2; if you want range support, expose param
      resolvedHeadersRef.current = resolved
      // initial setActiveLink
      requestAnimationFrame(setActiveLink)
    }

    // activation helper
    function activateLink(hash: string | null) {
      const prev = prevActiveLinkRef.current
      if (prev) prev.classList.remove('active')

      if (hash == null) {
        prevActiveLinkRef.current = null
      } else {
        try {
          const decoded = decodeURIComponent(hash)
          const safe = cssEscape(decoded)
          const selector = `a[href="${safe}"]`
          const container = containerRef.current
          prevActiveLinkRef.current = (container?.querySelector(selector) ?? null) as HTMLAnchorElement | null
        } catch (e) {
          prevActiveLinkRef.current = null
        }
      }

      const active = prevActiveLinkRef.current
      const marker = markerRef.current
      if (active && marker) {
        active.classList.add('active')
        const MARKER_OFFSET = 39
        marker.style.top = active.offsetTop + MARKER_OFFSET + 'px'
        marker.style.opacity = '1'
      } else if (marker) {
        marker.style.top = '33px'
        marker.style.opacity = '0'
      }
    }

    // initial init
    reinitHeaders()

    window.addEventListener('scroll', onScroll)
    // listen to hashchange too (e.g., user clicks anchor)
    window.addEventListener('hashchange', () => activateLink(location.hash))

    // If your Next.js app uses router navigation without full page reload, you should
    // call reinitHeaders() on route change (caller can call it). In many cases, reinit on mount suffices.

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', () => activateLink(location.hash))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, markerRef, isAsideEnabled, getScrollOffset, headerContainer])
}