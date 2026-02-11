"use client";

import { useRef, useState } from "react";

import { ReactLenis } from "lenis/react";

import Menu from "./Menu";

import Image from "next/image";
import hero from "@/assets/20260210/hero.jpg";

import "@/assets/css/20260210.css";

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const pageContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ReactLenis root />
      <main className="page">
        <Menu
          isMenuOpen={isMenuOpen}
          isAnimating={isAnimating}
          setIsMenuOpen={setIsMenuOpen}
          setIsAnimating={setIsAnimating}
          pageContainerRef={pageContainerRef}
        />
        <div className="page-container" ref={pageContainerRef}>
          <section className="hero">
            <h1>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Expedita, labore.
            </h1>
          </section>
          <section className="banner">
            <Image src={hero} alt="hero" />
          </section>
          <section className="outro">
            <h1>Lorem ipsum dolor sit amet consectetur.</h1>
          </section>
        </div>
      </main>
    </>
  );
}
