"use client";

import { ReactLenis } from "lenis/react";

import ScrollTextAnimation from "./ScrollTextAnimation";
import BlockTextReveal from "./BlockTextReveal";

import Image from "next/image";
import heroImg from "@/assets/20260129/hero.jpg";
import aboutImg from "@/assets/20260129/about.jpg";

import "@/assets/css/20260129.css";

export default function Page() {
  return (
    <>
      <ReactLenis root>
        <nav>
          <div className="col">
            <div className="sub-col">
              <BlockTextReveal blockColor="#ff0">
                <span>Zheng</span>
              </BlockTextReveal>
            </div>
            <div className="sub-col">
              <BlockTextReveal blockColor="#ff0">
                <span>Xing</span>
                <span>About</span>
                <span>Contact</span>
                <span>Projects</span>
              </BlockTextReveal>
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
            <ScrollTextAnimation delay={0.5}>
              <h1>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</h1>
            </ScrollTextAnimation>
          </div>
        </section>

        <section className="about">
          <BlockTextReveal>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing.</span>
          </BlockTextReveal>

          <div className="header">
            <ScrollTextAnimation>
              <h1>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
                quos consequatur veritatis voluptatem, dolore in blanditiis quas
                consectetur possimus animi?
              </h1>
            </ScrollTextAnimation>
          </div>
        </section>

        <section className="about-desc">
          <BlockTextReveal blockColor="#ff0">
            <h1>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Doloremque, est.
            </h1>
          </BlockTextReveal>

          <Image src={aboutImg} alt="about" />

          <BlockTextReveal blockColor="#f0f">
            <p>Lorem, ipsum dolor.</p>
          </BlockTextReveal>
        </section>

        <section className="story">
          <div className="col">
            <ScrollTextAnimation>
              <h1>
                Lorem ipsum dolor
                <br /> sit amet.
              </h1>
            </ScrollTextAnimation>
          </div>
          <div className="col">
            <ScrollTextAnimation>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Perferendis, sapiente quae nihil fugiat, optio impedit inventore
                consequatur aliquam quibusdam nulla asperiores, commodi saepe
                minima non iste nobis!
              </p>
              <p>
                Nostrum nihil natus enim velit nam earum exercitationem mollitia
                ullam similique ad provident optio, eveniet deleniti? Doloremque
                obcaecati rerum mollitia voluptate. Iusto sit neque magni,
                similique nemo repudiandae quidem consectetur aliquid debitis,
                quas, veniam laborum architecto nisi maiores atque enim porro
                inventore
              </p>
              <p>
                dolorem a in quo delectus odio exercitationem dignissimos! Odio
                dolorem eos ullam laudantium harum, cupiditate velit dignissimos
                illum blanditiis mollitia, voluptatum esse? Harum quasi vero
                quibusdam rerum dolores autem, veritatis neque?
              </p>
            </ScrollTextAnimation>
          </div>
        </section>

        <section className="philosophy">
          <ScrollTextAnimation>
            <span>Lorem, ipsum dolor.</span>
          </ScrollTextAnimation>

          <div className="header">
            <ScrollTextAnimation>
              <h1>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero
                voluptate voluptatem, a magni ducimus quis ut voluptatum quod
                magnam nemo aperiam quae eius! Cum adipisci necessitatibus ipsum
                doloremque aliquam dolores.
              </h1>
            </ScrollTextAnimation>
          </div>
        </section>

        <footer>
          <div className="col">
            <div className="sub-col">
              <span>Lorem ipsum dolor.</span>
            </div>
            <div className="sub-col">
              <ScrollTextAnimation>
                <h1>LinkedIn</h1>
                <h1>ChainLink</h1>
                <h1>Twitter</h1>
                <h1>Dify</h1>
                <h1>Email</h1>
              </ScrollTextAnimation>
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
