"use client";
import { useRef, useState, useEffect } from "react";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import { ReactLenis } from "lenis/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "@/assets/css/20260125.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Model组件的props类型定义
interface ModelProps {
  modelBaseRotationX: number;
  modelBaseZ: number;
}

// 3D模型组件
function Model({ modelBaseRotationX, modelBaseZ }: ModelProps) {
  const { scene } = useGLTF("/20260125/model.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 计算模型的中心和缩放
  useEffect(() => {
    if (!scene) return;
    
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // 调整模型位置和缩放
    scene.position.sub(center);
    scene.position.y = 0;
    scene.scale.setScalar(1 / maxDim);
  }, [scene]);

  // 处理鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 动画循环
  useFrame((state, delta) => {
    if (!modelRef.current) return;
    
    // 计算目标旋转和位置
    const targetRotationY = mousePosition.x * 0.3; // 左右摆动 - 控制Y轴旋转
    const targetRotationX = mousePosition.y * 0.15 + modelBaseRotationX; // 上下摆动 - 控制X轴旋转
    const targetPositionX = -mousePosition.y * 0.2 * modelBaseRotationX; // 左右位移 - 控制X轴位置
    
    // 平滑过渡动画
    modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.05;
    modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.05;
    modelRef.current.position.x += (targetPositionX - modelRef.current.position.x) * 0.05;
    modelRef.current.position.z += (modelBaseZ - modelRef.current.position.z) * 0.05;
  });

  return <primitive ref={modelRef} object={scene} />;
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const [modelBaseRotationX, setModelBaseRotationX] = useState<number>(0.5);
  const [modelBaseZ, setModelBaseZ] = useState<number>(-1);

  useGSAP(
    () => {
      const footerContainer = footerContainerRef.current;

      ScrollTrigger.create({
        trigger: "footer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const yValue = -35 * (1 - progress);
          gsap.set(footerContainer, { y: `${yValue}%` });

          setModelBaseZ(-1 * (1 - progress));
          setModelBaseRotationX(0.5 * (1 - progress));
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <ReactLenis root />
      <main className="page" ref={containerRef}>
        <section>
          <h1>section 1</h1>
        </section>
        <section>
          <h1>section 2</h1>
        </section>
        <section>
          <h1>section 3</h1>
        </section>

        <footer>
          <div className="footer-container" ref={footerContainerRef}>
            <div id="footer-canvas">
              <Canvas camera={{ position: [0, 0, 0.75], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[1, 1, 0]} intensity={5} />
                <Model 
                  modelBaseRotationX={modelBaseRotationX} 
                  modelBaseZ={modelBaseZ} 
                />
              </Canvas>
            </div>

            <div className="footer-content">
              <div className="footer-row">
                <div className="footer-col">
                  <h2>Lorem ipsum dolor sit amet consectetur.</h2>
                </div>
                <div className="footer-col">
                  <div className="footer-sub-col">
                    <h3>Lorem, ipsum.</h3>
                    <h3>2026</h3>
                  </div>
                  <div className="footer-sub-col">
                    <a href="">Lorem, ipsum.</a>
                    <a href="">dolor sit</a>
                    <a href="">amet consectetur</a>
                    <a href="">dolor sit amet</a>
                  </div>
                </div>
              </div>
              <div className="footer-row">
                <p>Quia, voluptas.</p>
                <p>consectetur adipisicing elit</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// 预加载模型
useGLTF.preload("/20260125/model.glb");