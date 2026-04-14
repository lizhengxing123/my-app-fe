"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

import "@/assets/css/20260413.css";

const texts = [
  [
    [
      "20260413 myapp ace",
      "20260413 myapp ace",
      "20260413 myapp ace",
      "20260413 myapp ace",
      "20260413 myapp ace",
    ],
    ["Zheng xing mvp", "2738 01029 0102"],
    ["spring summer autumn", "winter my fav season"],
    ["img"],
  ],
  [
    ["winter season"],
    ["flower 90'.''.''''"],
    ["tree >>>>>>>>"],
    ["bird {{{{{{", "fly }}}}}}}"],
    ["water ||||||||", "rain -------"],
    ["sky +++++++"],
  ],
];

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");
export default function Page() {
  const preloaderComplete = useRef<boolean>(false);

  const container = useRef<HTMLDivElement>(null);
  const preloaderTexts = useRef<NodeListOf<Element> | null[]>([]);
  const preloaderBtn = useRef<HTMLDivElement>(null);
  const btnOutlineTrack = useRef<SVGCircleElement>(null);
  const btnOutlineProgress = useRef<SVGCircleElement>(null);
  const svgPathLength = useRef<number>(0);
  const introTl = useRef<gsap.core.Timeline>(null);
  const exitTTl = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      if (!btnOutlineTrack.current) return;

      preloaderTexts.current = document.querySelectorAll(".preloader p");
      svgPathLength.current = btnOutlineTrack.current.getTotalLength() * -1;

      gsap.set([btnOutlineTrack.current, btnOutlineProgress.current], {
        strokeDasharray: svgPathLength.current,
        strokeDashoffset: svgPathLength.current,
      });

      preloaderTexts.current.forEach((text) => {
        SplitText.create(text, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
      });

      SplitText.create(".hero h1", {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });
    },
    { scope: container },
  );

  useGSAP(
    () => {
      introTl.current = gsap.timeline({ delay: 1 });

      introTl.current
        .to(".preloader .p-row p .line", {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        })
        .to(
          btnOutlineTrack.current,
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "hop",
          },
          "<",
        );

      const progressStops = [0.2, 0.25, 0.85, 1].map((stop, i) => {
        if (i === 3) return 1;
        return stop + (Math.random() - 0.5) * 0.1;
      });

      progressStops.forEach((stop, i) => {
        introTl.current!.to(btnOutlineProgress.current, {
          strokeDashoffset:
            svgPathLength.current - stop * svgPathLength.current,
          duration: 0.75,
          ease: "glide",
          delay: i === 0 ? 0.3 : 0.3 + Math.random() * 0.2,
        });
      });

      introTl.current
        .to(
          "#pbc-logo",
          {
            opacity: 0,
            duration: 0.35,
            ease: "power1.out",
          },
          "-=0.25",
        )
        .to(
          preloaderBtn.current,
          {
            scale: 0.9,
            duration: 1.5,
            ease: "hop",
          },
          "-=0.5",
        )
        .to(
          "#pbc-label .line",
          {
            y: "0%",
            duration: 0.75,
            ease: "power3.out",
            onComplete: () => {
              preloaderComplete.current = true;
            },
          },
          "-=0.75",
        );
    },
    { scope: container },
  );

  const handleBtnClick = () => {
    if (!preloaderComplete.current) return;
    preloaderComplete.current = false;

    exitTTl.current = gsap.timeline();

    exitTTl.current
      .to(".preloader", {
        scale: 0.75,
        duration: 1.25,
        ease: "hop",
      })
      .to(
        [btnOutlineTrack.current, btnOutlineProgress.current],
        {
          strokeDashoffset: svgPathLength.current * -1,
          duration: 1.25,
          ease: "hop",
        },
        "<",
      )
      .to(
        "#pbc-label .line",
        {
          y: "-100%",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=1.25",
      )
      .to(
        "#pbc-outro-label .line",
        {
          y: "0%",
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.75",
      )
      .to(".preloader", {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
      })
      .to(
        ".preloader-revealer",
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
          onComplete: () => {
            gsap.set(".preloader", {
              display: "none",
            });
          },
        },
        "-=1.45",
      )
      .to(".hero", {
        scale: 1,
        duration: 1.25,
        ease: "hop",
      })
      .to(
        ".hero h1 .word",
        {
          y: "0%",
          duration: 1,
          ease: "glide",
          stagger: 0.05,
        },
        "-=1.75",
      );
  };
  return (
    <>
      <main className="page" ref={container}>
        <div className="preloader-backdrop">
          {texts.map((text, index) => (
            <div key={index} className="pb-row">
              {text.map((item, index) => (
                <div key={index} className="pb-col">
                  {item.map((t, index) =>
                    t === "img" ? (
                      <svg
                        key={index}
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        id="pb-logo"
                      >
                        <path
                          d="M329.38 67.05c-26.8 9.6-72.36 203-56.59 258 27.91 14 80.76 23 97.78 40.31-32.83-2.62-100.33-1.11-100.33-1.11L281.79 478l112.44 19.84-103.86 19.72 31.86 101.18 107.23 5.72-85.31 30.19L406 756.76l118.66-2.94-85.22 26.58 40.32 58.16 91.58 13.23-48.86 22.91s47.69 61.08 89.49 70.68 78.92 19.75 93.5 12.85 45.83-88.11 47.68-124.78 1.18-64 1.18-64l-24.78 17.71 20.89-73.17-27-73.57L699 696.28l11.39-94.8-56.5-75.27L612 610l21.76-122.79-48-76.57-46.52 80.67L567 366.47l-57.65-81-36.85 75.16 19.53-108-60.57-63.69-24.8 57.59-4.33-93.66s-41.17-45.09-55-80.89c-4.77-15.56-17.95-4.93-17.95-4.93z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    ) : (
                      <p key={index}>{t}</p>
                    ),
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="preloader">
          <div className="p-row">
            <p>20260413</p>
          </div>
          <div className="p-row">
            <div className="p-col">
              <div className="p-sub-col">
                <p>Zheng</p>
                <p>xing</p>
              </div>
              <div className="p-sub-col">
                <p>spring</p>
                <p>summer</p>
              </div>
            </div>
            <div className="p-col">
              <p>winter</p>
            </div>
          </div>

          <div
            className="preloader-btn-container"
            ref={preloaderBtn}
            onClick={handleBtnClick}
          >
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              id="pbc-logo"
            >
              <path
                d="M329.38 67.05c-26.8 9.6-72.36 203-56.59 258 27.91 14 80.76 23 97.78 40.31-32.83-2.62-100.33-1.11-100.33-1.11L281.79 478l112.44 19.84-103.86 19.72 31.86 101.18 107.23 5.72-85.31 30.19L406 756.76l118.66-2.94-85.22 26.58 40.32 58.16 91.58 13.23-48.86 22.91s47.69 61.08 89.49 70.68 78.92 19.75 93.5 12.85 45.83-88.11 47.68-124.78 1.18-64 1.18-64l-24.78 17.71 20.89-73.17-27-73.57L699 696.28l11.39-94.8-56.5-75.27L612 610l21.76-122.79-48-76.57-46.52 80.67L567 366.47l-57.65-81-36.85 75.16 19.53-108-60.57-63.69-24.8 57.59-4.33-93.66s-41.17-45.09-55-80.89c-4.77-15.56-17.95-4.93-17.95-4.93z"
                fill="currentColor"
              ></path>
            </svg>
            <p id="pbc-label">Start</p>
            <p id="pbc-outro-label">Click to start</p>
            <div className="pbc-svg-strokes">
              <svg fill="none">
                <circle
                  ref={btnOutlineTrack}
                  className="stroke-track"
                  cx="160"
                  cy="160"
                  r="155"
                  stroke="#2b2b2b"
                  strokeWidth="2"
                  strokeDasharray="974"
                  strokeDashoffset="974"
                />
                <circle
                  ref={btnOutlineProgress}
                  className="stroke-progress"
                  cx="160"
                  cy="160"
                  r="155"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeDasharray="974"
                  strokeDashoffset="974"
                />
              </svg>
            </div>
          </div>
        </div>

        <section className="hero">
          <div className="preloader-revealer"></div>
          <h1>Lorem ipsum dolor sit amet.</h1>
        </section>
      </main>
    </>
  );
}
