"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";
import { ReactLenis, useLenis } from "lenis/react";
import { vertexShader, fragmentShader, CONFIG, images } from "./data";
import "@/assets/css/20260323.css";

const MOBILE_BREAKPOINT = 1000;
// 新增：悬浮动画配置
const HOVER_CONFIG = {
  highlightingDistance: 0.4, // 图片向前突出的距离
  animationSpeed: 0.15, // 动画平滑度
  raycasterPrecision: 1, // 射线检测像素精度
};

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  // 新增：存储当前悬浮的图片索引和名称
  const [hoveredImage, setHoveredImage] = useState<{
    index: number;
    name: string;
  } | null>(null);
  // 新增：射线检测相关ref
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const stateRef = useRef({
    scrollY: 0,
    spinVelocity: 0,
    mouseX: 0,
    mouseY: 0,
    smoothX: 0,
    smoothY: 0,
    isMobile: false,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    spiral: null as THREE.Group | null,
    textureLoader: null as THREE.TextureLoader | null,
    textures: [] as THREE.Texture[],
    animationId: 0,
    // 新增：存储所有图片mesh和原始位置
    imageMeshes: [] as {
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      imageIndex: number;
    }[],
    hoveredMesh: null as THREE.Mesh | null,
  });

  const calculateTileEdgesY = useCallback((totalTiles: number) => {
    const tileEdgesY = [0];
    for (let i = 0; i < totalTiles; i++) {
      const progress = i / totalTiles;
      const radius =
        CONFIG.startRadius + (CONFIG.endRadius - CONFIG.startRadius) * progress;
      const arcWidth = (2 * Math.PI * radius) / CONFIG.tilesPerRevolution;
      const tileHeight = arcWidth * CONFIG.tileHeightRatio;
      tileEdgesY.push(
        tileEdgesY[i] -
          (tileHeight + CONFIG.spiralGap) / CONFIG.tilesPerRevolution,
      );
    }
    return tileEdgesY;
  }, []);

  // 新增：处理鼠标悬浮检测
  const handleMouseHover = useCallback((clientX: number, clientY: number) => {
    const state = stateRef.current;
    if (!state.camera || !state.scene || state.isMobile) {
      setHoveredImage(null);
      state.hoveredMesh = null;
      return;
    }

    // 1. 更新鼠标坐标（转换为Three.js坐标系）
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // 2. 射线检测相交的图片mesh
    raycasterRef.current.setFromCamera(mouseRef.current, state.camera);
    const intersects = raycasterRef.current.intersectObjects(
      state.imageMeshes.map((item) => item.mesh),
      false,
    );

    // 3. 处理悬浮状态
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const mesh = intersect.object as THREE.Mesh;
      // 找到对应的图片信息
      const imageItem = state.imageMeshes.find((item) => item.mesh === mesh);
      if (imageItem) {
        state.hoveredMesh = mesh;
        const imageIndex = imageItem.imageIndex % CONFIG.totalImages;
        setHoveredImage({
          index: imageIndex,
          name: images[imageIndex].alt || `Image ${imageIndex + 1}`,
        });
      }
    } else {
      state.hoveredMesh = null;
      setHoveredImage(null);
    }
  }, []);

  const initScene = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      hero.clientWidth / hero.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = stateRef.current.isMobile ? 15 : CONFIG.cameraZ;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(hero.clientWidth, hero.clientHeight);
    hero.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const textures = Array.from({ length: CONFIG.totalImages }, (_, i) => {
      return textureLoader.load(
        images[i].src,
        (t) => {
          t.minFilter = THREE.LinearMipmapLinearFilter;
          t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        },
        undefined,
        (err) => console.error(`加载纹理${i}失败:`, err),
      );
    });

    const totalTiles = Math.floor(
      CONFIG.tilesPerRevolution * CONFIG.revolutions,
    );
    const angleStep = (2 * Math.PI) / CONFIG.tilesPerRevolution;
    const tileEdgesY = calculateTileEdgesY(totalTiles);
    const spiral = new THREE.Group();
    const cameraPositionUniform = {
      value: new THREE.Vector3(0, 0, CONFIG.cameraZ),
    };

    // 清空原有mesh列表
    stateRef.current.imageMeshes = [];

    for (let i = 0; i < totalTiles; i++) {
      const progress = i / totalTiles;
      const radius =
        CONFIG.startRadius + (CONFIG.endRadius - CONFIG.startRadius) * progress;
      const arcWidth = (2 * Math.PI * radius) / CONFIG.tilesPerRevolution;
      const tileHeight = arcWidth * CONFIG.tileHeightRatio;
      const tileAngle = arcWidth / radius + CONFIG.tileOverlap;
      const centerY = (tileEdgesY[i] + tileEdgesY[i + 1]) / 2;
      const slope = tileEdgesY[i + 1] - tileEdgesY[i];

      const positions: number[] = [];
      const uvCoords: number[] = [];
      const indices: number[] = [];
      const segments = CONFIG.tileSegments;

      for (let row = 0; row <= 1; row++) {
        for (let col = 0; col <= segments; col++) {
          const angle = (col / segments - 0.5) * tileAngle;
          positions.push(
            Math.sin(angle) * radius,
            (row - 0.5) * tileHeight + (col / segments - 0.5) * slope,
            Math.cos(angle) * radius,
          );
          uvCoords.push(col / segments, row);
        }
      }

      for (let col = 0; col < segments; col++) {
        const current = col;
        const below = col + segments + 1;
        indices.push(
          current,
          below,
          current + 1,
          below,
          below + 1,
          current + 1,
        );
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      geometry.setAttribute(
        "uv",
        new THREE.Float32BufferAttribute(uvCoords, 2),
      );
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMap: { value: textures[i % CONFIG.totalImages] },
          uCameraPosition: cameraPositionUniform,
        },
        side: THREE.DoubleSide,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = centerY;
      // 存储原始位置（用于悬浮动画还原）
      const originalPosition = new THREE.Vector3().copy(mesh.position);

      const tileGroup = new THREE.Group();
      tileGroup.rotation.y = i * angleStep;
      tileGroup.add(mesh);
      spiral.add(tileGroup);

      // 新增：将mesh和原始位置存入列表
      stateRef.current.imageMeshes.push({
        mesh,
        originalPosition,
        imageIndex: i,
      });
    }

    scene.add(spiral);

    stateRef.current = {
      ...stateRef.current,
      scene,
      camera,
      renderer,
      spiral,
      textureLoader,
      textures,
      imageMeshes: stateRef.current.imageMeshes,
    };

    const animate = () => {
      const state = stateRef.current;
      if (!state.camera || !state.renderer || !state.scene || !state.spiral)
        return;

      const progress = Math.min(
        Math.max(
          state.scrollY / (window.innerHeight * CONFIG.scrollMultiplier),
          0,
        ),
        1,
      );
      const spiralHeight = Math.abs(tileEdgesY[totalTiles]);

      state.camera.position.y +=
        (-(progress * spiralHeight * CONFIG.cameraYMultiplier) -
          state.camera.position.y) *
        CONFIG.cameraSmoothing;

      if (!state.isMobile) {
        state.smoothX += (state.mouseX - state.smoothX) * 0.02;
        state.smoothY += (state.mouseY - state.smoothY) * 0.02;
        state.spiral.rotation.x = state.smoothY * CONFIG.parallaxStrength;
        state.spiral.rotation.z =
          -state.smoothX * CONFIG.parallaxStrength * 0.3;

        // 新增：悬浮突出动画逻辑
        state.imageMeshes.forEach((item) => {
          const targetPosition = new THREE.Vector3().copy(
            item.originalPosition,
          );
          // 如果是当前悬浮的mesh，向前移动
          if (state.hoveredMesh === item.mesh) {
            // 计算向前的方向（朝向相机）
            const direction = new THREE.Vector3()
              .subVectors(state.camera!.position, item.mesh.position)
              .normalize();
            targetPosition.add(direction.multiplyScalar(HOVER_CONFIG.highlightingDistance));
          }
          // 平滑过渡到目标位置
          item.mesh.position.lerp(targetPosition, HOVER_CONFIG.animationSpeed);
        });
      } else {
        state.spiral.rotation.x = 0;
        state.spiral.rotation.z = 0;
      }

      cameraPositionUniform.value.copy(state.camera.position);
      state.spiral.rotation.y += CONFIG.baseRotationSpeed + state.spinVelocity;
      state.spinVelocity *= CONFIG.rotationDecay;

      state.renderer.render(state.scene, state.camera);
      state.animationId = requestAnimationFrame(animate);
    };

    animate();
  }, [calculateTileEdgesY]);

  const disposeScene = useCallback(() => {
    const { scene, renderer, spiral, textures, animationId, imageMeshes } =
      stateRef.current;
    if (animationId) cancelAnimationFrame(animationId);

    // 销毁mesh资源
    imageMeshes.forEach((item) => {
      item.mesh.geometry.dispose();
      (item.mesh.material as THREE.ShaderMaterial).dispose();
    });

    spiral?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        (obj.material as THREE.ShaderMaterial).dispose();
      }
    });

    textures.forEach((tex) => tex.dispose());
    renderer?.dispose();
    scene?.clear();

    const hero = heroRef.current;
    if (hero && renderer?.domElement) {
      hero.removeChild(renderer.domElement);
    }

    stateRef.current = {
      ...stateRef.current,
      scene: null,
      camera: null,
      renderer: null,
      spiral: null,
      textures: [],
      animationId: 0,
      imageMeshes: [],
      hoveredMesh: null,
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const handleScroll = (e: { velocity: number }) => {
      stateRef.current.scrollY = window.pageYOffset;
      stateRef.current.spinVelocity =
        e.velocity * CONFIG.scrollRotationMultiplier;
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  // 修改：合并鼠标移动和悬浮检测
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = stateRef.current;
      state.mouseX = Math.max(
        -1,
        Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2),
      );
      state.mouseY = Math.max(
        -1,
        Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2),
      );
      // 执行悬浮检测
      handleMouseHover(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseHover]);

  // 新增：处理鼠标离开画布
  useEffect(() => {
    const handleMouseLeave = () => {
      stateRef.current.hoveredMesh = null;
      setHoveredImage(null);
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mouseleave", handleMouseLeave);
      return () => hero.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, []);

  useEffect(() => {
    stateRef.current.isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    const handleResize = () => {
      const state = stateRef.current;
      const hero = heroRef.current;
      if (!hero || !state.camera || !state.renderer) return;

      state.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      state.camera.aspect = hero.clientWidth / hero.clientHeight;
      state.camera.position.z = state.isMobile ? 15 : CONFIG.cameraZ;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(hero.clientWidth, hero.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    initScene();
    return () => disposeScene();
  }, [initScene, disposeScene]);

  return (
    <>
      <ReactLenis root />
      <main className="page">
        <section className="hero" ref={heroRef}>
          <h1>
            Hello Three.js.This is a Spiral Gallery of a 3D scene built with
            Three.js.
          </h1>
          {/* 新增：图片名称显示标签 */}
          {hoveredImage && (
            <div className="image-name-tag">{hoveredImage.name}</div>
          )}
        </section>
        <section className="about">
          <h3>Three.js is powerful.</h3>
        </section>
      </main>
    </>
  );
}
