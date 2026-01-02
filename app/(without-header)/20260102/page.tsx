"use client";

import { useRef, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore
import "@/assets/css/20260102.css";

import Image from "next/image";
import img1 from "@/assets/20260102/img1.png";
import img2 from "@/assets/20260102/img2.png";
import img3 from "@/assets/20260102/img3.png";
import img4 from "@/assets/20260102/img4.png";

export default function Page() {
    const pathRef = useRef<SVGPathElement>(null);

    const init = () => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        if (!pathRef.current) return;

        const pathLength = pathRef.current.getTotalLength();

        pathRef.current.style.strokeDasharray = pathLength.toString();
        pathRef.current.style.strokeDashoffset = pathLength.toString();

        gsap.to(pathRef.current, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".spotlight",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            },
        });
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <main className="page">
            <section className="hero">
                <h1>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo adipisci vel incidunt hic fugiat ut? Animi assumenda explicabo voluptas alias expedita, incidunt provident possimus quis architecto natus. Adipisci, laudantium iste.</h1>
            </section>
            <section className="spotlight">
                <div className="row">
                    <div className="img">
                        <Image src={img1} alt="img1" />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="card">
                            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, architecto?</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis facere repellat vitae? Labore itaque dolorem unde ab pariatur, explicabo dolore accusantium aut maxime aliquid veritatis deserunt voluptate vel iste libero ipsum perferendis cupiditate repellat ipsa amet eveniet? Laudantium nihil at facilis eum nisi nostrum et vel hic eveniet! Corrupti, dicta? Rerum, adipisci ipsam est deserunt, quas quidem aspernatur assumenda vitae expedita doloribus illo corporis vel libero sit facilis dolorem nisi nesciunt accusamus omnis, quos cumque distinctio. Porro, labore dolores! Dolor iure totam autem numquam doloribus velit placeat ipsam enim quis culpa! Cupiditate doloremque recusandae mollitia labore? Possimus beatae tenetur eligendi!</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="img">
                            <Image
                                src={img2}
                                alt="img2"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="img">
                            <Image
                                src={img3}
                                alt="img3"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <h2>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, et.
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni qui, exercitationem suscipit hic aliquid delectus, provident explicabo fuga accusantium, quisquam consectetur iure quam dolor consequuntur. Doloribus maxime consequuntur error deserunt suscipit alias numquam, earum explicabo ipsam iusto aspernatur, laborum dolore beatae perspiciatis totam! Distinctio necessitatibus ipsum porro et? Autem exercitationem ipsam impedit! Unde recusandae neque ipsum laudantium, illum iste, reprehenderit et, vero perferendis maiores cupiditate quaerat! Tempora incidunt, libero deleniti repellendus dolorem numquam cupiditate esse atque tempore aliquam corrupti provident, dicta facilis eius sed nisi saepe fugiat aperiam ipsum itaque. Nihil molestiae laborum sapiente corporis! Architecto et cum quibusdam tenetur!
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                        <div className="img">
                            <Image
                                src={img4}
                                alt="img4"
                                className="w-full h-full object-cover"
                            />
                        </div>
                </div>
                <div className="svg-path">
                    <svg
                        width="1104"
                        height="3459"
                        viewBox="0 0 1104 3459"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M903.019 75.0082C903.019 75.0082 70.5184 181.508 75.0184 613.508C79.5184 1045.51 1028.02 881.008 1028.02 1562.01C1028.02 2243.01 21.519 2760.01 168.519 2101.01C315.519 1442.01 1428.4 2998.63 493.519 3383.51"
                            ref={pathRef}
                            stroke="#3109F6"
                            strokeWidth="150"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </section>
            <section className="outro">
                <h1>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum perspiciatis facere enim exercitationem cupiditate fugit minus atque, optio ad dolor tempore aut nisi ducimus! Nisi tempore quos accusamus quis assumenda.
                </h1>
            </section>
        </main>
    );
}
