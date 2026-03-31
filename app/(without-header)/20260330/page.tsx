"use client";

import { useRef, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { LenisRef, ReactLenis } from "lenis/react";

import Image from "next/image";
import spring from "@/assets/20260205/spring.webp";
import summer from "@/assets/20260205/summer.webp";
import autumn from "@/assets/20260205/autumn.webp";
import winter from "@/assets/20260205/winter.webp";

import "@/assets/css/20260330.css";

const slides = [
  {
    image: spring,
    title:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus illum labore inventore quasi dolore consequuntur. Qui iure pariatur sequi.",
  },
  {
    image: summer,
    title:
      "Necessitatibus, odit iure. Veniam, neque ex! Eos culpa iusto delectus, quis earum non corporis architecto nihil temporibus cupiditate ratione,",
  },
  {
    image: autumn,
    title:
      "laboriosam expedita perspiciatis eligendi fugiat consequatur ipsam quibusdam minus ipsa illum, commodi veniam velit provident repellendus! Numquam, excepturi. Ipsum expedita",
  },
  {
    image: winter,
    title:
      "assumenda molestias vero nihil maxime temporibus sunt repellat, dolor similique, dicta aliquid blanditiis sit sequi? Temporibus incidunt unde quaerat odio fugit perspiciatis.",
  },
];

gsap.registerPlugin(ScrollTrigger, SplitText);
export default function Page() {
  const lenisRef = useRef<LenisRef>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sliderImagesRef = useRef<HTMLDivElement>(null);
  const sliderTitleRef = useRef<HTMLDivElement>(null);
  const sliderIndicesRef = useRef<HTMLDivElement>(null);
  const sliderImageArrRef = useRef<HTMLImageElement[]>([]);
  const splitTitleArrRef = useRef<SplitText[]>([]);

  const activeSlideRef = useRef<number>(-1);
  const currentSplitRef = useRef<SplitText | null>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  const animateNewSlide = (index: number) => {
    const currentSlideImage = sliderImageArrRef.current[index];

    sliderImageArrRef.current.forEach((image) => {
      gsap.set(image, { scale: 1.1, opacity: 0 });
    });

    gsap.to(currentSlideImage, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(currentSlideImage, {
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });

    animateNewTitle(index);
    animateIndictors(index);
  };

  const animateNewTitle = (index: number) => {
    currentSplitRef.current = splitTitleArrRef.current[index];

    if (!currentSplitRef.current) return;

    splitTitleArrRef.current.forEach((split) => {
      gsap.set(split.lines, { opacity: 0, yPercent: 100 });
    });

    gsap.to(currentSplitRef.current.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
    });
  };

  const animateIndictors = (index: number) => {
    const sliderIndices = sliderIndicesRef.current;
    if (!sliderIndices) return;
    const indictors = sliderIndices.querySelectorAll("p");
    indictors.forEach((indictor, i) => {
      const markerElement = indictor.querySelector(".marker");
      const indexElement = indictor.querySelector(".index");

      if (i === index) {
        gsap.to(indexElement, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(markerElement, {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(indexElement, {
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(markerElement, {
          scaleX: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  useGSAP(
    () => {
      // 分割文本
      const slideTitle = sliderTitleRef.current;
      if (!slideTitle) return;
      const titles = slideTitle.querySelectorAll("h1");
      titles.forEach((title, index) => {
        const split = new SplitText(title, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });

        gsap.set(split.lines, { opacity: 0, yPercent: 100 });
        splitTitleArrRef.current[index] = split;
      });

      // 滚动触发器
      ScrollTrigger.create({
        trigger: ".slider",
        start: "top top",
        end: `+=${window.innerHeight * slides.length}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(progressBarRef.current, { scaleY: progress });

          const currentSlide = Math.floor(progress * slides.length);

          if (
            activeSlideRef.current !== currentSlide &&
            currentSlide < slides.length
          ) {
            activeSlideRef.current = currentSlide;
            animateNewSlide(currentSlide);
          }
        },
      });

      return () => {
        splitTitleArrRef.current.forEach((split) => {
          split.revert();
        });
      };
    },
    { scope: containerRef },
  );

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <main className="page" ref={containerRef}>
        <nav>
          <div className="logo">
            <p>Zheng Xing</p>
          </div>
          <div className="site-info">
            <p>[20260330]</p>
          </div>
        </nav>
        <section className="intro">
          <h1>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto,
            exercitationem quam voluptate iste modi ducimus.
          </h1>
        </section>

        <section className="slider">
          <div className="slider-images" ref={sliderImagesRef}>
            {slides.map((slide, index) => (
              <Image
                key={index}
                src={slide.image}
                alt={`Slide ${index + 1}`}
                ref={(el) => {
                  sliderImageArrRef.current[index] = el!;
                }}
              />
            ))}
          </div>
          <div className="slider-title" ref={sliderTitleRef}>
            {slides.map((slide, index) => (
              <h1 key={index}>{`${slide.title}`}</h1>
            ))}
          </div>
          <div className="slider-indictor">
            <div className="slider-indices" ref={sliderIndicesRef}>
              {slides.map((_, index) => (
                <p key={index} data-index={index}>
                  <span className="marker"></span>
                  <span className="index">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </p>
              ))}
            </div>
            <div className="slider-progress-bar">
              <div className="slider-progress" ref={progressBarRef}></div>
            </div>
          </div>
        </section>
        <section className="outro">
          <h1>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis beatae expedita, dignissimos qui est facere quas animi
            ex?
          </h1>
        </section>
      </main>
    </>
  );
}
