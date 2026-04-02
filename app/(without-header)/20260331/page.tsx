"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";

import img1 from "@/assets/20260128/1.jpg";
import img2 from "@/assets/20260128/2.jpg";
import img3 from "@/assets/20260128/3.jpg";
import img4 from "@/assets/20260128/4.jpg";
import img5 from "@/assets/20260128/5.jpg";

import "@/assets/css/20260331.css";

const products = [
  {
    name: "Mei Gui",
    image: img1,
    price: 120,
    tag: "MeiGui",
    url: "#",
  },
  {
    name: "He Hua",
    image: img2,
    price: 210,
    tag: "HeHua",
    url: "#",
  },
  {
    name: "Yu Lan",
    image: img3,
    price: 340,
    tag: "YuLan",
    url: "#",
  },
  {
    name: "Zhi Zi",
    image: img4,
    price: 570,
    tag: "ZhiZi",
    url: "#",
  },
  {
    name: "San Jiao Mei",
    image: img5,
    price: 680,
    tag: "SanJiaoMei",
    url: "#",
  },
];
export default function Page() {
  const productsContainerRef = useRef<HTMLUListElement>(null);
  const productNameRef = useRef<HTMLDivElement>(null);
  const productPreviewRef = useRef<HTMLDivElement>(null);
  const previewNameRef = useRef<HTMLDivElement>(null);
  const previewTagRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const productUrlRef = useRef<HTMLAnchorElement>(null);
  const productBannerRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);
  const controllerInnerRef = useRef<HTMLDivElement>(null);
  const controllerOuterRef = useRef<HTMLDivElement>(null);
  const closeIconSpansRef = useRef<HTMLSpanElement[]>([]);
  const slideItemsRef = useRef<
    { element: HTMLLIElement; relativeIndex: number }[]
  >([]);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isPreviewAnimating, setIsPreviewAnimating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const BUFFER_SIZE = 5;
  const spacing = 0.375;
  const sideWidth = spacing * 1000;

  const addSlideItem = (relativeIndex: number) => {
    const productIndex =
      (((currentProductIndex + relativeIndex) % products.length) +
        products.length) %
      products.length;
    const product = products[productIndex];

    const li = document.createElement("li");
    li.dataset.relativeIndex = relativeIndex.toString();
    li.innerHTML = `<img src="${product.image.src}" alt="${product.name}" />`;

    gsap.set(li, {
      x: sideWidth * relativeIndex,
      scale: relativeIndex === 0 ? 1.25 : 0.75,
      zIndex: relativeIndex === 0 ? 100 : 1,
    });

    productsContainerRef.current?.appendChild(li);
    slideItemsRef.current.push({ element: li, relativeIndex });
  };

  const removeSlideItems = (relativeIndex: number) => {
    const item = slideItemsRef.current.find(
      (item) => item.relativeIndex === relativeIndex,
    );
    if (item) {
      item.element.remove();
      slideItemsRef.current = slideItemsRef.current.filter(
        (item) => item.relativeIndex !== relativeIndex,
      );
    }
  };

  const updateSliderPosition = () => {
    slideItemsRef.current.forEach((item) => {
      const isActive = item.relativeIndex === 0;
      gsap.to(item.element, {
        x: sideWidth * item.relativeIndex,
        scale: isActive ? 1.25 : 0.75,
        zIndex: isActive ? 100 : 1,
        duration: 0.75,
        ease: "power3.out",
      });
    });
  };

  const updateProductName = () => {
    const actualIndex =
      ((currentProductIndex % products.length) + products.length) %
      products.length;
    productNameRef.current!.textContent = products[actualIndex].name;
  };

  const updatePreviewContent = () => {
    const actualIndex =
      ((currentProductIndex % products.length) + products.length) %
      products.length;
    const currentProduct = products[actualIndex];
    previewNameRef.current!.textContent = currentProduct.name;
    previewTagRef.current!.textContent = currentProduct.tag;
    previewImgRef.current!.src = currentProduct.image.src;
    previewImgRef.current!.alt = currentProduct.name;
    productUrlRef.current!.href = currentProduct.url;
    bannerImgRef.current!.src = currentProduct.image.src;
    bannerImgRef.current!.alt = currentProduct.name;
  };

  const moveNext = () => {
    if (isPreviewAnimating || isPreviewOpen) return;
    setCurrentProductIndex(currentProductIndex + 1);
    removeSlideItems(-BUFFER_SIZE);
    slideItemsRef.current.forEach((item) => {
      item.relativeIndex--;
      item.element.dataset.relativeIndex = item.relativeIndex.toString();
    });
    addSlideItem(BUFFER_SIZE);
    updateSliderPosition();
    updateProductName();
    updatePreviewContent();
  };

  const movePrev = () => {
    if (isPreviewAnimating || isPreviewOpen) return;
    setCurrentProductIndex(currentProductIndex - 1);
    removeSlideItems(BUFFER_SIZE);
    slideItemsRef.current.forEach((item) => {
      item.relativeIndex++;
      item.element.dataset.relativeIndex = item.relativeIndex.toString();
    });
    addSlideItem(-BUFFER_SIZE);
    updateSliderPosition();
    updateProductName();
    updatePreviewContent();
  };

  const getActiveSlide = () => {
    return slideItemsRef.current.find((item) => item.relativeIndex === 0);
  };

  const animateSlideItems = (hide: boolean = false) => {
    const activeSlide = getActiveSlide();

    slideItemsRef.current.forEach((item) => {
      const absIndex = Math.abs(item.relativeIndex);
      if (absIndex === 1 || absIndex === 2) {
        gsap.to(item.element, {
          x: hide
            ? sideWidth * item.relativeIndex * 1.5
            : sideWidth * item.relativeIndex,
          opacity: hide ? 0 : 1,
          duration: 0.75,
          ease: "power3.inOut",
        });
      }
    });

    if (activeSlide) {
      gsap.to(activeSlide.element, {
        scale: hide ? 0.75 : 1.25,
        opacity: hide ? 0 : 1,
        duration: 0.75,
        ease: "power3.inOut",
      });
    }
  };

  const animateControllerTransition = (opening: boolean = false) => {
    const navEls = [".controller-label p", ".nav-btn"];

    gsap.to(navEls, {
      opacity: opening ? 0 : 1,
      duration: 0.2,
      ease: "power3.inOut",
      delay: opening ? 0 : 0.4,
    });

    gsap.to(controllerOuterRef.current, {
      clipPath: opening ? "circle(0% at 50% 50%)" : "circle(50% at 50% 50%)",
      duration: 0.75,
      ease: "power3.inOut",
    });

    gsap.to(controllerInnerRef.current, {
      clipPath: opening ? "circle(50% at 50% 50%)" : "circle(40% at 50% 50%)",
      duration: 0.75,
      ease: "power3.inOut",
    });

    gsap.to(closeIconSpansRef.current, {
      width: opening ? "20px" : "0px",
      duration: opening ? 0.4 : 0.3,
      ease: opening ? "power3.out" : "power3.in",
      stagger: opening ? 0.1 : 0.05,
      delay: opening ? 0.2 : 0,
    });
  };

  const togglePreview = () => {
    if (isPreviewAnimating) return;
    setIsPreviewAnimating(true);
    if (!isPreviewOpen) updatePreviewContent();

    gsap.to(productPreviewRef.current, {
      y: isPreviewOpen ? "100%" : "-50%",
      duration: 0.75,
      ease: "power3.inOut",
    });

    gsap.to(productBannerRef.current, {
      opacity: isPreviewOpen ? 0 : 1,
      duration: 0.4,
      ease: "power3.inOut",
      delay: isPreviewOpen ? 0 : 0.25,
    });

    animateSlideItems(!isPreviewOpen);
    animateControllerTransition(!isPreviewOpen);

    setTimeout(() => {
      setIsPreviewAnimating(false);
      setIsPreviewOpen(!isPreviewOpen);
    }, 600);
  };

  const initializeSlider = () => {
    for (let i = -BUFFER_SIZE; i <= BUFFER_SIZE; i++) {
      addSlideItem(i);
    }

    updateSliderPosition();
    updateProductName();
    updatePreviewContent();
  };

  useEffect(() => {
    initializeSlider();
  }, []);

  return (
    <>
      <main className="page">
        <nav>
          <div className="logo">
            <p>Zheng Xing</p>
          </div>
          <div className="product-name">
            <p ref={productNameRef}>name</p>
          </div>
        </nav>

        <div className="gallery">
          <ul className="products" ref={productsContainerRef}></ul>

          <div className="controller">
            <div
              className="controller-inner"
              ref={controllerInnerRef}
              onClick={togglePreview}
            >
              <div className="close-icon">
                <span
                  ref={(el) => {
                    closeIconSpansRef.current[0] = el!;
                  }}
                ></span>
                <span
                  ref={(el) => {
                    closeIconSpansRef.current[1] = el!;
                  }}
                ></span>
              </div>
            </div>
            <div className="controller-outer" ref={controllerOuterRef}>
              <div className="controller-label">
                <p>Menu</p>
              </div>
              <div
                className={cn(
                  "nav-btn",
                  "prev",
                  isPreviewAnimating || isPreviewOpen ? "disabled" : "",
                )}
                onClick={movePrev}
              >
                <ChevronsLeft />
              </div>
              <div
                className={cn(
                  "nav-btn",
                  "next",
                  isPreviewAnimating || isPreviewOpen ? "disabled" : "",
                )}
                onClick={moveNext}
              >
                <ChevronsRight />
              </div>
            </div>
          </div>
        </div>
        <div className="product-banner" ref={productBannerRef}>
          <img src={img1.src} alt="name" ref={bannerImgRef} />
        </div>

        <div className="product-preview" ref={productPreviewRef}>
          <div className="product-preview-info">
            <div className="product-preview-name">
              <p ref={previewNameRef}>name</p>
            </div>
            <div className="product-preview-tag">
              <p ref={previewTagRef}>tag</p>
            </div>
          </div>
          <div className="product-preview-img">
            <img src={img1.src} alt="name" ref={previewImgRef} />
          </div>
          <div className="product-url">
            <div className="btn">
              <a href="#" target="_blank" ref={productUrlRef}>
                View Details
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}