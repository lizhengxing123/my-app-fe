"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
// @ts-ignore
import "@/assets/css/20251220.css";
import { useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";

import LX from "@/assets/20251220/娄行.webp";
import LJQ from "@/assets/20251220/林见祈.webp";
import LW from "@/assets/20251220/林渭.webp";
import LX1 from "@/assets/20251220/娄行1.webp";
import LJQ1 from "@/assets/20251220/林见祈1.webp";
import LW1 from "@/assets/20251220/林渭1.webp";

const cards = [
    {
        id: "hero-card-1",
        title: "娄行真人",
        image: LX1,
    },
    {
        id: "hero-card-2",
        title: "奎祈真人",
        image: LJQ1,
    },
    {
        id: "hero-card-3",
        title: "后绋真人",
        image: LW1,
    },
];
const cardsCopy = [
    {
        id: "card-1",
        copy: ["四神通大真人", "鸺葵道道子", "剑仙"],
        title: "娄行真人",
        image: LX,
    },
    {
        id: "card-2",
        copy: [
            "Wireframes",
            "Prototypes",
            "Usability Testing",
            "Accessibility",
            "Responsive",
        ],
        title: "奎祈真人",
        image: LJQ,
    },
    {
        id: "card-3",
        copy: ["Code", "Deployment", "Maintenance", "Hosting", "Domain"],
        title: "后绋真人",
        image: LW,
    },
];

export default function Page() {
    const servicesSection = useRef<HTMLDivElement>(null);
    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        const smoothStep = (p: number) => p * p * (3 - 2 * p);

        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "75% top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                const heroCardsContainerOpacity = gsap.utils.interpolate(
                    1,
                    0.5,
                    smoothStep(progress)
                );

                gsap.set(".hero-cards", {
                    opacity: heroCardsContainerOpacity,
                });

                cards
                    .map((i) => i.id)
                    .forEach((cardId, index) => {
                        const delay = index * 0.9;
                        const cardProgress = gsap.utils.clamp(
                            0,
                            1,
                            (progress - delay * 0.1) / (1 - delay * 0.1)
                        );

                        const y = gsap.utils.interpolate(
                            "0%",
                            "250%",
                            smoothStep(cardProgress)
                        );
                        const scale = gsap.utils.interpolate(
                            1,
                            0.75,
                            smoothStep(cardProgress)
                        );

                        let x = "0%";
                        let rotation = 0;
                        if (index === 0) {
                            x = gsap.utils.interpolate(
                                "0%",
                                "90%",
                                smoothStep(cardProgress)
                            );
                            rotation = gsap.utils.interpolate(
                                0,
                                -15,
                                smoothStep(cardProgress)
                            );
                        } else if (index === 2) {
                            x = gsap.utils.interpolate(
                                "0%",
                                "-90%",
                                smoothStep(cardProgress)
                            );
                            rotation = gsap.utils.interpolate(
                                0,
                                15,
                                smoothStep(cardProgress)
                            );
                        }

                        gsap.set(`#${cardId}`, {
                            x,
                            y,
                            scale,
                            rotation,
                        });
                    });
            },
        });

        ScrollTrigger.create({
            trigger: ".services",
            start: "top top",
            end: `+=${window.innerHeight * 4}px`,
            pin: ".services",
            pinSpacing: true,
        });

        ScrollTrigger.create({
            trigger: ".services",
            start: "top top",
            end: `+=${window.innerHeight * 4}px`,
            onLeave: () => {
                if (!servicesSection.current) return;
                const servicesRect =
                    servicesSection.current.getBoundingClientRect();
                const servicesTop = window.pageYOffset + servicesRect.top;

                gsap.set(".cards", {
                    position: "absolute",
                    top: servicesTop,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                });
            },
            onEnterBack: () => {
                gsap.set(".cards", {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                });
            },
        });

        ScrollTrigger.create({
            trigger: ".services",
            start: "top bottom",
            end: `+=${window.innerHeight * 4}px`,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
                const headerY = gsap.utils.interpolate(
                    "400%",
                    "0%",
                    smoothStep(headerProgress)
                );
                gsap.set(".services-header", {
                    y: headerY,
                });

                cardsCopy
                    .map((i) => i.id)
                    .forEach((cardId, index) => {
                        const delay = index * 0.5;
                        const cardProgress = gsap.utils.clamp(
                            0,
                            1,
                            (progress - delay * 0.1) / (0.9 - delay * 0.1)
                        );

                        const innerCard = document.querySelector(
                            `#${cardId} .flip-card-inner`
                        );

                        let y;
                        if (cardProgress < 0.4) {
                            const normalizedProgress = cardProgress / 0.4;
                            y = gsap.utils.interpolate(
                                "-100%",
                                "50%",
                                smoothStep(normalizedProgress)
                            );
                        } else if (cardProgress < 0.6) {
                            const normalizedProgress =
                                (cardProgress - 0.4) / 0.2;
                            y = gsap.utils.interpolate(
                                "50%",
                                "0%",
                                smoothStep(normalizedProgress)
                            );
                        } else {
                            y = "0%";
                        }

                        let scale;
                        if (cardProgress < 0.4) {
                            const normalizedProgress = cardProgress / 0.4;
                            scale = gsap.utils.interpolate(
                                0.25,
                                0.75,
                                smoothStep(normalizedProgress)
                            );
                        } else if (cardProgress < 0.6) {
                            const normalizedProgress =
                                (cardProgress - 0.4) / 0.2;
                            scale = gsap.utils.interpolate(
                                0.8,
                                1,
                                smoothStep(normalizedProgress)
                            );
                        } else {
                            scale = 1;
                        }

                        let opacity;
                        if (cardProgress < 0.2) {
                            const normalizedProgress = cardProgress / 0.2;
                            opacity = smoothStep(normalizedProgress);
                        } else {
                            opacity = 1;
                        }

                        let x, rotate, rotationY;
                        if (cardProgress < 0.6) {
                            x =
                                index === 0
                                    ? "100%"
                                    : index === 1
                                    ? "0%"
                                    : "-100%";
                            rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                            rotationY = 0;
                        } else if (cardProgress < 1) {
                            const normalizedProgress =
                                (cardProgress - 0.6) / 0.4;
                            x = gsap.utils.interpolate(
                                index === 0
                                    ? "100%"
                                    : index === 1
                                    ? "0%"
                                    : "-100%",
                                "0%",
                                smoothStep(normalizedProgress)
                            );
                            rotate = gsap.utils.interpolate(
                                index === 0 ? -5 : index === 1 ? 0 : 5,
                                0,
                                smoothStep(normalizedProgress)
                            );
                            rotationY = smoothStep(normalizedProgress) * 180;
                        } else {
                            x = "0%";
                            rotate = 0;
                            rotationY = 180;
                        }

                        gsap.set(`#${cardId}`, {
                            x,
                            y,
                            scale,
                            opacity,
                            rotate,
                        });

                        gsap.set(innerCard, {
                            rotationY,
                        });
                    });
            },
        });
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <main className="page">
            {/* 顶部导航栏 */}
            <nav className="fixed left-0 top-0 w-full p-8 flex items-center justify-between z-10">
                <div className="logo">
                    <span className="bg-foreground text-background">
                        大鸺葵观
                    </span>
                </div>
                <div className="menu-btn">
                    <span className="bg-background text-foreground">
                        太阳道统
                    </span>
                </div>
            </nav>
            {/* 卡片 */}
            <section className="hero bg-muted text-foreground">
                <div className="hero-cards absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] flex justify-center gap-4">
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            image={card.image}
                            extraClassName="hero-card relative aspect-[5/7] p-3 rounded-lg flex flex-col justify-between"
                        />
                    ))}
                </div>
            </section>
            {/* 分隔背景 */}
            <section className="about">
                <h1>太阳失辉 今不复也</h1>
            </section>
            {/* 卡片重新进入动画 */}
            <section className="services py-32 px-8" ref={servicesSection}>
                <div className="services-header relative w-full text-center translate-y-[400%] will-change-transform">
                    <h1>大鸺葵观</h1>
                </div>
            </section>
            {/* 卡片容器 */}
            <section className="cards">
                <div className="cards-container w-[60%] h-full flex justify-center items-center gap-16">
                    {cardsCopy.map((card) => (
                        <div
                            className="card relative flex-1 aspect-[5/7] perspective-[1000px]"
                            key={card.id}
                            id={card.id}
                        >
                            <div className="card-wrapper absolute w-full h-full">
                                <div className="flip-card-inner relative w-full h-full transform-3d">
                                    <Card
                                        extraClassName="flip-card-front"
                                        title={card.title}
                                        image={card.image}
                                    />
                                    <Card
                                        extraClassName="flip-card-back"
                                        title={card.title}
                                        image={card.image}
                                        copy={card.copy}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* 结尾部分 */}
            <section className="outro">
                <h1>大鸺葵观 满门忠烈</h1>
            </section>
        </main>
    );
}

function Card({
    id = "",
    title,
    image,
    copy = [],
    extraClassName = "",
}: {
    id?: string;
    title: string;
    image: StaticImageData;
    copy?: string[];
    extraClassName?: string;
}) {
    return (
        <div className={cn("", extraClassName)} id={id}>
            <Image
                src={image}
                alt={title}
                className="w-full h-full object-cover rounded-lg"
            />
            {copy && copy.length ? (
                <div className="card-copy">
                    {copy.map((item) => (
                        <p className="text-lg font-medium" key={item}>
                            {item}
                        </p>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
