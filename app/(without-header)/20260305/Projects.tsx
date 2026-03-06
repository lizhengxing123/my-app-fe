"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import Image from "next/image";
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
import img11 from "@/assets/20260224/1.jpg";
import img12 from "@/assets/20260224/2.jpg";
import img13 from "@/assets/20260224/3.jpg";
import img14 from "@/assets/20260224/4.jpg";
import img15 from "@/assets/20260224/5.jpg";
import img16 from "@/assets/20260205/spring.webp";

export const PROJECTS = [
  { name: "Fieldnotes", year: 2020, img: img1 },
  { name: "Redline", year: 2021, img: img2 },
  { name: "Gallery Walk", year: 2019, img: img3 },
  { name: "Side Profile", year: 2022, img: img4 },
  { name: "Open Mic", year: 2023, img: img5 },
  { name: "Backboard", year: 2024, img: img6 },
  { name: "Afterglow", year: 2021, img: img7 },
  { name: "Hill House", year: 2020, img: img8 },
  { name: "Low Tide", year: 2018, img: img9 },
  { name: "Timepiece", year: 2019, img: img10 },
  { name: "Close Focus", year: 2022, img: img11 },
  { name: "Airframe", year: 2023, img: img12 },
  { name: "Hardcase", year: 2024, img: img13 },
  { name: "Deep Red", year: 2021, img: img14 },
  { name: "Fast Track", year: 2022, img: img15 },
  { name: "Night Shift", year: 2025, img: img16 },
];

const PROJECTS_PER_ROW = 9;
const TOTAL_ROWS = 10;
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const rowStartWidth = useRef<number>(125);
  const rowEndWidth = useRef<number>(500);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = rowsRef.current;
    const isMobile = window.innerWidth <= 1000;
    rowStartWidth.current = isMobile ? 250 : 125;
    rowEndWidth.current = isMobile ? 750 : 500;

    const firstRow = rows[0];
    firstRow.style.width = `${rowEndWidth.current}%`;
    const expandedRowHeight = firstRow.offsetHeight;
    firstRow.style.width = "";

    const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
    const sectionPadding =
      parseFloat(getComputedStyle(section).paddingTop) || 0;

    const expandedSectionHeight =
      expandedRowHeight * rows.length +
      sectionGap * (rows.length - 1) +
      sectionPadding * 2;

    section.style.height = `${expandedSectionHeight}px`;

    function onScrollUpdate() {
      // 文档在垂直方向已滚动的像素值。
      const scrollY = window.scrollY;
      // 浏览器窗口的视口（viewport）高度（以像素为单位）
      const viewportHeight = window.innerHeight;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect(); // 获取行相对于视口的位置信息
        const rowTop = rect.top + scrollY; // 行顶部在整个文档中的绝对位置（像素）
        const rowBottom = rowTop + rect.height; // 行底部在整个文档中的绝对位置（像素）
        // 元素顶部到达视口顶部需要滚动的距离
        const scrollStart = rowTop - viewportHeight;
        // 元素底部到达视口底部需要滚动的距离
        const scrollEnd = rowBottom;
        // 计算滚动进度（0到1之间的数值）
        let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
        progress = Math.max(0, Math.min(1, progress));
        // 计算行的宽度（根据进度）
        const width =
          rowStartWidth.current +
          (rowEndWidth.current - rowStartWidth.current) * progress;
        row.style.width = `${width}%`;
      });
    }

    gsap.ticker.add(onScrollUpdate);

    const handleResize = () => {
      const isMobile = window.innerWidth <= 1000;
      rowStartWidth.current = isMobile ? 250 : 125;
      rowEndWidth.current = isMobile ? 750 : 500;

      firstRow.style.width = `${rowEndWidth.current}%`;
      const newRowHeight = firstRow.offsetHeight;
      firstRow.style.width = "";

      const newSectionHeight =
        newRowHeight * rows.length +
        sectionGap * (rows.length - 1) +
        sectionPadding * 2;

      section.style.height = `${newSectionHeight}px`;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(onScrollUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const rowsData = [];
  let currentProjectIndex = 0;
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const projects = [];
    for (let c = 0; c < PROJECTS_PER_ROW; c++) {
      projects.push(PROJECTS[currentProjectIndex % PROJECTS.length]);
      currentProjectIndex++;
    }
    rowsData.push(projects);
  }
  return (
    <section className="projects" ref={sectionRef}>
      {rowsData.map((rowProjects, rowIndex) => (
        <div
          className="projects-row"
          key={rowIndex}
          ref={(el) => {
            if (el) rowsRef.current[rowIndex] = el;
          }}
        >
          {rowProjects.map((project, colIndex) => (
            <div className="project" key={colIndex}>
              <div className="project-img">
                <Image src={project.img} alt={project.name} />
              </div>
              <div className="project-info">
                <p className="project-name">{project.name}</p>
                <p>{project.year}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
