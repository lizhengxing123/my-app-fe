"use client";

import { useCallback, useRef } from "react";

import { useLenis } from "lenis/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

import Image from "next/image";
import logo from "@/assets/20260210/logo.png";
import menuMedia from "@/assets/20260210/menu-media.jpg";

gsap.registerPlugin(SplitText, CustomEase, useGSAP);
CustomEase.create("hop", "0.87, 0, 0.13, 1");

const MENU_LINKS = [
  { label: "Index", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
];

const MENU_TAGS = [
  { label: "Web Animations", href: "/web-animations" },
  { label: "UI/UX Design", href: "/ui-ux-design" },
  { label: "Product Design", href: "/product-design" },
];

const MENU_FOOTER = {
  location: "Lanzhou, China",
  email: "info@example.com",
  phone: "+86 123 456 7890",
};

interface MenuProps {
  isMenuOpen: boolean;
  isAnimating: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
  pageContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function Page({
  isMenuOpen,
  isAnimating,
  setIsMenuOpen,
  setIsAnimating,
  pageContainerRef,
}: MenuProps) {
  const lenis = useLenis();

  const containerRef = useRef<HTMLDivElement>(null);
  const menuToggleBtnRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuOverlayContentRef = useRef<HTMLDivElement>(null);
  const menuMediaWrapperRef = useRef<HTMLDivElement>(null);
  const menuToggleLabelRef = useRef<HTMLParagraphElement>(null);
  const menuHamburgerIconRef = useRef<HTMLDivElement>(null);
  const menuCols = containerRef.current?.querySelectorAll(".menu-col");

  const splitTextByContainer = useRef<SplitText[][]>([]);
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const textContainers = container.querySelectorAll(".menu-col");

      textContainers.forEach((textContainer) => {
        const textElements = textContainer.querySelectorAll("a, p");
        let containerSplits: SplitText[] = [];

        textElements.forEach((textElement) => {
          const splitText = new SplitText(textElement, {
            type: "lines",
            mask: "lines",
            linesClass: "line",
          });
          containerSplits.push(splitText);

          gsap.set(splitText.lines, { y: "-100%" });
        });
        splitTextByContainer.current.push(containerSplits);
      });

      return () => {
        splitTextByContainer.current.forEach((containerSplits) => {
          containerSplits.forEach((splitText) => splitText.revert());
        });
      };
    },
    {
      scope: containerRef,
    },
  );

  const menuOpen = useCallback(() => {
    lenis?.stop(); // 暂停页面滚动

    const tl = gsap.timeline(); // 创建动画时间线

    // 动画序列：按顺序执行多个动画，部分动画并行（< 表示与上一个动画同时开始）
    tl.to(menuToggleLabelRef.current, {
      y: "-110%", // 菜单按钮文字向上移出
      duration: 1,
      ease: "hop",
    })
      .to(
        pageContainerRef.current,
        {
          y: "100svh", // 主内容区向下移出视口（svh 是视口高度单位）
          duration: 1,
          ease: "hop",
        },
        "<", // 与上一个动画同时开始
      )
      .to(
        menuOverlayRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // 菜单遮罩层从顶部展开
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuOverlayContentRef.current,
        {
          yPercent: 0, // 菜单内容区向上移动到可视位置
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuMediaWrapperRef.current,
        {
          opacity: 1, // 菜单图片渐显
          duration: 0.75,
          ease: "power2.out",
          delay: 0.5,
        },
        "<",
      );

    // 文字逐行滑入动画
    splitTextByContainer.current.forEach((containerSplits) => {
      const lines = containerSplits.flatMap((splitText) => splitText.lines);
      tl.to(
        lines,
        {
          y: "0%", // 文字行回到原位置
          duration: 2,
          ease: "hop",
          stagger: -0.075, // 反向交错动画（从下到上）
        },
        -0.15, // 提前 0.15s 开始
      );
    });

    // 切换汉堡图标样式
    menuHamburgerIconRef.current?.classList.add("active");

    // 动画完成后重置状态
    tl.call(() => {
      setIsAnimating(false);
    });
  }, [isAnimating, isMenuOpen]);

  const menuClose = useCallback(() => {
    // 还原汉堡图标样式
    menuHamburgerIconRef.current?.classList.remove("active");

    const tl = gsap.timeline();
    tl.to(pageContainerRef.current, {
      y: "0svh", // 主内容区回到原位置
      duration: 1,
      ease: "hop",
    })
      .to(
        menuOverlayRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", // 菜单遮罩层收缩回顶部
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuOverlayContentRef.current,
        {
          yPercent: -50, // 菜单内容区向下移出
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuToggleLabelRef.current,
        {
          y: "0%", // 菜单按钮文字回到原位置
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuCols!,
        {
          opacity: 0.25, // 菜单文字透明度降低
          duration: 1,
          ease: "hop",
        },
        "<",
      );

    // 动画完成后重置元素状态
    tl.call(() => {
      // 重置文字行位置
      splitTextByContainer.current.forEach((containerSplits) => {
        const lines = containerSplits.flatMap((splitText) => splitText.lines);
        gsap.set(lines, { y: "-110%" });
      });

      // 重置菜单列透明度和图片容器状态
      gsap.set(menuCols!, { opacity: 1 });
      gsap.set(menuMediaWrapperRef.current, { opacity: 0 });

      setIsAnimating(false);
      lenis?.start(); // 恢复页面滚动
    });
  }, [isAnimating, isMenuOpen]);

  const handleMenuToggle = useCallback(() => {
    if (isAnimating) return;

    if (!isMenuOpen) {
      setIsAnimating(true);
      menuOpen();
      setIsMenuOpen(true);
    } else {
      setIsAnimating(true);
      menuClose();
      setIsMenuOpen(false);
    }
  }, [isAnimating, isMenuOpen]);

  return (
    <>
      <nav ref={containerRef}>
        <div className="menu-bar">
          <div className="menu-logo">
            <a href="">
              <Image src={logo} alt="logo" />
            </a>
          </div>
          <div
            className="menu-toggle-btn"
            ref={menuToggleBtnRef}
            onClick={() => handleMenuToggle()}
          >
            <div className="menu-toggle-label">
              <p ref={menuToggleLabelRef}>Menu</p>
            </div>
            <div className="menu-hamburger-icon" ref={menuHamburgerIconRef}>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="menu-overlay" ref={menuOverlayRef}>
          <div className="menu-overlay-content" ref={menuOverlayContentRef}>
            <div className="menu-media-wrapper" ref={menuMediaWrapperRef}>
              <Image src={menuMedia} alt="menu-media" />
            </div>
            <div className="menu-content-wrapper">
              <div className="menu-content-main">
                <div className="menu-col">
                  {MENU_LINKS.map((link) => (
                    <div className="menu-link" key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </div>
                  ))}
                </div>
                <div className="menu-col">
                  {MENU_TAGS.map((tag) => (
                    <div className="menu-tag" key={tag.href}>
                      <a href={tag.href}>{tag.label}</a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="menu-footer">
                <div className="menu-col">
                  <p>{MENU_FOOTER.location}</p>
                </div>
                <div className="menu-col">
                  <p>{MENU_FOOTER.email}</p>
                  <p>{MENU_FOOTER.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
