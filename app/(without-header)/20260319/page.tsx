"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

import Image from "next/image";
import spring from "@/assets/20260205/spring.webp";
import summer from "@/assets/20260205/summer.webp";
import autumn from "@/assets/20260205/autumn.webp";
import winter from "@/assets/20260205/winter.webp";

import "@/assets/css/20260319.css";

gsap.registerPlugin(CustomEase, SplitText);

CustomEase.create("hop", "0.9, 0, 0.1, 1");

const createSplit = (
  selector: string,
  type: "lines" | "words" | "chars",
  className: string,
) => {
  return SplitText.create(selector, {
    type,
    [type + "Class"]: className,
    mask: type,
  });
};
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderImagesRef = useRef<HTMLDivElement[]>([]);
  const preloaderImageImgRefs = useRef<HTMLImageElement[]>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.25 });
      const {
        chars,
        lines,
        splitHeader,
        splitPreloaderCopy,
        splitPreloaderHeader,
      } = setSplitStyle();
      // @ts-ignore
      setAnimation(tl, lines, chars);

      return () => {
        tl.kill();
        splitHeader.revert();
        splitPreloaderCopy.revert();
        splitPreloaderHeader.revert();
      };
    },
    {
      scope: containerRef,
    },
  );

  // 设置分割文本样式
  const setSplitStyle = (): {
    chars: Element[];
    lines: Element[];
    splitHeader: SplitText;
    splitPreloaderCopy: SplitText;
    splitPreloaderHeader: SplitText;
  } => {
    const splitPreloaderHeader = createSplit(
      ".preloader-header a",
      "chars",
      "char",
    );
    const splitPreloaderCopy = createSplit(
      ".preloader-copy p",
      "lines",
      "line",
    );
    const splitHeader = createSplit(".header-row h1", "lines", "line");

    const chars = splitPreloaderHeader.chars;
    const lines = splitPreloaderCopy.lines;
    const headerLines = splitHeader.lines;

    chars.forEach((char, index) => {
      gsap.set(char, {
        yPercent: index % 2 === 0 ? -100 : 100,
      });
    });
    gsap.set(lines, {
      yPercent: 100,
    });
    gsap.set(headerLines, {
      yPercent: 100,
    });

    return {
      chars,
      lines,
      splitHeader,
      splitPreloaderCopy,
      splitPreloaderHeader,
    };
  };

  // 设置 timeline 动画
  const setAnimation = (
    tl: gsap.TimelineVars,
    lines: Element[],
    chars: Element[],
  ) => {
    const initialChar = chars[0];
    const lastChar = chars[chars.length - 1];

    tl.to(".progress-bar", {
      scaleX: 1,
      duration: 4,
      ease: "power3.inOut",
    })
      .set(".progress-bar", {
        transformOrigin: "right",
      })
      .to(".progress-bar", {
        scaleX: 0,
        duration: 1,
        ease: "power3.in",
      });

    preloaderImagesRef.current.forEach((image, index) => {
      tl.to(
        image,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "hop",
          delay: index * 0.75,
        },
        "-=5",
      );
    });

    preloaderImageImgRefs.current.forEach((img, index) => {
      tl.to(
        img,
        {
          scale: 1,
          duration: 1.5,
          ease: "hop",
          delay: index * 0.75,
        },
        "-=5.25",
      );
    });
    tl.to(
      lines,
      {
        yPercent: 0,
        duration: 2,
        ease: "hop",
        stagger: 0.1,
      },
      "-=5.5",
    );

    tl.to(
      chars,
      {
        yPercent: 0,
        duration: 1,
        ease: "hop",
        stagger: 0.025,
      },
      "-=5",
    );

    tl.to(
      ".preloader-images",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "hop",
      },
      "-=1.5",
    );

    tl.to(
      lines,
      {
        yPercent: -125,
        duration: 2,
        ease: "hop",
        stagger: 0.1,
      },
      "-=2",
    );

    tl.to(
      chars,
      {
        yPercent: (index: number) => {
          if (index === 0 || index === chars.length - 1) {
            return 0;
          }
          return index % 2 === 0 ? 100 : -100;
        },
        duration: 1,
        ease: "hop",
        stagger: 0.025,
        delay: 0.5,
        onStart: () => {
          const initialCharMask = initialChar.parentElement;
          const lastCharMask = lastChar.parentElement;

          if (
            initialCharMask &&
            initialCharMask.classList.contains("char-mask")
          ) {
            initialCharMask.style.overflow = "visible";
          }

          if (lastCharMask && lastCharMask.classList.contains("char-mask")) {
            lastCharMask.style.overflow = "visible";
          }

          const viewportWidth = window.innerWidth;
          const centerX = viewportWidth / 2;
          const initialCharRect = initialChar.getBoundingClientRect();
          const lastCharRect = lastChar.getBoundingClientRect();

          gsap.to([initialChar, lastChar], {
            duration: 1,
            ease: "hop",
            delay: 0.5,
            x: (i) => {
              if (i === 0) {
                return centerX - initialCharRect.left - initialCharRect.width;
              }
              return centerX - lastCharRect.left;
            },
          });
        },
        onComplete: () => {
          gsap.set(".preloader-header", {
            mixBlendMode: "difference",
          });

          gsap.to(".preloader-header", {
            y: "2rem",
            scale: 0.35,
            duration: 1.75,
            ease: "hop",
          });
        },
      },
      "-=2.5",
    );

    tl.to(
      ".preloader",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.75,
        ease: "hop",
      },
      "-=0.5",
    );

    tl.to(
      ".header-row .line",
      {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.75",
    );

    tl.to(
      ".divider",
      {
        scaleX: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "<",
    );
  };
  return (
    <main className="page" ref={containerRef}>
      <div className="preloader">
        <div className="progress-bar"></div>

        <div className="preloader-images">
          {[spring, summer, autumn, winter].map((item, index) => (
            <div
              className="img"
              key={index}
              ref={(el) => {
                preloaderImagesRef.current[index] = el!;
              }}
            >
              <Image
                src={item}
                alt={`season ${index + 1}`}
                ref={(el) => {
                  preloaderImageImgRefs.current[index] = el!;
                }}
              />
            </div>
          ))}
        </div>

        <div className="preloader-copy">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            dignissimos maiores amet ab cum aspernatur. A, optio quibusdam?
          </p>
        </div>
      </div>

      <div className="preloader-header">
        <a href="#">Lzheng xingI</a>
      </div>

      <section className="hero">
        {["A Version", "Captured Through", "Dorain Valez"].map(
          (item, index) => (
            <div key={index} className="header-row">
              <div className="divider"></div>
              <h1>{item}</h1>
            </div>
          ),
        )}
      </section>
    </main>
  );
}
