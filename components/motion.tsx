'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { money } from '@/lib/data';

export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.getElementById('main');
    if (!root) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 801px)');
    const seen = new WeakSet<Element>();
    const cards = new Set<string>();
    let frame = 0;
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        observer?.unobserve(entry.target);
        if (!reduced.matches) entry.target.classList.add('motion-enter');
      }
    }, {threshold: .08}) : null;
    function mark(selector: string, direction = 'up', step = 90, base = 0) {
      root!.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        // Never alter a streamed client boundary before its own hydration completes.
        if (el.closest('[data-motion-ready="false"]')) return;
        if (seen.has(el)) return;
        seen.add(el); el.dataset.reveal = direction;
        el.style.setProperty('--motion-delay', `${Math.min(base + i * step, 480)}ms`);
        if (el.matches('.art-card')) {
          const key = el.querySelector('a')?.getAttribute('href') || '';
          if (cards.has(key)) return;
          cards.add(key);
        }
        if (!reduced.matches) observer?.observe(el);
      });
    }
    function scan() {
      if (document.documentElement.hasAttribute('data-intro-active')) return;
      mark('.hero-copy > .eyebrow', 'up', 0);
      mark('.motion-line', 'up', 80, 70);
      mark('.hero-copy > p, .hero-copy > .actions, .hero-note', 'up', 75, 250);
      mark('.collage-label, .collage-main, .collage-small, .royalty-note, .orbit-peek', 'up', 85, 80);
      mark('.trust-item');
      mark('.section-head, .page > .page-heading, .home-search, .page > .search, .catalog-toolbar', 'up', 70);
      mark('.art-card'); mark('.how-intro', 'up', 0); mark('.steps > div', 'up', 100);
      mark('.creator-banner > div:first-child', 'left', 0);
      mark('.creator-banner > div:nth-child(2), .creator-banner > .button');
      mark('.detail-art', 'left', 0); mark('.license-panel', 'right', 0, 90); mark('.work-story', 'up', 0);
      mark('.checkout-work, .checkout-layout > section > .panel, .checkout-layout .notice, .checkout-total');
      mark('.success-heading > .orbit', 'success', 0); mark('.success-heading > div, .certificate', 'up', 100, 100);
      mark('.stat'); mark('.table-wrap, .orbit-tip, .empty, .license-row', 'up', 80);
      mark('.split-track > span', 'fill', 0, 120);
    }
    function parallax() {
      frame = 0;
      const collage = root!.querySelector<HTMLElement>('.hero-collage');
      if (!collage) return;
      const offset = reduced.matches || !desktop.matches ? 0 : Math.max(-16, Math.min(16, -collage.getBoundingClientRect().top * .035));
      collage.style.setProperty('--parallax-y', `${offset}px`);
    }
    function scroll() { if (!frame && root!.querySelector('.hero-collage')) frame = requestAnimationFrame(parallax); }
    function preferences() { observer?.disconnect(); root!.querySelectorAll('.motion-enter').forEach(el => el.classList.remove('motion-enter')); parallax(); }
    function focus(event: FocusEvent) {
      let el = event.target as HTMLElement | null;
      while (el && el !== root) { observer?.unobserve(el); el.classList.remove('motion-enter'); el = el.parentElement; }
    }
    scan(); parallax();
    // Observe inserted React elements (streaming, filters, local-state hydration).
    // Text-only counter updates deliberately do not rescan the page.
    const mutations = new MutationObserver(records => {
      if (records.some(r => r.type === 'attributes' || [...r.addedNodes].some(n => n.nodeType === 1))) scan();
    });
    mutations.observe(root, {childList: true, subtree: true, attributes: true, attributeFilter: ['data-motion-ready']});
    window.addEventListener('scroll', scroll, {passive: true});
    window.addEventListener('resize', scroll, {passive: true});
    window.addEventListener('otentik:intro-finished', scan);
    reduced.addEventListener('change', preferences); root.addEventListener('focusin', focus);
    return () => {
      observer?.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
      window.removeEventListener('otentik:intro-finished', scan);
      reduced.removeEventListener('change', preferences); root.removeEventListener('focusin', focus);
      root.querySelectorAll('.motion-enter').forEach(el => el.classList.remove('motion-enter'));
    };
  }, [pathname]);
  return null;
}

export function AnimatedNumber({value, currency = true, onView = false}: {value: number; currency?: boolean; onView?: boolean}) {
  const visual = useRef<HTMLSpanElement>(null);
  const previous = useRef<number | null>(null);
  const text = currency ? money(value) : String(value).padStart(2, '0');
  useLayoutEffect(() => {
    const el = visual.current;
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const from = previous.current ?? (onView ? 0 : value);
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const finish = () => { cancelAnimationFrame(frame); observer?.disconnect(); el.textContent = text; };
    const start = () => {
      observer?.disconnect();
      previous.current = value;
      if (reduced.matches || from === value) { finish(); return; }
      const began = performance.now();
      const tick = (now: number) => {
        const progress = Math.max(0, Math.min(1, (now - began) / 650));
        const number = Math.round(from + (value - from) * (1 - (1 - progress) ** 3));
        el.textContent = currency ? money(number) : String(number).padStart(2, '0');
        if (progress < 1) frame = requestAnimationFrame(tick); else finish();
      };
      frame = requestAnimationFrame(tick);
    };
    if (onView && !reduced.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {if (entries.some(e => e.isIntersecting)) start();}, {threshold: .1}); observer.observe(el);
    } else start();
    reduced.addEventListener('change', finish);
    return () => { finish(); reduced.removeEventListener('change', finish); };
  }, [value, currency, onView, text]);
  return <span className="animated-number"><span ref={visual} aria-hidden="true">{text}</span><span className="sr-only">{text}</span></span>;
}
