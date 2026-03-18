"use client";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import CodeBlock from "@/components/common/code-block";

export default function BlurTextComp({ isPreview }: { isPreview: boolean }) {
  // 引用
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // 初始化第一张幻灯片
  const initFirstSlide = useCallback(() => {
    // 初始化第一张标题动画
    const firstTitleWords = titleRef.current?.querySelectorAll(".word");
    if (firstTitleWords) {
      gsap.to(firstTitleWords, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
      });
    }
  }, []);

  // 清理GSAP实例
  useEffect(() => {
    initFirstSlide();

    return () => {
      gsap.killTweensOf("*");
    };
  }, [isPreview]);

  return (
    <>
      {isPreview ? (
        <div ref={containerRef} className="w-full h-full">
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-full flex items-center justify-center pointer-events-none z-10">
              <h1
                className="relative text-center uppercase text-[6rem]"
                ref={titleRef}
                style={{
                  fontFamily: "DeFonteDemiGras",
                  filter: "url(#blur-matrix)",
                }}
              >
                <div
                  className="word relative inline-block mr-2"
                  aria-hidden="true"
                  style={{
                    opacity: 0,
                    filter: "blur(30px)",
                  }}
                >
                  The
                </div>
                <div
                  className="word relative inline-block"
                  aria-hidden="true"
                  style={{
                    opacity: 0,
                    filter: "blur(30px)",
                  }}
                >
                  Matador
                </div>
              </h1>
            </div>
          </div>
          <svg
            viewBox="0 0 0 0"
            aria-hidden="true"
            style={{ position: "absolute", zIndex: -1, opacity: 0 }}
          >
            <defs>
              <filter id="blur-matrix">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
                />
              </filter>
            </defs>
          </svg>
        </div>
      ) : (
        <CodeBlock
          lang="ts"
          title="componets/BlockTextRevealComp.tsx"
          content={`<div ref={containerRef} className="w-full h-full">
<div className="relative w-full h-full overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-full flex items-center justify-center pointer-events-none z-10">
        <h1
        className="relative text-center uppercase text-[6rem]"
        ref={titleRef}
        style={{
            fontFamily: "DeFonteDemiGras",
            filter: "url(#blur-matrix)",
        }}
        >
        <div
            className="word relative inline-block mr-2"
            aria-hidden="true"
            style={{
            opacity: 0,
            filter: "blur(30px)",
            }}
        >
            The
        </div>
        <div
            className="word relative inline-block"
            aria-hidden="true"
            style={{
            opacity: 0,
            filter: "blur(30px)",
            }}
        >
            Matador
        </div>
        </h1>
    </div>
    </div>
    <svg
    viewBox="0 0 0 0"
    aria-hidden="true"
    style={{ position: "absolute", zIndex: -1, opacity: 0 }}
    >
    <defs>
        <filter id="blur-matrix">
        <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
        />
        </filter>
    </defs>
    </svg>
</div>`}
        />
      )}
    </>
  );
}
