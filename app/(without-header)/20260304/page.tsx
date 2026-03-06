"use client";

import img1 from "@/assets/20260224/1.jpg";
import img2 from "@/assets/20260224/2.jpg";
import img3 from "@/assets/20260224/3.jpg";
import img4 from "@/assets/20260224/4.jpg";
import img5 from "@/assets/20260224/5.jpg";
import "@/assets/css/20260304.css";
import { useEffect } from "react";

const projectInfo = [
  {
    id: 1,
    title: "Redroom Gesture 14",
    imagePath: img1,
    category: "Concept Series",
    year: 2025,
  },
  {
    id: 2,
    title: "Shadowwear 6AM",
    imagePath: img2,
    category: "Photography",
    year: 2024,
  },
  {
    id: 3,
    title: "Blur Formation 03",
    imagePath: img3,
    category: "Kinetic Study",
    year: 2024,
  },
  {
    id: 4,
    title: "Sunglass Operator",
    imagePath: img4,
    category: "Editorial Motion",
    year: 2023,
  },
  {
    id: 5,
    title: "Azure Figure 5",
    imagePath: img5,
    category: "Visual Research",
    year: 2024,
  },
];
const config = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

const state = {
  currentY: 0,
  targetY: 0,
  isDragging: false,
  projects: new Map(),
  minimap: new Map(),
  minimapInfo: new Map(),
  projectHeight: () => window.innerHeight,
  minimapHeight: 250,
  isSnapping: false,
  snapStart: { time: 0, y: 0, target: 0 },
  dragStart: { y: 0, scrollY: 0 },
  lastScrollTime: Date.now(),
};

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const createParallax = (img: HTMLImageElement, height: number) => {
  let current = 0;
  return {
    update: (scroll: number, index: number) => {
      const target = (-scroll - index * height) * 0.2;
      current = lerp(current, target, 0.1);
      if (Math.abs(current - target) > 0.01) {
        img.style.transform = `translateY(${current}px) scale(1.5)`;
      }
    },
  };
};

const getProgectData = (index: number) => {
  const i =
    ((Math.abs(index) % projectInfo.length) + projectInfo.length) %
    projectInfo.length;
  return projectInfo[i];
};

const createElement = (index: number, type: "main" | "minimap" | "info") => {
  const maps = {
    main: state.projects,
    minimap: state.minimap,
    info: state.minimapInfo,
  };

  if (maps[type].has(index)) return;

  const data = getProgectData(index);

  const num = (
    (((Math.abs(index) % projectInfo.length) + projectInfo.length) %
      projectInfo.length) +
    1
  )
    .toString()
    .padStart(2, "0");

  if (type === "main") {
    const el = document.createElement("div");
    el.className = "project";
    el.innerHTML = `<img src="${data.imagePath.src}" alt="${data.title}" />`;
    document.querySelector(".project-list")?.appendChild(el);
    state.projects.set(index, {
      el,
      parallax: createParallax(el.querySelector("img")!, state.projectHeight()),
    });
  } else if (type === "minimap") {
    const el = document.createElement("div");
    el.className = "minimap-img-item";
    el.innerHTML = `<img src="${data.imagePath.src}" alt="${data.title}" />`;
    document.querySelector(".minimap-img-preview")?.appendChild(el);
    state.minimap.set(index, {
      el,
      parallax: createParallax(el.querySelector("img")!, state.minimapHeight),
    });
  } else {
    const el = document.createElement("div");
    el.className = "minimap-item-info";
    el.innerHTML = `
      <div class="minimap-item-info-row">
        <p>${num}</p>
        <p>${data.title}</p>
      </div>
      <div class="minimap-item-info-row">
        <p>${data.category}</p>
        <p>${data.year}</p>
      </div>
    `;
    document.querySelector(".minimap-info-list")?.appendChild(el);
    state.minimapInfo.set(index, {
      el,
    });
  }
};

const syncElements = () => {
    const current = Math.round(-state.currentY / state.projectHeight());
    const min = current - config.BUFFER_SIZE;
    const max = current + config.BUFFER_SIZE;

    for(let i = min; i <= max; i++) {
        createElement(i, "main");
        createElement(i, "minimap");
        createElement(i, "info");
    }

    [state.projects, state.minimap, state.minimapInfo].forEach(map => {
        map.forEach((item, index) => {
            if(index < min || index > max) {
                item.el.remove();
                map.delete(index);
            }
        })
    })
}

const snapToProject = () => {
    state.isSnapping = true;
    state.snapStart = {
        time: Date.now(),
        y: state.targetY,
        target: -Math.round(-state.targetY / state.projectHeight()) * state.projectHeight(),
    }
}

const updateSnap = () => {
    const progress = Math.min((Date.now() - state.snapStart.time) / config.SNAP_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    state.targetY = state.snapStart.y + (state.snapStart.target - state.snapStart.y) * eased;
    if(progress >= 1) state.isSnapping = false;
}

const updatePositions = () => {
    const minimapY = (state.currentY * state.minimapHeight) / state.projectHeight();

    state.projects.forEach((item, index) => {
      const y = index * state.projectHeight() + state.currentY;
      item.el.style.transform = `translateY(${y}px)`;
      item.parallax.update(state.currentY, index);
    })
    state.minimap.forEach((item, index) => {
      const y = index * state.minimapHeight + minimapY;
      item.el.style.transform = `translateY(${y}px)`;
      item.parallax.update(minimapY, index);
    })
    state.minimapInfo.forEach((item, index) => {
      item.el.style.transform = `translateY(${
        index * state.minimapHeight + minimapY
      }px)`;
    })
}

const animate = () => {
    const now = Date.now();

    if(!state.isSnapping && !state.isDragging && now - state.lastScrollTime > 100) {
        const snapPoint = -Math.round(-state.targetY / state.projectHeight()) * state.projectHeight();
        if(Math.abs(state.targetY - snapPoint) > 1) snapToProject();
    }

    if(state.isSnapping) updateSnap();

    if(!state.isDragging) state.currentY += (state.targetY - state.currentY) * config.LERP_FACTOR;

    syncElements();
    updatePositions();
    requestAnimationFrame(animate);
}
export default function Page() {
  const init = () => {
    for (let i = -config.BUFFER_SIZE; i <= config.BUFFER_SIZE; i++) {
      createElement(i, "main");
      createElement(i, "minimap");
      createElement(i, "info");
    }
  };

  useEffect(() => {
    // init();
    animate();

    window.addEventListener("wheel", (e) => {
        e.preventDefault();
        state.isSnapping = false;
        state.lastScrollTime = Date.now();
        const delta = Math.max(
            Math.min(e.deltaY * config.SCROLL_SPEED, config.MAX_VELOCITY),
            -config.MAX_VELOCITY
        )
        state.targetY -= delta;
    }, { passive: false })

    window.addEventListener("touchstart", (e) => {
        state.isDragging = true;
        state.isSnapping = false;
        state.dragStart = {
            y: e.touches[0].clientY,
            scrollY: state.targetY,
        }
        state.lastScrollTime = Date.now();
    })

    window.addEventListener("touchmove", (e) => {
        if(!state.isDragging) return;
        const delta = e.touches[0].clientY - state.dragStart.y;
        state.targetY = state.dragStart.scrollY + delta * 1.5;
        state.lastScrollTime = Date.now();
    })

    window.addEventListener("touchend", (e) => {
        state.isDragging = false;
    })

    window.addEventListener("resize", (e) => {
        updatePositions();
    })
  }, []);
  return (
    <main className="page">
      <div className="page-container">
        <ul className="project-list"></ul>
        <div className="minimap">
          <div className="minimap-wrapper">
            <div className="minimap-img-preview"></div>
            <div className="minimap-info-list"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
