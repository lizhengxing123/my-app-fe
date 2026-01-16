"use client";
import { useRef } from "react";

import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import bg from "@/assets/20260114/bg.jpg";

import "@/assets/css/20260114.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroImgElementRef = useRef<HTMLImageElement>(null);
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroGridOverlayRef = useRef<HTMLDivElement>(null);
  const mark1Ref = useRef<HTMLDivElement>(null);
  const mark2Ref = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heroImg = heroImgRef.current!;
      const heroImgElement = heroImgElementRef.current!;
      const heroMask = heroMaskRef.current!;
      const heroGridOverlay = heroGridOverlayRef.current!;
      const mark1 = mark1Ref.current!;
      const mark2 = mark2Ref.current!;
      const heroContent = heroContentRef.current!;
      const progressBar = progressBarRef.current!;

      const heroContentHeight = heroContent.offsetHeight;
      const viewportHeight = window.innerHeight;
      const heroContentMoveDistance = heroContentHeight - viewportHeight;

      const heroImgHeight = heroImg.offsetHeight;
      const heroImgMoveDistance = heroImgHeight - viewportHeight;

      const ease = (x: number) => x * x * (3 - 2 * x);

      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(progressBar, {
            "--scroll-progress": self.progress,
          });

          gsap.set(heroContent, {
            y: -self.progress * heroContentMoveDistance,
          });

          let heroImgProgress;
          if (self.progress <= 0.45) {
            heroImgProgress = ease(self.progress / 0.45) * 0.65;
          } else if (self.progress <= 0.75) {
            heroImgProgress = 0.65;
          } else {
            heroImgProgress = 0.65 + ease((self.progress - 0.75) / 0.25) * 0.35;
          }
          gsap.set(heroImg, {
            y: heroImgProgress * heroImgMoveDistance,
          });

          let heroMaskScale;
          let heroImgStaturation;
          let heroImgOverlayOpacity;
          if (self.progress <= 0.4) {
            heroMaskScale = 2.5;
            heroImgStaturation = 1;
            heroImgOverlayOpacity = 0.35;
          } else if (self.progress <= 0.5) {
            const phaseProgress = ease((self.progress - 0.4) / 0.1);
            heroMaskScale = 2.5 - phaseProgress * 1.5;
            heroImgStaturation = 1 - phaseProgress;
            heroImgOverlayOpacity = 0.35 + phaseProgress * 0.35;
          } else if (self.progress <= 0.75) {
            heroMaskScale = 1;
            heroImgStaturation = 0;
            heroImgOverlayOpacity = 0.7;
          } else if (self.progress <= 0.85) {
            const phaseProgress = ease((self.progress - 0.75) / 0.1);
            heroMaskScale = 1 + phaseProgress * 1.5;
            heroImgStaturation = phaseProgress;
            heroImgOverlayOpacity = 0.7 - phaseProgress * 0.35;
          } else {
            heroMaskScale = 2.5;
            heroImgStaturation = 1;
            heroImgOverlayOpacity = 0.35;
          }
          gsap.set(heroMask, {
            scale: heroMaskScale,
          });
          gsap.set(heroImgElement, {
            filter: `saturate(${heroImgStaturation})`,
          });
          gsap.set(heroImg, {
            "--overlay-opacity": heroImgOverlayOpacity,
          });

          let heroGridOpacity;
          if (self.progress <= 0.475) {
            heroGridOpacity = 0;
          } else if (self.progress <= 0.5) {
            heroGridOpacity = ease((self.progress - 0.475) / 0.025);
          } else if (self.progress <= 0.75) {
            heroGridOpacity = 1;
          } else if (self.progress <= 0.775) {
            heroGridOpacity = 1 - ease((self.progress - 0.75) / 0.025);
          } else {
            heroGridOpacity = 0;
          }
          gsap.set(heroGridOverlay, {
            opacity: heroGridOpacity,
          });

          let mark1Opacity;
          if (self.progress <= 0.5) {
            mark1Opacity = 0;
          } else if (self.progress <= 0.525) {
            mark1Opacity = ease((self.progress - 0.5) / 0.025);
          } else if (self.progress <= 0.7) {
            mark1Opacity = 1;
          } else if (self.progress <= 0.75) {
            mark1Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            mark1Opacity = 0;
          }
          gsap.set(mark1, {
            opacity: mark1Opacity,
          });

          let mark2Opacity;
          if (self.progress <= 0.55) {
            mark2Opacity = 0;
          } else if (self.progress <= 0.575) {
            mark2Opacity = ease((self.progress - 0.55) / 0.025);
          } else if (self.progress <= 0.7) {
            mark2Opacity = 1;
          } else if (self.progress <= 0.75) {
            mark2Opacity = 1 - ease((self.progress - 0.7) / 0.05);
          } else {
            mark2Opacity = 0;
          }
          gsap.set(mark2, {
            opacity: mark2Opacity,
          });
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <ReactLenis root />
      <main className="page" ref={containerRef}>
        <section className="hero">
          <div className="hero-img" ref={heroImgRef}>
            <Image src={bg} alt="bg" ref={heroImgElementRef} />
          </div>
          <div className="hero-mask" ref={heroMaskRef}></div>
          <div className="hero-grid-overlay" ref={heroGridOverlayRef}>
            <svg
              viewBox="0 0 1080 748"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="grid-svg"
              data-v-0ae0c188=""
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M582 83H830V0H914V83H997V249H1080V416H997V498H1080V582H997V665H831V748H747V665H665V748H498V665H250V748H166V665H0V498H83V333H0V166H83V83H332V0H582V83ZM167 747H249V665H167V747ZM499 747H581V665H499V747ZM582 747H664V665H582V747ZM748 747H830V665H748V747ZM1 664H83V582H1V664ZM84 664H166V582H84V664ZM167 664H249V582H167V664ZM250 664H332V582H250V664ZM333 664H415V582H333V664ZM416 664H498V582H416V664ZM499 664H581V582H499V664ZM582 664H664V582H582V664ZM665 664H747V582H665V664ZM748 664H830V582H748V664ZM831 664H913V582H831V664ZM914 664H996V582H914V664ZM1 581H83V499H1V581ZM84 581H166V499H84V581ZM167 581H249V499H167V581ZM250 581H332V499H250V581ZM333 581H415V499H333V581ZM416 581H498V499H416V581ZM499 581H581V499H499V581ZM582 581H664V499H582V581ZM665 581H747V499H665V581ZM748 581H830V499H748V581ZM831 581H913V499H831V581ZM914 581H996V499H914V581ZM997 581H1079V499H997V581ZM84 498H166V416H84V498ZM167 498H249V416H167V498ZM250 498H332V416H250V498ZM333 498H415V416H333V498ZM416 498H498V416H416V498ZM499 498H581V416H499V498ZM582 498H664V416H582V498ZM665 498H747V416H665V498ZM748 498H830V416H748V498ZM831 498H913V416H831V498ZM914 498H996V416H914V498ZM84 415H166V333H84V415ZM167 415H249V333H167V415ZM250 415H332V333H250V415ZM333 415H415V333H333V415ZM416 415H498V333H416V415ZM499 415H581V333H499V415ZM582 415H664V333H582V415ZM665 415H747V333H665V415ZM748 415H830V333H748V415ZM831 415H913V333H831V415ZM914 415H996V333H914V415ZM997 415H1079V333H997V415ZM1 332H83V250H1V332ZM84 332H166V250H84V332ZM167 332H249V250H167V332ZM250 332H332V250H250V332ZM333 332H415V250H333V332ZM416 332H498V250H416V332ZM499 332H581V250H499V332ZM582 332H664V250H582V332ZM665 332H747V250H665V332ZM748 332H830V250H748V332ZM831 332H913V250H831V332ZM914 332H996V250H914V332ZM997 332H1079V250H997V332ZM1 249H83V167H1V249ZM84 249H166V167H84V249ZM167 249H249V167H167V249ZM250 249H332V167H250V249ZM333 249H415V167H333V249ZM416 249H498V167H416V249ZM499 249H581V167H499V249ZM582 249H664V167H582V249ZM665 249H747V167H665V249ZM748 249H830V167H748V249ZM831 249H913V167H831V249ZM914 249H996V167H914V249ZM84 166H166V84H84V166ZM167 166H249V84H167V166ZM250 166H332V84H250V166ZM333 166H415V84H333V166ZM416 166H498V84H416V166ZM499 166H581V84H499V166ZM582 166H664V84H582V166ZM665 166H747V84H665V166ZM748 166H830V84H748V166ZM831 166H913V84H831V166ZM914 166H996V84H914V166ZM333 83H415V1H333V83ZM416 83H498V1H416V83ZM499 83H581V1H499V83ZM831 83H913V1H831V83Z"
                fill="currentcolor"
              ></path>
            </svg>
          </div>
          <div className="marker marker-1" ref={mark1Ref}>
            <span className="marker-icon"></span>
            <p className="marker-label">Gansu Lanzhou</p>
          </div>
          <div className="marker marker-2" ref={mark2Ref}>
            <span className="marker-icon"></span>
            <p className="marker-label">Qilihe Baoli</p>
          </div>
          <div className="hero-content" ref={heroContentRef}>
            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h1>Zhengxing Website</h1>
              </div>
            </div>
            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>Lorem ipsum dolor sit amet.</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Doloribus deleniti vel non blanditiis repudiandae? Eveniet.
                </p>
              </div>
            </div>
            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>Lorem ipsum dolor sit amet consectetur.</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                  quasi totam perferendis eum fuga sunt nihil veritatis
                  recusandae praesentium..
                </p>
              </div>
            </div>
            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
                  debitis adipisci voluptatum est! Sequi aliquam reiciendis
                  consequatur?
                </p>
              </div>
            </div>
          </div>
          <div className="hero-scroll-progress-bar" ref={progressBarRef}></div>
        </section>
        <section className="outro">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias,
            voluptatibus.
          </p>
        </section>
      </main>
    </>
  );
}
