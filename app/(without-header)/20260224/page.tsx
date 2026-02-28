"use client";

import { useState, useRef, useCallback, memo, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

// 导入图片
import img1 from "@/assets/20260224/1.jpg";
import img2 from "@/assets/20260224/2.jpg";
import img3 from "@/assets/20260224/3.jpg";
import img4 from "@/assets/20260224/4.jpg";
import img5 from "@/assets/20260224/5.jpg";

import "@/assets/css/20260224.css";

// 常量定义（移出组件，避免重复创建）
const menuItems = [
  { label: "Home", href: "#", img: img1, id: "home" },
  { label: "About", href: "#", img: img2, id: "about" },
  { label: "Contact", href: "#", img: img3, id: "contact" },
  { label: "Projects", href: "#", img: img4, id: "projects" },
];

const socialItems = [
  { label: "Facebook", href: "#", id: "fb" },
  { label: "Twitter", href: "#", id: "tw" },
  { label: "LinkedIn", href: "#", id: "li" },
  { label: "GitHub", href: "#", id: "gh" },
];

// 预定义动画配置（复用）
const ANIM_CONFIG = {
  duration: 1.25,
  ease: "power4.inOut",
};

const MENU_ITEM_ANIM = {
  duration: 1,
  delay: 0.75,
  stagger: 0.1,
  ease: "power3.out",
};

const IMG_ANIM = {
  duration: 0.75,
  ease: "power2.out",
};

// 拆分：菜单预览图片组件（使用 memo 避免重渲染）
const MenuPreviewImage = memo(({ activeImgId }: { activeImgId: string }) => {
  return (
    <div
      className="menu-preview-img"
    >
      {menuItems.map((item) => (
        <img
          key={item.id}
          src={item.img.src}
          alt={item.label}
          className={`preview-img ${activeImgId === item.id ? "active" : ""}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: activeImgId === item.id ? 1 : 0,
            transform:
              activeImgId === item.id
                ? "scale(1) rotate(0deg)"
                : "scale(1.25) rotate(10deg)",
            transition: "none", // 禁用 CSS 过渡，交给 GSAP 控制
          }}
        />
      ))}
    </div>
  );
});

// 拆分：菜单项组件
const MenuItem = memo(
  ({
    item,
    onHover,
  }: {
    item: (typeof menuItems)[0];
    onHover: (id: string) => void;
  }) => {
    return (
      <div className="link">
        <a
          href={item.href}
          onMouseOver={() => onHover(item.id)}
          style={{
            transform: "translateY(120%)",
            opacity: 0,
          }}
        >
          {item.label}
        </a>
      </div>
    );
  },
);

// 拆分：社交链接组件
const SocialItem = memo(({ item }: { item: (typeof socialItems)[0] }) => {
  return (
    <div className="social">
      <a
        href={item.href}
        style={{
          transform: "translateY(120%)",
          opacity: 0,
        }}
      >
        {item.label}
      </a>
    </div>
  );
});

export default function Page() {
  // 状态管理
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeImgId, setActiveImgId] = useState(menuItems[0].id); // 用状态管理激活的图片

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef<HTMLParagraphElement>(null);
  const menuCloseRef = useRef<HTMLParagraphElement>(null);

  // 缓存 DOM 查询结果
  const menuItemsRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const socialItemsRef = useRef<NodeListOf<HTMLElement> | null>(null);

  // 使用 GSAP Context 管理动画，自动清理
  useGSAP(
    () => {
      // 初始化时缓存 DOM 元素
      if (containerRef.current) {
        menuItemsRef.current = containerRef.current.querySelectorAll(".link a");
        socialItemsRef.current =
          containerRef.current.querySelectorAll(".social a");
      }

      // 初始隐藏 close 按钮
      if (menuCloseRef.current) {
        gsap.set(menuCloseRef.current, {
          opacity: 0,
          x: 5,
          y: 10,
          rotation: 5,
        });
      }

      // 初始设置菜单内容区样式
      if (menuContentRef.current) {
        gsap.set(menuContentRef.current, {
          x: -100,
          y: -100,
          rotation: -15,
          scale: 1.5,
          opacity: 0.25,
        });
      }
    },
    { scope: containerRef }, // 限定作用域
  );

  // 动画：切换 Open/Close 文本
  const animateToggleMenu = useCallback((isOpening: boolean) => {
    const openBtn = menuOpenRef.current;
    const closeBtn = menuCloseRef.current;
    if (!openBtn || !closeBtn) return;

    // 隐藏当前按钮
    gsap.to(isOpening ? openBtn : closeBtn, {
      x: isOpening ? -5 : 5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      delay: 0.25,
      duration: 0.5,
      ease: "power2.out",
    });

    // 显示目标按钮
    gsap.to(isOpening ? closeBtn : openBtn, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  // 打开菜单（使用 useCallback 缓存）
  const openMenu = useCallback(() => {
    if (isOpen || isAnimating) return;

    setIsAnimating(true);

    // 1. 主内容区动画
    if (pageContainerRef.current) {
      gsap.to(pageContainerRef.current, {
        x: 300,
        y: 450,
        rotation: 10,
        scale: 1.5,
        ...ANIM_CONFIG,
      });
    }

    // 2. 切换按钮动画
    animateToggleMenu(true);

    // 3. 菜单内容区动画
    if (menuContentRef.current) {
      gsap.to(menuContentRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        ...ANIM_CONFIG,
      });
    }

    // 4. 菜单项渐入
    if (menuItemsRef.current && socialItemsRef.current) {
      gsap.to([...menuItemsRef.current, ...socialItemsRef.current], {
        y: "0%",
        opacity: 1,
        ...MENU_ITEM_ANIM,
      });
    }

    // 5. 菜单遮罩层展开
    if (menuOverlayRef.current) {
      gsap.to(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
        ...ANIM_CONFIG,
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
        },
      });
    }
  }, [isOpen, isAnimating, animateToggleMenu]);

  // 关闭菜单（使用 useCallback 缓存）
  const closeMenu = useCallback(() => {
    if (!isOpen || isAnimating) return;

    setIsAnimating(true);

    // 1. 主内容区恢复
    if (pageContainerRef.current) {
      gsap.to(pageContainerRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        ...ANIM_CONFIG,
      });
    }

    // 2. 切换按钮动画
    animateToggleMenu(false);

    // 3. 菜单内容区隐藏
    if (menuContentRef.current) {
      gsap.to(menuContentRef.current, {
        x: -100,
        y: -100,
        rotation: -15,
        scale: 1.5,
        opacity: 0.25,
        ...ANIM_CONFIG,
      });
    }

    // 4. 菜单遮罩层收起
    if (menuOverlayRef.current) {
      gsap.to(menuOverlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ...ANIM_CONFIG,
        onComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
          // 重置菜单项位置
          if (menuItemsRef.current && socialItemsRef.current) {
            gsap.set([...menuItemsRef.current, ...socialItemsRef.current], {
              y: "120%",
            });
          }
          // 重置预览图片
          setActiveImgId(menuItems[0].id);
        },
      });
    }
  }, [isOpen, isAnimating, animateToggleMenu]);

  // 菜单开关总控
  const handleMenuToggle = useCallback(() => {
    if (isAnimating) return;
    isOpen ? closeMenu() : openMenu();
  }, [isOpen, isAnimating, openMenu, closeMenu]);

  // 处理菜单项悬停（优化：使用状态而非直接操作 DOM）
  const handleLinkHover = useCallback(
    (imgId: string) => {
      if (!isOpen || isAnimating || activeImgId === imgId) return;

      setActiveImgId(imgId);

      // 获取当前激活的图片元素，执行动画
      const activeImg = document.querySelector(
        `.preview-img[alt="${menuItems.find((i) => i.id === imgId)?.label}"]`,
      );
      if (activeImg) {
        gsap.to(activeImg, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          ...IMG_ANIM,
        });
      }

      // 隐藏其他图片（可选，优化过渡）
      menuItems.forEach((item) => {
        if (item.id !== imgId) {
          const img = document.querySelector(
            `.preview-img[alt="${item.label}"]`,
          );
          if (img) {
            gsap.to(img, {
              opacity: 0,
              scale: 1.25,
              rotation: 10,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
      });
    },
    [isOpen, isAnimating, activeImgId],
  );

  // 组件卸载时清理动画
  useEffect(() => {
    return () => {
      gsap.killTweensOf("*"); // 清理所有动画
    };
  }, []);

  return (
    <main className="page" ref={containerRef}>
      <nav>
        <div className="logo">
          <a href="">Zheng Xing</a>
        </div>
        <div
          className="menu-toggle"
          onClick={handleMenuToggle}
        >
          <p
            id="menu-open"
            ref={menuOpenRef}
          >
            Open
          </p>
          <p
            id="menu-close"
            ref={menuCloseRef}
          >
            Close
          </p>
        </div>
      </nav>

      <div
        className="menu-overlay"
        ref={menuOverlayRef}
      >
        <div className="menu-content" ref={menuContentRef}>
          <div className="menu-items">
            <div className="col-lg">
              {/* 使用优化后的预览图片组件 */}
              <MenuPreviewImage activeImgId={activeImgId} />
            </div>
            <div className="col-sm">
              <div className="menu-links">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onHover={handleLinkHover}
                  />
                ))}
              </div>
              <div className="menu-socials">
                {socialItems.map((item) => (
                  <SocialItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="menu-footer">
            <div className="col-lg">
              <a href="">Run Project</a>
            </div>
            <div className="col-sm">
              <a href="">Contact</a>
              <a href="">Join Club</a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="page-container"
        ref={pageContainerRef}
      >
        <section className="hero">
          <div className="hero-img">
            <Image src={img5} alt="hero" />
          </div>
          <h1>Lorem ipsum dolor sit amet consectetur.</h1>
        </section>
      </div>
    </main>
  );
}
