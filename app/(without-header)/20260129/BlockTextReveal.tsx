"use client";

import {
    cloneElement,
    ReactElement,
    ReactNode,
    useRef,
    Children,
    isValidElement,
} from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Props {
    children: ReactNode;
    animationOnScroll?: boolean;
    delay?: number;
    blockColor?: string;
    stagger?: number;
    duration?: number;
}

export default function BlockTextReveal({
    children,
    animationOnScroll = true,
    delay = 0,
    blockColor = "#000",
    stagger = 0.15,
    duration = 0.75,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const splitRef = useRef<SplitText[]>([]);
    const linesRef = useRef<HTMLElement[]>([]);
    const blocksRef = useRef<HTMLElement[]>([]);

    useGSAP(
        () => {
            if (!containerRef.current) {
                return;
            }

            const container = containerRef.current;

            splitRef.current = [];
            linesRef.current = [];
            blocksRef.current = [];

            let elements = [];
            if (container.hasAttribute("data-copy-wrapper")) {
                elements = Array.from(container.children);
            } else {
                elements = [container];
            }

            elements.forEach((element) => {
                const split = SplitText.create(element, {
                    type: "lines",
                    linesClass: "block-line++",
                    linesThreshold: 0.1,
                });

                splitRef.current.push(split);

                split.lines.forEach((line) => {
                    const wrapper = document.createElement("div");
                    wrapper.className = "block-line-wrapper";
                    line.parentNode?.insertBefore(wrapper, line);
                    wrapper.appendChild(line);

                    const block = document.createElement("div");
                    block.className = "block-revealer";
                    block.style.backgroundColor = blockColor;
                    wrapper.appendChild(block);

                    linesRef.current.push(line as HTMLElement);
                    blocksRef.current.push(block);
                });
            });

            gsap.set(linesRef.current, { opacity: 0 });
            gsap.set(blocksRef.current, {
                scaleX: 0,
                transformOrigin: "left center",
            });

            const createBlockRevealAnimation = (
                block: HTMLElement,
                line: HTMLElement,
                index: number,
            ) => {
                const t1 = gsap.timeline({
                    delay: delay + index * stagger,
                });

                t1.to(block, {
                    scaleX: 1,
                    duration,
                    ease: "power4.inOut",
                });
                t1.set(line, { opacity: 1 });
                t1.set(block, { transformOrigin: "right center" });
                t1.to(block, {
                    scaleX: 0,
                    duration,
                    ease: "power4.inOut",
                });

                return t1;
            };

            if (animationOnScroll) {
                blocksRef.current.forEach((block, index) => {
                    const t1 = createBlockRevealAnimation(
                        block,
                        linesRef.current[index],
                        index,
                    );
                    t1.pause();

                    ScrollTrigger.create({
                        trigger: container,
                        start: "top 90%",
                        once: true,
                        onEnter: () => t1.play(),
                    });
                });
            } else {
                blocksRef.current.forEach((block, index) => {
                    createBlockRevealAnimation(
                        block,
                        linesRef.current[index],
                        index,
                    );
                });
            }

            return () => {
                splitRef.current.forEach((split) => split && split.revert());
                const wrappers = container.querySelectorAll(
                    ".block-line-wrapper",
                );
                wrappers.forEach((wrapper) => {
                    if (wrapper.parentNode && wrapper.firstChild) {
                        wrapper.parentNode.insertBefore(
                            wrapper.firstChild,
                            wrapper,
                        );
                        wrapper.remove();
                    }
                });
            };
        },
        {
            scope: containerRef,
            dependencies: [
                animationOnScroll,
                stagger,
                duration,
                delay,
                blockColor,
            ],
        },
    );

    return (
        <div ref={containerRef} data-copy-wrapper="true">
            {children}
        </div>
    );
}
