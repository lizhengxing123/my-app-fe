"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { LenisRef, ReactLenis } from "lenis/react";

import "@/assets/css/20260402.css";

gsap.registerPlugin(ScrollTrigger, SplitText);
export default function Page() {
  const lenisRef = useRef<LenisRef>(null);
  const animateTextRef = useRef<HTMLHeadingElement>(null);
  const scrollTextRef = useRef<HTMLHeadingElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesHeaderArrRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(
    () => {
      const animateText = animateTextRef.current;
      if (!animateText) return;
      animateText.setAttribute("data-text", animateText.textContent.trim());
      ScrollTrigger.create({
        trigger: animateText,
        start: "top 50%",
        end: "bottom 50%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const clipValue = Math.max(0, 100 - progress * 100);
          animateText.style.setProperty("--clip-value", `${clipValue}%`);
        },
      });
    },
    { scope: animateTextRef },
  );

  useGSAP(
    () => {
      const scrollText = scrollTextRef.current;
      if (!scrollText) return;

      // 按行分割
      const splitLines = SplitText.create(scrollText, {
        type: "lines",
        linesClass: "line",
      });

      const lines = splitLines.lines;
      const totalLines = lines.length;

      // 保存每行文本到伪元素
      lines.forEach((line) => {
        line.setAttribute("data-text", line.textContent?.trim() || "");
      });

      ScrollTrigger.create({
        trigger: scrollText,
        start: "top 70%", // 动画开始更早
        end: "bottom 30%", // 动画结束更晚
        scrub: 0.8,
        onUpdate: (self) => {
          const scrollProgress = self.progress; // 整体滚动 0 ~ 1

          lines.forEach((line, index) => {
            // ========== 核心：逐行依次显示的映射 ==========
            const lineDelay = index / totalLines;
            const lineDuration = 1 / totalLines;

            // 本行的动画进度：0 → 1
            const lineProgress = gsap.utils.clamp(
              0,
              1,
              (scrollProgress - lineDelay) / lineDuration,
            );

            // 裁剪进度：100% → 0%（从左到右显示）
            const clipValue = Math.max(0, 100 - lineProgress * 100);

            (line as HTMLElement).style.setProperty(
              "--clip-value",
              `${clipValue}%`,
            );
          });
        },
      });
    },
    { scope: scrollTextRef },
  );

  useGSAP(
    () => {
      const services = servicesRef.current;
      const servicesHeaderArr = servicesHeaderArrRef.current;
      if (!services || !servicesHeaderArr.length) return;
      ScrollTrigger.create({
        trigger: services,
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          servicesHeaderArr.forEach((item, index) => {
            const isOdd = index % 2 === 0;

            gsap.set(item, {
              x: isOdd
                ? `${-100 + progress * 100}%`
                : `${100 - progress * 100}%`,
            });
          });
        },
      });

      ScrollTrigger.create({
        trigger: services,
        start: "top top",
        end: `${window.innerHeight * 2}px`,
        scrub: 1,
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress <= 0.5) {
            const yPercent = progress / 0.5;
            gsap.set(servicesHeaderArr[0], {
              y: `${yPercent * 100}%`,
            });
            gsap.set(servicesHeaderArr[2], {
              y: `${yPercent * -100}%`,
            });
          } else {
            gsap.set(servicesHeaderArr[0], {
              y: `100%`,
            });
            gsap.set(servicesHeaderArr[2], {
              y: `-100%`,
            });

            const scaleProgress = (progress - 0.5) / 0.5;
            const minScale = window.innerWidth < 1000 ? 0.3 : 0.1;
            const scale = 1 - scaleProgress * (1 - minScale);

            servicesHeaderArr.forEach((item) => {
              gsap.set(item, {
                scale,
              });
            });
          }
        },
      });
    },
    { scope: servicesRef },
  );
  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <main className="page">
        <section className="intro">
          <h1>Intro Section</h1>
        </section>
        <section className="about">
          <h1 className="scroll-text" ref={scrollTextRef}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
            possimus odit cum dolorem eius natus voluptates quam laudantium
            repellendus minus blanditiis provident deserunt aperiam doloremque
            ut, numquam quos officia assumenda!
          </h1>
        </section>

        <section className="services" ref={servicesRef}>
          {[1, 2, 3].map((item, index) => (
            <div
              className="services-header"
              key={item}
              ref={(el) => {
                servicesHeaderArrRef.current[index] = el as HTMLDivElement;
              }}
            >
              <svg
                width="1355"
                height="192"
                viewBox="0 0 1355 192"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M53.2727 188.727L5.72205e-06 2.54546H43L73.8182 131.909H75.3636L109.364 2.54546H146.182L180.091 132.182H181.727L212.545 2.54546H255.545L202.273 188.727H163.909L128.455 67H127L91.6364 188.727H53.2727ZM276.614 188.727V2.54546H315.977V79.3636H395.886V2.54546H435.159V188.727H395.886V111.818H315.977V188.727H276.614ZM499.705 188.727H457.523L521.795 2.54546H572.523L636.705 188.727H594.523L547.886 45.0909H546.432L499.705 188.727ZM497.068 115.545H596.705V146.273H497.068V115.545ZM629.273 35V2.54546H782.182V35H725.182V188.727H686.273V35H629.273ZM905.977 2.54546V188.727H866.614V2.54546H905.977ZM1063.61 188.727H997.614V2.54546H1064.16C1082.89 2.54546 1099.01 6.27273 1112.52 13.7273C1126.04 21.1212 1136.43 31.7576 1143.7 45.6364C1151.04 59.5152 1154.7 76.1212 1154.7 95.4546C1154.7 114.848 1151.04 131.515 1143.7 145.455C1136.43 159.394 1125.98 170.091 1112.34 177.545C1098.77 185 1082.52 188.727 1063.61 188.727ZM1036.98 155H1061.98C1073.61 155 1083.4 152.939 1091.34 148.818C1099.34 144.636 1105.34 138.182 1109.34 129.455C1113.4 120.667 1115.43 109.333 1115.43 95.4546C1115.43 81.697 1113.4 70.4545 1109.34 61.7273C1105.34 53 1099.37 46.5758 1091.43 42.4545C1083.49 38.3333 1073.7 36.2727 1062.07 36.2727H1036.98V155ZM1354.95 95.6364C1354.95 115.939 1351.11 133.212 1343.41 147.455C1335.77 161.697 1325.35 172.576 1312.14 180.091C1298.98 187.545 1284.2 191.273 1267.77 191.273C1251.23 191.273 1236.38 187.515 1223.23 180C1210.08 172.485 1199.68 161.606 1192.05 147.364C1184.41 133.121 1180.59 115.879 1180.59 95.6364C1180.59 75.3333 1184.41 58.0606 1192.05 43.8182C1199.68 29.5758 1210.08 18.7273 1223.23 11.2727C1236.38 3.75758 1251.23 0 1267.77 0C1284.2 0 1298.98 3.75758 1312.14 11.2727C1325.35 18.7273 1335.77 29.5758 1343.41 43.8182C1351.11 58.0606 1354.95 75.3333 1354.95 95.6364ZM1315.05 95.6364C1315.05 82.4849 1313.08 71.3939 1309.14 62.3636C1305.26 53.3333 1299.77 46.4849 1292.68 41.8182C1285.59 37.1515 1277.29 34.8182 1267.77 34.8182C1258.26 34.8182 1249.95 37.1515 1242.86 41.8182C1235.77 46.4849 1230.26 53.3333 1226.32 62.3636C1222.44 71.3939 1220.5 82.4849 1220.5 95.6364C1220.5 108.788 1222.44 119.879 1226.32 128.909C1230.26 137.939 1235.77 144.788 1242.86 149.455C1249.95 154.121 1258.26 156.455 1267.77 156.455C1277.29 156.455 1285.59 154.121 1292.68 149.455C1299.77 144.788 1305.26 137.939 1309.14 128.909C1313.08 119.879 1315.05 108.788 1315.05 95.6364Z"
                  fill="white"
                />
              </svg>
            </div>
          ))}
        </section>

        <div className="services-copy">
          <h1 className="animate-text" ref={animateTextRef}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
            possimus odit cum dolorem eius natus voluptates quam laudantium
            repellendus minus blanditiis provident deserunt aperiam doloremque
            ut, numquam quos officia assumenda!
          </h1>
        </div>
        <section className="outro">
          <h1>Outro Section</h1>
        </section>
      </main>
    </>
  );
}
