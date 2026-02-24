"use client";

import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Model from "@/app/(without-header)/20260211/Model";

import "@/assets/css/20260211.css";

const menuItems = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "About",
    link: "/about",
  },
  {
    label: "Contact",
    link: "/contact",
  },
  {
    label: "Projects",
    link: "/projects",
  },
  {
    label: "Blog",
    link: "/blog",
  },
  {
    label: "Studio",
    link: "/studio",
  },
  {
    label: "Services",
    link: "/services",
  },
  {
    label: "Careers",
    link: "/careers",
  },
];

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuTogglerRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuTogglerTextRef = useRef<HTMLParagraphElement>(null);
  const menuLinksRef = useRef<HTMLAnchorElement[]>([]);
  const setMenuLinkRef = (el: HTMLAnchorElement, index: number) => {
    menuLinksRef.current[index] = el;
  };
  useGSAP(() => {}, {
    scope: containerRef,
  });

  const handleToggleMenu = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsMenuOpen((prev) => !prev);
    const opacity = isMenuOpen ? 0 : 1;
    gsap.to(menuOverlayRef.current, {
      opacity,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };
  return (
    <>
      <main className="page" ref={containerRef}>
        <nav>
          <div className="logo">
            <a href="">Zheng xing</a>
          </div>
          <div
            className="toggler"
            ref={menuTogglerRef}
            onClick={handleToggleMenu}
          >
            <p ref={menuTogglerTextRef}>{isMenuOpen ? "Close" : "Menu"}</p>
          </div>
        </nav>
        <div
          className="menu-overlay"
          ref={menuOverlayRef}
          style={{
            pointerEvents: isMenuOpen ? "auto" : "none",
          }}
        >
          {/* TODO <Model /> */}

          <div className="menu-links">
            {menuItems.map((item, index) => (
              <div className="menu-item" key={item.label}>
                <a
                  href={item.link}
                  ref={(el) => setMenuLinkRef(el!, index)}
                  onMouseEnter={() => {
                    gsap.to(menuLinksRef.current[index], {
                      backgroundSize: "100% 100%",
                      duration: 1.25,
                      ease: "power2.out",
                      overwrite: true,
                    });
                  }}
                  onMouseLeave={() => {
                    gsap.to(menuLinksRef.current[index], {
                      backgroundSize: "0% 100%",
                      duration: 0.25,
                      ease: "power2.out",
                      overwrite: true,
                    });
                  }}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        <section className="hero">
          <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
        </section>
      </main>
    </>
  );
}
