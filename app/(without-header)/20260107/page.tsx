"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";

import Image from "next/image";
import bg from "@/assets/20260107/bg.jpg";

import "@/assets/css/20260107.css";

export default function Page() {
  const init = () => {
    gsap.registerPlugin(SplitText, CustomEase);

    CustomEase.create("hop", "0.8, 0, 0.3, 1");

    const splitTextElements = (
      selector: string,
      type: string = "words, chars",
      addFirstChar: boolean = false
    ) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const splitText = new SplitText(el, {
          type,
          wordsClass: "word",
          charsClass: "char",
        });

        if (type.includes("chars")) {
          splitText.chars.forEach((char, index) => {
            const originText = char.textContent;
            char.innerHTML = `<span>${originText}</span>`;

            if (addFirstChar && index === 0) {
              char.classList.add("first-char");
            }
          });
        }
      });
    };

    splitTextElements(".intro-title h1", "words, chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");
    splitTextElements(".card h1", "words, chars", true);

    const isMobile = window.innerWidth <= 1000;

    gsap.set(
      [
        ".split-overlay .intro-title .first-char span",
        ".split-overlay .outro-title .char span",
      ],
      {
        y: "0%",
      }
    );

    gsap.set(".split-overlay .intro-title .first-char", {
      x: isMobile ? "7.5rem" : "18rem",
      y: isMobile ? "-1rem" : "-2.75rem",
      fontWeight: "900",
      scale: 0.75,
    });

    gsap.set(".split-overlay .outro-title .char", {
      x: isMobile ? "-3rem" : "-8rem",
      fontSize: isMobile ? "6rem" : "14rem",
    //   fontWeight: "500",
    });

    const t1 = gsap.timeline({
      defaults: {
        ease: "hop",
      },
    });

    const tags = gsap.utils.toArray(".tag") as HTMLElement[];

    tags.forEach((tag, index) => {
      t1.to(
        tag.querySelectorAll("p .word"),
        {
          y: "0%",
          duration: 0.75,
        },
        0.5 + index * 0.1
      );
    });

    t1.to(
      ".placeholder .intro-title .char span",
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.1,
      },
      0.5
    );

    t1.to(
      ".placeholder .intro-title .char:not(.first-char) span",
      {
        y: "100%",
        duration: 0.75,
        stagger: 0.05,
      },
      2
    );

    t1.to(
      ".placeholder .outro-title .char span",
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.075,
      },
      2.5
    );

    t1.to(
      ".placeholder .intro-title .first-char",
      {
        x: isMobile ? "9.5rem" : "21.25rem",
        duration: 1,
      },
      3.5
    );

    t1.to(
      ".placeholder .outro-title .char",
      {
        x: isMobile ? "-3rem" : "-8rem",
        duration: 1,
      },
      3.5
    );

    t1.to(
      ".placeholder .intro-title .first-char",
      {
        x: isMobile ? "7.5rem" : "18rem",
        y: isMobile ? "-1rem" : "-2.75rem",
        fontWeight: "900",
        scale: 0.75,
        duration: 0.75,
      },
      4.5
    );

    t1.to(
      ".placeholder .outro-title .char",
      {
        x: isMobile ? "-3rem" : "-8rem",
        fontSize: isMobile ? "6rem" : "14rem",
        duration: 0.75,
        // fontWeight: "500",
        onComplete: () => {
          gsap.set(".placeholder", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
          });
          gsap.set(".split-overlay", {
            clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)",
          });
        },
      },
      4.5
    );

    t1.to(
      ".main-container",
      {
        clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
        duration: 1,
      },
      5
    );

    tags.forEach((tag, index) => {
      t1.to(
        tag.querySelectorAll("p .word"),
        {
          y: "100%",
          duration: 0.75,
        },
        5.5 + index * 0.1
      );
    });

    t1.to(
      [".placeholder", ".split-overlay"],
      {
        y: (index) => (index === 0 ? "-50%" : "50%"),
        duration: 1,
      },
      6
    );

    t1.to(
      ".main-container",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
      },
      6
    );

    t1.to(
      ".main-container .card",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.75,
      },
      6.25
    );

    t1.to(
      ".main-container .card h1 .char span",
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.05,
      },
      6.5
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="page">
      <div className="placeholder">
        <div className="intro-title">
          <h1>Software Engineer</h1>
        </div>
        <div className="outro-title">
          <h1>35</h1>
        </div>
      </div>
      <div className="split-overlay">
        <div className="intro-title">
          <h1>Software Engineer</h1>
        </div>
        <div className="outro-title">
          <h1>35</h1>
        </div>
      </div>
      <div className="tags-overlay">
        <div className="tag tag-1">
          <p>Frontend Developer</p>
        </div>
        <div className="tag tag-2">
          <p>React Developer</p>
        </div>
        <div className="tag tag-3">
          <p>Next.js Developer</p>
        </div>
      </div>
      <div className="main-container">
        <nav>
          <p id="logo">Zheng</p>
          <p>Menu</p>
        </nav>

        <div className="hero-img">
          <Image src={bg} alt="hero" />
        </div>

        <div className="card">
          <h1>Software</h1>
        </div>

        <footer>
          <p>Copyright © 2026 ZhengXing. All rights reserved.</p>
          <p>
            Contact: <a href="mailto:1241276517@qq.com">1241276517@qq.com</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
