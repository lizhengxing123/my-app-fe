"use client";

import { useRef, useEffect } from "react";

import * as THREE from "three";

import { useLenis, ReactLenis } from "lenis/react";
// import Lenis from "lenis";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Image from "next/image";
import bg from "@/assets/20260121/bg.jpg";

import { vertexShader, fragmentShader } from "./data";

import "@/assets/css/20260121.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const CONFIG = {
  color: "#ebf5df",
  spread: 0.5,
  speed: 2,
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.89, g: 0.89, b: 0.89 };
};

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroH2Ref = useRef<HTMLDivElement>(null);

  useLenis(() => ScrollTrigger.update());

  const scrollProgressRef = useRef<number>(0);
  useLenis(({ scroll }) => {
    const heroHeight = heroRef.current?.offsetHeight || 0;
    const windowHeight = window.innerHeight;
    const maxScroll = heroHeight - windowHeight;
    scrollProgressRef.current = Math.min(
      (scroll / maxScroll) * CONFIG.speed,
      1.1
    );
  });

  const init = () => {
    const heroCanvas = heroCanvasRef.current;
    const hero = heroRef.current;
    const heroH2 = heroH2Ref.current;

    if (!heroCanvas || !hero || !heroH2) return; // 提前退出

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: false,
    });

    const rgb = hexToRgb(CONFIG.color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
        },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: CONFIG.spread },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function animation() {
      material.uniforms.uProgress.value = scrollProgressRef.current;
      renderer.render(scene, camera);
      requestAnimationFrame(animation);
    }

    animation();

    function resize() {
      const width = hero!.offsetWidth;
      const height = hero!.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(
        hero!.offsetWidth,
        hero!.offsetHeight
      );
    }
    resize();
    window.addEventListener("resize", () => {
      resize();
    });
  };

  useGSAP(
    () => {
      const split = new SplitText(heroH2Ref.current!, {
        type: "words",
        wordClass: "word",
      });
      const words = split.words;

      gsap.set(words, { opacity: 0 });

      ScrollTrigger.create({
        trigger: ".hero-content",
        start: "top 25%",
        end: "bottom 100%",
        onUpdate: (self) => {
          const progress = self.progress;
          const totalWords = words.length;

          words.forEach((word, index) => {
            const wordProgress = index / totalWords;
            const nextWordProgress = (index + 1) / totalWords;

            let opacity = 0;
            if (progress >= nextWordProgress) {
              opacity = 1;
            } else if (progress >= wordProgress) {
              opacity =
                (progress - wordProgress) / (nextWordProgress - wordProgress);
            }

            gsap.to(word, {
              opacity,
              duration: 0.1,
              overwrite: true,
            });
          });
        },
      });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <ReactLenis root />
      <main className="page" ref={containerRef}>
        <section className="hero" ref={heroRef}>
          <div className="hero-img">
            <Image src={bg} alt="bg" />
          </div>

          <div className="hero-header">
            <h1>DarkForest</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores,
              optio.
            </p>
          </div>

          <canvas className="hero-canvas" ref={heroCanvasRef}></canvas>

          <div className="hero-content">
            <h2 ref={heroH2Ref}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
              repellendus sed sint corporis natus qui.
            </h2>
          </div>
        </section>
        <section className="about">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            sapiente eligendi perspiciatis corporis sunt non nulla sint
            consequuntur, dolore necessitatibus iusto beatae quod asperiores
            provident est minus error corrupti similique iste minima voluptatem,
            vel, odio molestiae.
          </p>
        </section>
      </main>
    </>
  );
}
