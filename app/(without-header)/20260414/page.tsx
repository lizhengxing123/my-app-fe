"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase, SplitText } from "gsap/all";

import Image from "next/image";
import img1 from "@/assets/20260128/1.jpg";
import img2 from "@/assets/20260128/2.jpg";
import img3 from "@/assets/20260128/3.jpg";
import img4 from "@/assets/20260128/4.jpg";
import img5 from "@/assets/20260128/5.jpg";
import img6 from "@/assets/20260128/6.jpg";
import img7 from "@/assets/20260128/7.jpg";
import img8 from "@/assets/20260128/8.jpg";
import img9 from "@/assets/20260128/9.jpg";
import img10 from "@/assets/20260128/10.jpg";
import img11 from "@/assets/20260205/autumn.webp";
import img12 from "@/assets/20260205/spring.webp";
import img13 from "@/assets/20260205/summer.webp";
import img14 from "@/assets/20260205/winter.webp";

import "@/assets/css/20260414.css";

const imgs = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
];

gsap.registerPlugin(CustomEase, SplitText);

CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);
  const gridImgsRef = useRef<HTMLImageElement[]>([]);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const introCopySplitText = useRef<SplitText>(null);
  const titleSplitText = useRef<SplitText>(null);

  useGSAP(
    () => {
      imagesRef.current = gridImgsRef.current.filter(
        (img) => img !== heroImgRef.current,
      );

      introCopySplitText.current = SplitText.create(".intro-copy h3", {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });

      titleSplitText.current = SplitText.create(".title h1", {
        type: "words",
        wordsClass: "word",
        mask: "words",
      });

      gsap.set(introCopySplitText.current?.words, {
        y: "110%",
      });

      gsap.set(titleSplitText.current?.words, {
        y: "110%",
      });

      gsap.set("nav", {
        y: "-125%",
      });
    },
    { scope: containerRef },
  );

  const getRandomImgSet = () => {
    const shuffledImgs = [...imgs].sort(() => Math.random() - 0.5);
    return shuffledImgs.slice(0, 9);
  };

  const startImgRotation = () => {
    const totalCycle = 20;

    for (let i = 0; i < totalCycle; i++) {
      const imgSet = getRandomImgSet();

      gsap.to(
        {},
        {
          duration: 0,
          delay: i * 0.5,
          onComplete: () => {
            imagesRef.current.forEach((imgWrapper, index) => {
              const img = imgWrapper.querySelector("img") as HTMLImageElement;

              if (i === totalCycle - 1 && imgWrapper === heroImgRef.current) {
                img.src = img5.src;
                gsap.set(".hero-img img", { scale: 2 });
              } else {
                img.src = imgSet[index].src;
              }
            });
          },
        },
      );
    }
  };

  useGSAP(
    () => {
      const overlayTimeline = gsap.timeline();
      const imagesTimeline = gsap.timeline();
      const textTimeline = gsap.timeline();

      overlayTimeline.to(".logo-line-1", {
        backgroundPosition: "0 0%",
        color: "#fff",
        duration: 1,
        ease: "none",
        delay: 0.5,
        onComplete: () => {
          gsap.to(".logo-line-2", {
            backgroundPosition: "0 0%",
            color: "#fff",
            duration: 1,
            ease: "none",
          });
        },
      });

      overlayTimeline.to([".projects-header", ".project-item"], {
        opacity: 1,
        duration: 0.15,
        stagger: 0.075,
        delay: 1,
      });

      overlayTimeline.to(
        [".locations-header", ".location-item"],
        {
          opacity: 1,
          duration: 0.15,
          stagger: 0.075,
        },
        "<",
      );

      overlayTimeline.to(".project-item", {
        color: "#fff",
        duration: 0.15,
        stagger: 0.075,
      });
      overlayTimeline.to(
        ".location-item",
        {
          color: "#fff",
          duration: 0.15,
          stagger: 0.075,
        },
        "<",
      );

      overlayTimeline.to([".projects-header", ".project-item"], {
        opacity: 0,
        duration: 0.15,
        stagger: 0.075,
      });

      overlayTimeline.to(
        [".locations-header", ".location-item"],
        {
          opacity: 0,
          duration: 0.15,
          stagger: 0.075,
        },
        "<",
      );

      overlayTimeline.to(".overlay", {
        opacity: 0,
        duration: 0.5,
        delay: 1.5,
      });

      imagesTimeline.to(".img", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        delay: 2.5,
        stagger: 0.05,
        ease: "hop",
        onStart: () => {
          setTimeout(() => {
            // 随机变换图片 太卡了
            // startImgRotation();
            gsap.to(".loader", {
              opacity: 0,
              duration: 0.3,
              delay: 1,
            });
          }, 1000);
        },
      });

      imagesTimeline.to(imagesRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        delay: 2.5,
        stagger: 0.05,
        ease: "hop",
      });

      imagesTimeline.to(".hero-img", {
        y: -50,
        duration: 1,
        ease: "hop",
      });

      imagesTimeline.to(".hero-img", {
        scale: 4,
        clipPath: "polygon(20% 10%, 80% 10%, 80% 90%, 20% 90%)",
        duration: 1.5,
        ease: "hop",
        onStart: () => {
          gsap.to(".hero-img img", { scale: 1, duration: 1.5, ease: "hop" });
          gsap.to(".banner-img", { scale: 1, delay: 0.5, duration: 1.5 });
          gsap.to("nav", { y: "0%", delay: 0.25, duration: 1, ease: "hop" });
        },
      });

      imagesTimeline.to(
        ".banner-img-1",
        {
          left: "40%",
          rotate: -20,
          duration: 1.5,
          delay: 0.5,
          ease: "hop",
        },
        "<",
      );

      imagesTimeline.to(
        ".banner-img-2",
        {
          left: "60%",
          rotate: 20,
          duration: 1.5,
          delay: 0.5,
          ease: "hop",
        },
        "<",
      );

      textTimeline.to(".title h1 .word", {
        y: "0%",
        duration: 1,
        delay: 9.5,
        stagger: 0.1,
        ease: "power3.out",
      });

      textTimeline.to(
        ".intro-copy h3 .word",
        {
          y: "0%",
          duration: 1,
          delay: 0.1,
          stagger: 0.25,
          ease: "power3.out",
        },
        "<",
      );
    },
    { scope: containerRef },
  );
  return (
    <>
      <main className="page" ref={containerRef}>
        <div className="overlay">
          <div className="projects" ref={projectsRef}>
            <div className="projects-header">
              <p>Projects</p>
              <p>My Work</p>
            </div>
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className="project-item">
                <p>Project {index + 1}</p>
                <p>Director {index + 1}</p>
              </div>
            ))}
          </div>
          <div className="loader">
            <h1 className="logo-line-1">Zhen</h1>
            <h1 className="logo-line-2">Xing</h1>
          </div>
          <div className="locations" ref={locationsRef}>
            <div className="locations-header">
              <p>Locations</p>
            </div>
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className="location-item">
                <p>Location {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="img-grid">
          {[0, 1, 2].map((row) => (
            <div key={row} className="grid-row">
              {[0, 1, 2].map((col) => (
                <div
                  key={col}
                  className={row * 3 + col === 4 ? "img hero-img" : "img"}
                  ref={(el) => {
                    gridImgsRef.current[row * 3 + col] = el as HTMLImageElement;
                    if (row * 3 + col === 4) {
                      heroImgRef.current = el as HTMLImageElement;
                    }
                  }}
                >
                  <Image src={imgs[row * 3 + col]} alt="" />
                  {/* 为了随机变换图片，这里使用img标签 */}
                  {/* <img src={imgs[row * 3 + col].src} alt="" /> */}
                </div>
              ))}
            </div>
          ))}
        </div>

        <nav>
          <div className="links">
            <a href="#">Home</a>
            <a href="#">Projects</a>
          </div>
          <div className="nav-logo">
            <a href="#">
              Zhen
              <br />
              Xinl
            </a>
          </div>
          <div className="links">
            <a href="#">Contact</a>
            <a href="#">About</a>
          </div>
        </nav>

        <div className="banner-img banner-img-1">
          <Image src={img7} alt="" />
        </div>
        <div className="banner-img banner-img-2">
          <Image src={img10} alt="" />
        </div>

        <div className="intro-copy">
          <h3>Lorem ipsum</h3>
          <h3>Dolor sit</h3>
        </div>

        <div className="title">
          <h1>Projects And Work</h1>
        </div>
      </main>
    </>
  );
}
