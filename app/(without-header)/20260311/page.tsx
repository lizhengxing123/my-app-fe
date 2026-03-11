"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import Image from "next/image";
import heroImg from "@/assets/20260224/1.jpg";

import "@/assets/css/20260311.css";

gsap.registerPlugin(SplitText);
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      splitTextIntoLines(".preloader-copy p");
      splitTextIntoLines(".preloader-counter p");

      gsap.set(["nav", ".hero-img", ".hero-content"], { y: "35svh" });

      const tl = gsap.timeline();

      tl.to([".preloader-copy p .line", ".preloader-counter p .line"], {
        y: "0%",
        duration: 1,
        stagger: 0.075,
        ease: "power3.out",
        delay: 1,
      })
        .to(
          ".preloader-revealer",
          {
            scale: 0.1,
            duration: 0.75,
            ease: "power2.out",
          },
          "<",
        )
        .to(".preloader-revealer", {
          scale: 0.25,
          duration: 1,
          ease: "power3.out",
        })
        .to(".preloader-revealer", {
          scale: 0.5,
          duration: 0.75,
          ease: "power3.out",
        })
        .to(".preloader-revealer", {
          scale: 0.75,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(".preloader-revealer", {
          scale: 1,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          ".preloader",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1.25,
            ease: "power3.out",
          },
          "-=1",
        )
        .to(
          ["nav", ".hero-img", ".hero-content"],
          {
            y: "0%",
            duration: 1.25,
            ease: "power3.out",
          },
          "<",
        );
    },
    { scope: containerRef },
  );

  const splitTextIntoLines = (selector: string, options = {}) => {
    return SplitText.create(selector, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      ...options,
    });
  };

  const animateCounter = (
    selector: string,
    duration: number = 5,
    delay: number = 0,
  ) => {
    const counter = document.querySelector(selector);
    if (!counter) return;
    let currentValue = 0;
    const updateInterval = 200;
    const maxDuration = duration * 1000;
    const startTime = Date.now();

    setTimeout(() => {
      const updateCounter = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / maxDuration;

        if (currentValue < 100 && elapsedTime < maxDuration) {
          const target = Math.floor(progress * 100);
          const jump = Math.floor(Math.random() * 25) + 5;
          currentValue = Math.min(target, currentValue + jump, 100);
          counter.textContent = currentValue.toString().padStart(2, "0");
          setTimeout(updateCounter, updateInterval + Math.random() * 100);
        } else {
          counter.textContent = "100";
        }
      };

      updateCounter();
    }, delay * 1000);
  };

  useEffect(() => {
    animateCounter(".preloader-counter p", 4.5, 2);
  }, []);

  return (
    <>
      <main className="page" ref={containerRef}>
        <div className="preloader">
          <div className="preloader-revealer"></div>
          <div className="preloader-copy">
            <div className="preloader-copy-col">
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Hic,
                mollitia.
              </p>
            </div>
            <div className="preloader-copy-col">
              <p>
                Laborum nisi eligendi a, perferendis asperiores magni
                dignissimos cum ex eaque itaque.
              </p>
            </div>
          </div>
          <div className="preloader-counter">
            <p>00</p>
          </div>
        </div>

        <nav>
          <div className="nav-logo">
            <a href="#">Zheng Xing</a>
          </div>

          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Projects</a>
            <a href="#">Contact</a>
          </div>

          <div className="nav-cat">
            <a href="#">Join Club</a>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-img">
            <Image src={heroImg} alt="hero" />
          </div>

          <div className="hero-content">
            <div className="product-name">
              <p>[ Ember No.4 ]</p>
            </div>
            <div className="product-link">
              <a href="#">View The Collection</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
