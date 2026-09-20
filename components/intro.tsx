'use client';

import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { usePathname } from 'next/navigation';

// A document-level introduction: reload replays it; client navigation does not.
export function Intro() {
  const pathname = usePathname();
  const [initialPath] = useState(pathname);
  const dialog = useRef<HTMLDialogElement>(null);
  const dismiss = useRef<() => void>(() => {});

  if (initialPath === '/') preload('/assets/background.jpg', { as: 'image', fetchPriority: 'high' });

  useEffect(() => {
    const el = dialog.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const legacyRoute = window.location.hash;
    if (!el) return;
    if (initialPath !== '/' || (legacyRoute.startsWith('#/') && legacyRoute !== '#/') || reduced.matches) { el.close(); return; }

    let done = false;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(failsafe);
      el.close();
      el.classList.remove('intro-running');
      document.body.style.overflow = previousOverflow;
      document.documentElement.removeAttribute('data-intro-active');
      window.dispatchEvent(new Event('otentik:intro-finished'));
      if (previousFocus && previousFocus !== document.body && previousFocus.isConnected) previousFocus.focus({preventScroll:true});
      else document.getElementById('main')?.focus({preventScroll:true});
    };
    // The timer also releases the page if animations are disabled or interrupted.
    const failsafe = setTimeout(finish, 7900);
    dismiss.current = finish;
    const onAnimationEnd = (event: AnimationEvent) => { if (event.target === el && event.animationName === 'intro-depart') finish(); };
    const onPreference = () => { if (reduced.matches) finish(); };
    const onCancel = (event: Event) => {event.preventDefault(); finish();};
    el.addEventListener('animationend', onAnimationEnd);
    el.addEventListener('cancel', onCancel);
    reduced.addEventListener('change', onPreference);
    document.documentElement.setAttribute('data-intro-active', 'true');
    document.body.style.overflow = 'hidden';
    // Server HTML already displays the first phrase. Upgrade to a modal in the
    // same task so there is no paint of the landing page during hydration.
    el.close();
    el.classList.add('intro-running');
    el.showModal();
    return () => {
      clearTimeout(failsafe);
      el.removeEventListener('animationend', onAnimationEnd);
      el.removeEventListener('cancel', onCancel);
      reduced.removeEventListener('change', onPreference);
      el.close();
      el.classList.remove('intro-running');
      document.body.style.overflow = previousOverflow;
      document.documentElement.removeAttribute('data-intro-active');
      dismiss.current = () => {};
    };
  }, [initialPath]);

  useEffect(() => { if (pathname !== '/') dismiss.current(); }, [pathname]);

  return <><noscript><style>{'.brand-intro{display:none!important}'}</style></noscript><dialog ref={dialog} open={initialPath === '/'} className="brand-intro" aria-label="Selamat datang di OTENTIK" aria-describedby="intro-message">
    <div className="intro-top"><span className="intro-wordmark"><span className="intro-mark" aria-hidden="true"/>OTENTIK</span><button type="button" className="intro-skip" onClick={() => dismiss.current()}>Lewati <span aria-hidden="true">↗</span></button></div>
    <p id="intro-message" className="sr-only">Satu Lisensi. Satu Ekosistem. Support Kreator Indonesia.</p>
    <div className="intro-orbit" aria-hidden="true"/>
    <div className="intro-messages" aria-hidden="true">
      <p className="intro-message intro-one">Satu <span>Lisensi</span><i>.</i></p>
      <p className="intro-message intro-two">Satu <span>Ekosistem</span><i>.</i></p>
      <p className="intro-message intro-three">Support Kreator<br/><span>Indonesia<i>.</i></span></p>
    </div>
    <div className="intro-bottom" aria-hidden="true"><span>KARYA PUNYA MASA DEPAN.</span><div className="intro-progress"><i/><i/><i/></div><span>BERSAMA OTENTIK</span></div>
  </dialog></>;
}
