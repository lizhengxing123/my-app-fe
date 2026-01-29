"use client";

import { ReactLenis } from "lenis/react";

import Copy from "./Copy";

import Image from "next/image";
import heroImg from "@/assets/20260129/hero.jpg";
import aboutImg from "@/assets/20260129/about.jpg";

import "@/assets/css/20250129.css";

export default function Page() {
    return (
        <>
            <ReactLenis root>
                <nav>
                    <div className="col">
                        <div className="sub-col">
                            <span>Zheng</span>
                        </div>
                        <div className="sub-col">
                            <span>Xing</span>
                            <span>About</span>
                            <span>Contact</span>
                            <span>Projects</span>
                        </div>
                    </div>
                    <div className="col">
                        <span>Let's Go</span>
                    </div>
                </nav>

                <section className="hero">
                    <div className="hero-img">
                        <Image src={heroImg} alt="hero" />
                    </div>
                    <div className="header">
                        <Copy delay={0.5}>
                            <h1>
                                Lorem ipsum dolor sit amet consectetur,
                                adipisicing elit.
                            </h1>
                        </Copy>
                    </div>
                </section>

                <section className="about">
                    <Copy>
                        <span>
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                        </span>
                    </Copy>

                    <div className="header">
                        <Copy>
                            <h1>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Dolorum quos consequatur
                                veritatis voluptatem, dolore in blanditiis quas
                                consectetur possimus animi?
                            </h1>
                        </Copy>
                    </div>
                </section>

                <section className="about-img">
                    <Image src={aboutImg} alt="about" />
                </section>

                <section className="story">
                    <div className="col">
                        <Copy>
                            <h1>
                                Lorem ipsum dolor
                                <br /> sit amet.
                            </h1>
                        </Copy>
                    </div>
                    <div className="col">
                        <Copy>
                            <p>
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Perferendis, sapiente quae
                                nihil fugiat, optio impedit inventore
                                consequatur aliquam quibusdam nulla asperiores,
                                commodi saepe minima non iste nobis!
                            </p>
                            <p>
                                Nostrum nihil natus enim velit nam earum
                                exercitationem mollitia ullam similique ad
                                provident optio, eveniet deleniti? Doloremque
                                obcaecati rerum mollitia voluptate. Iusto sit
                                neque magni, similique nemo repudiandae quidem
                                consectetur aliquid debitis, quas, veniam
                                laborum architecto nisi maiores atque enim porro
                                inventore
                            </p>
                            <p>
                                dolorem a in quo delectus odio exercitationem
                                dignissimos! Odio dolorem eos ullam laudantium
                                harum, cupiditate velit dignissimos illum
                                blanditiis mollitia, voluptatum esse? Harum
                                quasi vero quibusdam rerum dolores autem,
                                veritatis neque?
                            </p>
                        </Copy>
                    </div>
                </section>

                <section className="philosophy">
                    <Copy>
                        <span>Lorem, ipsum dolor.</span>
                    </Copy>

                    <div className="header">
                        <Copy>
                            <h1>
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Vero voluptate voluptatem, a
                                magni ducimus quis ut voluptatum quod magnam
                                nemo aperiam quae eius! Cum adipisci
                                necessitatibus ipsum doloremque aliquam dolores.
                            </h1>
                        </Copy>
                    </div>
                </section>

                <footer>
                    <div className="col">
                        <div className="sub-col">
                            <span>Lorem ipsum dolor.</span>
                        </div>
                        <div className="sub-col">
                            <Copy>
                                <h1>LinkedIn</h1>
                                <h1>ChainLink</h1>
                                <h1>Twitter</h1>
                                <h1>Dify</h1>
                                <h1>Email</h1>
                            </Copy>
                        </div>
                    </div>
                    <div className="col">
                        <span>Copyright ZXing 2026</span>
                    </div>
                </footer>
            </ReactLenis>
        </>
    );
}
