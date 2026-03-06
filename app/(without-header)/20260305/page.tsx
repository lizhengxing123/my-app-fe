"use client";
import { useRef, useEffect } from "react";

import { ReactLenis, LenisRef } from "lenis/react";
import gsap from "gsap";

import Projects from "./Projects";

import "@/assets/css/20260305.css";

export default function Page() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <main className="page">
        <section className="intro">
          <p>Intro Section</p>
        </section>
        <Projects />
        <section className="outro">
          <p>Outro Section</p>
        </section>
      </main>
    </>
  );
}
