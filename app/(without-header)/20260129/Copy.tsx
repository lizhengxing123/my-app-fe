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
}

export default function Copy({
    children,
    animationOnScroll = true,
    delay = 0,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLElement[]>([]);
    const splitRef = useRef<SplitText[]>([]);
    const linesRef = useRef<HTMLElement[]>([]);

    useGSAP(
        () => {
            if (!containerRef.current) {
                return;
            }
            const container = containerRef.current;

            elementRef.current = [];
            splitRef.current = [];
            linesRef.current = [];

            let elements = [];
            if (container.hasAttribute("data-copy-wrapper")) {
                elements = Array.from(container.children) as HTMLElement[];
            } else {
                elements = [container];
            }

            elements.forEach((element) => {
                elementRef.current.push(element);

                const split = SplitText.create(element, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "line++",
                });

                splitRef.current.push(split);

                const computedStyle = window.getComputedStyle(element);
                const textIndent = computedStyle.textIndent;

                if (textIndent && textIndent !== "0px") {
                    if (split.lines.length > 0) {
                        (split.lines[0] as HTMLElement).style.paddingLeft =
                            textIndent;
                    }
                    element.style.textIndent = "0px";
                }

                linesRef.current.push(...(split.lines as HTMLElement[]));
            });

            gsap.set(linesRef.current, {
                y: "100%",
            });

            const animationProps = {
                y: "0%",
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
                delay,
            };

            if (animationOnScroll) {
                gsap.to(linesRef.current, {
                    ...animationProps,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 75%",
                        once: true,
                    },
                });
            } else {
                gsap.to(linesRef.current, animationProps);
            }

            return () => {
                splitRef.current.forEach((split) => {
                    if (split) {
                        split.revert();
                    }
                });
            };
        },
        {
            scope: containerRef,
            dependencies: [animationOnScroll, delay],
        },
    );

    if (Children.count(children) === 1 && isValidElement(children)) {
        const child = children as ReactElement<{ ref?: React.Ref<HTMLDivElement> }>;
        return cloneElement(child, {
            ref: containerRef,
        });
    }

    return (
        <div ref={containerRef} data-copy-wrapper="true">
            {children}
        </div>
    );
}
