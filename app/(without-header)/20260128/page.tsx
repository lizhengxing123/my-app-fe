"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import Image from "next/image";

// 图片导入
import img1 from "@/assets/20260128/1.jpg";
import img2 from "@/assets/20260128/2.jpg";
import img3 from "@/assets/20260128/3.jpg";
import img4 from "@/assets/20260128/4.jpg";
import img5 from "@/assets/20260128/5.jpg";
import img6 from "@/assets/20260128/6.jpg";
import img7 from "@/assets/20260128/7.jpg";
import img8 from "@/assets/20260128/8.jpg";
import img9 from "@/assets/20260128/9.jpg";
import img10 from "@/assets/20260128/10.jpg";

import "@/assets/css/20260128.css";

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// 扩展数据：新增 desc 字段
const PROJECT_DATA = [
  {
    img: img1,
    name: "January Spring Festival",
    desc: ["Spring", "Family"],
  },
  {
    img: img2,
    name: "February Aphid",
    desc: ["Aphid", "Spring"],
  },
  {
    img: img3,
    name: "March Pearl",
    desc: ["Pearl", "Spring rain"],
  },
  {
    img: img4,
    name: "April Home",
    desc: ["Home", "Spring cleaning"],
  },
  {
    img: img5,
    name: "May to work",
    desc: ["Work", "Labor"],
  },
  {
    img: img6,
    name: "June Swimming",
    desc: ["Swimming", "Summer"],
  },
  {
    img: img7,
    name: "July Summer",
    desc: ["Summer", "Mid-summer"],
  },
  {
    img: img8,
    name: "August 28",
    desc: ["Special date", "Late"],
  },
  {
    img: img9,
    name: "September Yang",
    desc: ["Autumn", "Back to"],
  },
  {
    img: img10,
    name: "October Chinese",
    desc: ["National Day", "Autumn"],
  },
];
const TOTAL_PROJECTS = PROJECT_DATA.length;

export default function Page() {
  // React 状态
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nameProgressMap, setNameProgressMap] = useState<
    Record<number, number>
  >({});

  // Ref 引用
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightSectionRef = useRef<HTMLDivElement>(null);
  const projectIndexRef = useRef<HTMLDivElement>(null);
  const projectImagesContainerRef = useRef<HTMLDivElement>(null);
  const projectNamesContainerRef = useRef<HTMLDivElement>(null);

  // 计算动画常量
  const getAnimationConstants = () => {
    if (!spotlightSectionRef.current) return null;

    const spotlightSection = spotlightSectionRef.current;
    const spotlightSectionHeight = spotlightSection.offsetHeight;
    const spotlightSectionPadding = parseFloat(
      getComputedStyle(spotlightSection).padding,
    );

    const projectIndexHeight = projectIndexRef.current?.offsetHeight || 0;
    const projectNamesContainerHeight =
      projectNamesContainerRef.current?.offsetHeight || 0;
    const projectImagesContainerHeight =
      projectImagesContainerRef.current?.offsetHeight || 0;

    return {
      moveDistanceIndex:
        spotlightSectionHeight -
        spotlightSectionPadding * 2 -
        projectIndexHeight,
      moveDistanceNames:
        spotlightSectionHeight -
        spotlightSectionPadding * 2 -
        projectNamesContainerHeight,
      moveDistanceImages: window.innerHeight - projectImagesContainerHeight,
      imgActivationThreshold: window.innerHeight / 2,
    };
  };

  // GSAP 滚动动画逻辑
  useGSAP(
    () => {
      const constants = getAnimationConstants();
      if (!constants) return;

      const scrollTrigger = ScrollTrigger.create({
        trigger: spotlightSectionRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 5}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // 更新当前项目索引
          const index = Math.min(
            Math.floor(progress * TOTAL_PROJECTS),
            TOTAL_PROJECTS - 1,
          );
          setCurrentProjectIndex(index);

          // 计算每个名称的进度
          const newNameProgressMap: Record<number, number> = {};
          PROJECT_DATA.forEach((_, idx) => {
            const startProgress = idx / TOTAL_PROJECTS;
            const endProgress = (idx + 1) / TOTAL_PROJECTS;
            newNameProgressMap[idx] = Math.max(
              0,
              Math.min(
                1,
                (progress - startProgress) / (endProgress - startProgress),
              ),
            );
          });
          setNameProgressMap(newNameProgressMap);

          // 更新动画样式
          if (projectIndexRef.current) {
            gsap.set(projectIndexRef.current, {
              y: progress * constants.moveDistanceIndex,
            });
          }
          if (projectImagesContainerRef.current) {
            gsap.set(projectImagesContainerRef.current, {
              y: progress * constants.moveDistanceImages,
            });
          }
        },
      });

      // 清理函数
      return () => scrollTrigger.kill();
    },
    { scope: containerRef },
  );

  // 监听图片激活状态
  useEffect(() => {
    const constants = getAnimationConstants();
    if (!constants || !projectImagesContainerRef.current) return;

    const projectImages =
      projectImagesContainerRef.current.querySelectorAll(".project-img");
    const updateImageOpacity = () => {
      projectImages.forEach((img) => {
        const imgRect = img.getBoundingClientRect();
        const isActive =
          imgRect.top <= constants.imgActivationThreshold &&
          imgRect.bottom >= constants.imgActivationThreshold;
        gsap.set(img, { opacity: isActive ? 1 : 0.5 });
      });
    };

    updateImageOpacity();
    window.addEventListener("scroll", updateImageOpacity);
    window.addEventListener("resize", updateImageOpacity);

    return () => {
      window.removeEventListener("scroll", updateImageOpacity);
      window.removeEventListener("resize", updateImageOpacity);
    };
  }, [scrollProgress]);

  // 计算当前显示的内容
  const currentIndexText = `${String(currentProjectIndex + 1).padStart(2, "0")}/${String(TOTAL_PROJECTS).padStart(2, "0")}`;
  const currentProject = PROJECT_DATA[currentProjectIndex]; // 获取当前完整项目数据

  return (
    <>
      <ReactLenis root />
      <main className="page" ref={containerRef}>
        <section className="intro">
          <p>Scroll down to learn more</p>
        </section>
        <section className="spotlight" ref={spotlightSectionRef}>
          <div className="project-desc">
            <p>
              {currentProject.desc.map((descText, idx) => (
                <span key={idx}>{descText}</span>
              ))}
            </p>
          </div>

          {/* 项目索引 */}
          <div className="project-index">
            <h1 ref={projectIndexRef}>{currentIndexText}</h1>
          </div>

          {/* 项目图片 */}
          <div className="project-images" ref={projectImagesContainerRef}>
            {PROJECT_DATA.map((item, index) => (
              <div className="project-img" key={index}>
                <Image
                  src={item.img}
                  alt={`project ${index + 1}: ${item.name}`}
                />
              </div>
            ))}
          </div>

          {/* 项目名称列表 */}
          <div className="project-names" ref={projectNamesContainerRef}>
            {PROJECT_DATA.map((item, index) => {
              const progress = nameProgressMap[index] || 0;
              const constants = getAnimationConstants();
              const moveDistanceNames = constants?.moveDistanceNames || 0;

              return (
                <p
                  key={index}
                  className="project-name"
                  style={{
                    transform: `translateY(${-progress * moveDistanceNames}px)`,
                    color: progress > 0 && progress < 1 ? "#111" : "#999",
                  }}
                >
                  {item.name}
                </p>
              );
            })}
          </div>
        </section>
        <section className="outro">
          <p>Scroll up to learn more</p>
        </section>
      </main>
    </>
  );
}
