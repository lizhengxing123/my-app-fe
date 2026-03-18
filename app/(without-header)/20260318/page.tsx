"use client";

import { useRef, useEffect } from "react";

import Lenis from "lenis";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import bg from "@/assets/20260210/menu-media.jpg";

import "@/assets/css/20260318.css";

const featureData = [
  {
    title: "HTML",
    top: 25,
    left: 15,
  },
  {
    title: "CSS",
    top: 12.5,
    left: 50,
  },
  {
    title: "JavaScript",
    top: 22.5,
    left: 75,
  },
  {
    title: "React",
    top: 30,
    left: 82.5,
  },
  {
    title: "Next.js",
    top: 50,
    left: 20,
  },
  {
    title: "TypeScript",
    top: 80,
    left: 20,
  },
  {
    title: "Tailwind CSS",
    top: 75,
    left: 75,
  },
];

gsap.registerPlugin(ScrollTrigger);
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);
  const featureBgRefs = useRef<HTMLDivElement[]>([]);

  // lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);
    function update(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, []);

  // 初始化所有feature的位置
  useGSAP(
    () => {
      const features = featureRefs.current;
      if (!features) return;

      features.forEach((feature, index) => {
        gsap.set(feature, {
          top: `${featureData[index].top}%`,
          left: `${featureData[index].left}%`,
        });
      });
    },
    { scope: containerRef },
  );

  // 获取每个 feature bg 的初始宽高
  const featureStartDimensions = useRef<{ width: number; height: number }[]>(
    [],
  );
  const getFeatureStartDimensions = () => {
    const featureBgs = featureBgRefs.current;
    if (!featureBgs) return [];
    return featureBgs.map((bg) => {
      const rect = bg.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
      };
    });
  };

  const getSearchBarFinalWidth = () => {
    return window.innerWidth < 1000 ? 20 : 25;
  };

  const searchBarFinalWidth = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      searchBarFinalWidth.current = getSearchBarFinalWidth();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 滚动触发器
  useGSAP(
    () => {
      featureStartDimensions.current = getFeatureStartDimensions();
      searchBarFinalWidth.current = getSearchBarFinalWidth();

      // 变为圆圈的宽高
      const remInPixels = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const targetWidth = remInPixels * 3;
      const targetHeight = targetWidth;

      ScrollTrigger.create({
        trigger: ".spotlight",
        start: "start",
        end: `+=${window.innerHeight * 3}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress <= 0.3333) {
            const spotlightHeaderProgress = progress / 0.3333;
            gsap.set(".spotlight-content", {
              y: `${spotlightHeaderProgress * -100}%`,
            });
          } else {
            gsap.set(".spotlight-content", {
              y: `-100%`,
            });
          }

          if (progress >= 0 && progress <= 0.5) {
            const featureProgress = progress / 0.5;

            featureRefs.current.forEach((feature, index) => {
              const original = featureData[index];
              const currentTop =
                original.top + (50 - original.top) * featureProgress;
              const currentLeft =
                original.left + (50 - original.left) * featureProgress;

              gsap.set(feature, {
                top: `${currentTop}%`,
                left: `${currentLeft}%`,
              });
            });

            featureBgRefs.current.forEach((bg, index) => {
              const featureDim = featureStartDimensions.current[index];
              const currentWidth =
                featureDim.width +
                (targetWidth - featureDim.width) * featureProgress;
              const currentHeight =
                featureDim.height +
                (targetHeight - featureDim.height) * featureProgress;
              const currentBorderRadius = 0.5 + (25 - 0.5) * featureProgress;
              const currentBorderWidth =
                0.125 + (0.35 - 0.125) * featureProgress;
              gsap.set(bg, {
                width: `${currentWidth}px`,
                height: `${currentHeight}px`,
                borderRadius: `${currentBorderRadius}rem`,
                borderWidth: `${currentBorderWidth}rem`,
              });
            });

            if (progress >= 0 && progress <= 0.1) {
              const featureTextProgress = progress / 0.1;
              gsap.set(".feature-content", {
                opacity: 1 - featureTextProgress,
              });
            } else if (progress > 0.1) {
              gsap.set(".feature-content", {
                opacity: 0,
              });
            }
          }

          if (progress >= 0.5) {
            gsap.set(".features", {
              opacity: 0,
            });
          } else {
            gsap.set(".features", {
              opacity: 1,
            });
          }

          if (progress >= 0.5) {
            gsap.set(".search-bar", {
              opacity: 1,
            });
          } else {
            gsap.set(".search-bar", {
              opacity: 0,
            });
          }

          if (progress >= 0.5 && progress <= 0.75) {
            const searchBarProgress = (progress - 0.5) / 0.25;

            const width =
              3 + (searchBarFinalWidth.current - 3) * searchBarProgress;
            const height = 3 + (5 - 3) * searchBarProgress;

            const translateY = -50 + (200 - -50) * searchBarProgress;

            gsap.set(".search-bar", {
              width: `${width}rem`,
              height: `${height}rem`,
              transform: `translate(-50%, ${translateY}%)`,
            });

            gsap.set(".search-bar p", {
              opacity: 0,
            });
          } else if (progress > 0.75) {
            gsap.set(".search-bar", {
              width: `${searchBarFinalWidth.current}rem`,
              height: `5rem`,
              transform: `translate(-50%, 200%)`,
            });
          }

          if (progress >= 0.75) {
            const finalHeaderProgress = (progress - 0.75) / 0.25;

            gsap.set(".search-bar p", {
              opacity: finalHeaderProgress,
            });

            gsap.set(".header-content", {
              y: -50 + 50 * finalHeaderProgress,
              opacity: finalHeaderProgress,
            });
          } else {
            gsap.set(".search-bar p", {
              opacity: 0,
            });

            gsap.set(".header-content", {
              y: -50,
              opacity: 0,
            });
          }
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <>
      <main className="page" ref={containerRef}>
        <section className="intro">
          <h1>Lorem ipsum dolor sit amet consectetur adipisicing.</h1>
        </section>

        <section className="spotlight">
          <div className="spotlight-content">
            <div className="spotlight-bg">
              <Image src={bg} alt="bg" />
            </div>
            <h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h1>
          </div>

          <div className="header">
            <div className="header-content">
              <h1>Lorem ipsum dolor sit amet.</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
                sequi aspernatur laboriosam magni!
              </p>
            </div>
          </div>

          <div className="features">
            {featureData.map((item, index) => (
              <div
                className="feature"
                key={index}
                ref={(el) => {
                  featureRefs.current[index] = el!;
                }}
              >
                <div
                  className="feature-bg"
                  ref={(el) => {
                    featureBgRefs.current[index] = el!;
                  }}
                ></div>
                <div className="feature-content">
                  <p>{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="search-bar">
            <p>Search for your favorite features</p>
          </div>
        </section>

        <section className="outro">
          <h1>（System Complate）</h1>
        </section>
      </main>
    </>
  );
}
