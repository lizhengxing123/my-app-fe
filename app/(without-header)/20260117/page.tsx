"use client";
import { useRef } from "react";

import { ReactLenis } from "lenis/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import bg from "@/assets/20260117/bg.jpg";
import logo from "@/assets/20260117/logo.png";

import { logoData } from "./data";

import "@/assets/css/20260117.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroImgContainerRef = useRef<HTMLDivElement>(null);
    const heroImgLogoRef = useRef<HTMLDivElement>(null);
    const heroImgCopyRef = useRef<HTMLDivElement>(null);
    const fadeOverlayRef = useRef<HTMLDivElement>(null);
    const svgOverlayRef = useRef<HTMLDivElement>(null);
    const overlayCopyRef = useRef<HTMLDivElement>(null);

    const logoContainerRef = useRef<HTMLDivElement>(null);
    const logoMaskRef = useRef<SVGPathElement>(null);

    
    useGSAP(
        () => {
            const initialOverlayScale = 350;

            const heroImgContainer = heroImgContainerRef.current!;
            const heroImgLogo = heroImgLogoRef.current!;
            const heroImgCopy = heroImgCopyRef.current!;
            const fadeOverlay = fadeOverlayRef.current!;
            const svgOverlay = svgOverlayRef.current!;
            const overlayCopy = overlayCopyRef.current!;

            const logoMask = logoMaskRef.current!;
            const logoContainer = logoContainerRef.current!;

            logoMask.setAttribute("d", logoData);

            const logoDimensions = logoContainer.getBoundingClientRect();
            const logoBoundingBox = logoMask.getBBox();

            const horizontalScaleRatio =
                logoDimensions.width / logoBoundingBox.width;
            const verticalScaleRatio =
                logoDimensions.height / logoBoundingBox.height;

            const logoScaleFactor = Math.min(
                horizontalScaleRatio,
                verticalScaleRatio
            );

            const logoHorizontalPosition =
                logoDimensions.left +
                (logoDimensions.width -
                    logoBoundingBox.width * logoScaleFactor) /
                    2 -
                logoBoundingBox.x * logoScaleFactor;

            const logoVerticalPosition =
                logoDimensions.top +
                (logoDimensions.height -
                    logoBoundingBox.height * logoScaleFactor) /
                    2 -
                logoBoundingBox.y * logoScaleFactor;

            logoMask.setAttribute(
                "transform",
                `translate(${logoHorizontalPosition} ${logoVerticalPosition}) scale(${logoScaleFactor})`
            );

            ScrollTrigger.create({
                trigger: ".hero",
                start: "top top",
                end: `${window.innerHeight * 5}px`,
                pin: true,
                pinSpacing: true,
                scrub: 1,
                onUpdate: (self) => {
                    const scrollProgress = self.progress;
                    const fadeOpacity = 1 - scrollProgress * (1 / 0.15);

                    if (scrollProgress <= 0.15) {
                        gsap.set([heroImgLogo, heroImgCopy], {
                            opacity: fadeOpacity,
                        });
                    } else {
                        gsap.set([heroImgLogo, heroImgCopy], {
                            opacity: 0,
                        });
                    }

                    if (scrollProgress <= 0.85) {
                        const normalizedProgress = scrollProgress * (1 / 0.85);
                        const heroImgContainerScale =
                            1.5 - 0.5 * normalizedProgress;
                        const overlayScale =
                            initialOverlayScale *
                            Math.pow(
                                1 / initialOverlayScale,
                                normalizedProgress
                            );

                        let fadeOverlayOpacity = 0;

                        gsap.set(heroImgContainer, {
                            scale: heroImgContainerScale,
                        });
                        gsap.set(svgOverlay, {
                            scale: overlayScale,
                        });

                        if (scrollProgress >= 0.25) {
                            fadeOverlayOpacity = Math.min(
                                1,
                                (scrollProgress - 0.25) * (1 / 0.4)
                            );
                        }
                        gsap.set(fadeOverlay, {
                            opacity: fadeOverlayOpacity,
                        });
                    }

                    if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
                        const overlayCopyRevealProgress =
                            (scrollProgress - 0.6) * (1 / 0.25);
                        
                        const gradientSpread = 100
                        const gradientBottomPosition = 240 - overlayCopyRevealProgress * 280
                        const gradientTopPosition = gradientBottomPosition - gradientSpread
                        const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress
                        
                        overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #e66461 ${gradientBottomPosition}%, #e66461 100%)`
                        overlayCopy.style.backgroundClip = "text"

                        gsap.set(overlayCopy, {
                            scale: overlayCopyScale,
                            opacity: overlayCopyRevealProgress,
                        })
                    } else if (scrollProgress < 0.6) {
                        gsap.set(overlayCopy, {
                            opacity: 0,
                        })
                    }
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
                    <div
                        className="hero-img-container"
                        ref={heroImgContainerRef}
                    >
                        <Image className="hero-bg-img" src={bg} alt="bg" />

                        <div className="hero-img-logo" ref={heroImgLogoRef}>
                            <Image src={logo} alt="logo" />
                        </div>

                        {/* 只扣出主体的图片 */}

                        <div className="hero-img-copy" ref={heroImgCopyRef}>
                            <p>Scroll down to reveal</p>
                        </div>
                    </div>

                    <div className="fade-overlay" ref={fadeOverlayRef}></div>

                    <div className="overlay" ref={svgOverlayRef}>
                        <svg width="100%" height="100%">
                            <defs>
                                <mask id="logoRevealMask">
                                    <rect
                                        width="100%"
                                        height="100%"
                                        fill="white"
                                    />
                                    <path
                                        id="logoMask"
                                        ref={logoMaskRef}
                                    ></path>
                                </mask>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="#111117"
                                mask="url(#logoRevealMask)"
                            />
                        </svg>
                    </div>

                    <div
                        className="logo-container"
                        ref={logoContainerRef}
                    ></div>

                    <div className="overlay-copy">
                        <h1 className="overlay-copy-title" ref={overlayCopyRef}>
                            Li <br />
                            Zheng <br />
                            Xing
                        </h1>
                    </div>
                </section>
                <section className="outro">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </section>
            </main>
        </>
    );
}