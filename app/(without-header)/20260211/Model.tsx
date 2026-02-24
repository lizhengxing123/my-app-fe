import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ====================== 1. 完整配置接口 & 配置对象 ======================
interface Config {
  // 基础配置
  canvasBg: string;
  modelPath: string;
  metalness: number;
  roughness: number;
  // 灯光配置（主光/补光/轮廓光/顶光）
  keyIntensity: number;
  keyPosX: number;
  keyPosY: number;
  keyPosZ: number;
  fillIntensity: number;
  fillPosX: number;
  fillPosY: number;
  fillPosZ: number;
  rimIntensity: number;
  rimPosX: number;
  rimPosY: number;
  rimPosZ: number;
  topIntensity: number;
  topPosX: number;
  topPosY: number;
  topPosZ: number;
  // 模型位置/旋转/缩放
  baseCamPosX: number;
  baseCamPosY: number;
  baseCamPosZ: number;
  baseRotationX: number;
  baseRotationY: number;
  baseRotationZ: number;
  baseZoom: number;
  // 鼠标视差配置
  parallaxSensitivityX: number;
  parallaxSensitivityY: number;
  // 光标点光源配置
  cursorLightColor: number;
  cursorLightIntensity: number;
  cursorLightDistance: number;
  cursorLightDecay: number;
  cursorLightPosZ: number;
  cursorLightEnabled: boolean;
  cursorLightScale: number;
  cursorLightSmoothness: number;
}

// 初始化配置（可根据需求调整）
export const config: Config = {
  // 基础
  canvasBg: "#000",
  modelPath: "/20260211/model.glb", // 替换为你的模型路径
  metalness: 0.55,
  roughness: 0.75,
  // 灯光
  keyIntensity: 0.5,
  keyPosX: 2.5,
  keyPosY: 10,
  keyPosZ: 10,
  fillIntensity: 1.5,
  fillPosX: -5,
  fillPosY: 2.5,
  fillPosZ: -2.5,
  rimIntensity: 2.5,
  rimPosX: -7.5,
  rimPosY: 5,
  rimPosZ: -10,
  topIntensity: 0.5,
  topPosX: 0,
  topPosY: 15,
  topPosZ: 0,
  // 模型位置/旋转/缩放
  //   baseCamPosX: window.innerWidth < 1000 ? 0 : -0.75,
  baseCamPosX: -0.8,
  baseCamPosY: -1.3,
  baseCamPosZ: 0,
  baseRotationX: 0,
  baseRotationY: 0,
  baseRotationZ: 0,
  baseZoom: 0.35,
  // 鼠标视差
  parallaxSensitivityX: 0.5,
  parallaxSensitivityY: 0.5,
  // 光标点光源
  cursorLightColor: 0xffffff,
  cursorLightIntensity: 1.5,
  cursorLightDistance: 50,
  cursorLightDecay: 2,
  cursorLightPosZ: 5,
  cursorLightEnabled: true,
  cursorLightScale: 5,
  cursorLightSmoothness: 0.1,
};

// ====================== 2. 渲染器配置组件 ======================
function RendererConfig() {
  const { gl } = useThree();
  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    // @ts-ignore
    // gl.outputEncoding = THREE.sRGBEncoding;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
  }, [gl]);
  return null;
}

// ====================== 3. 灯光组件 ======================
// 主光
function KeyLight() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    if (keyLightRef.current) {
      const light = keyLightRef.current;
      light.castShadow = true;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 100;
      light.shadow.bias = -0.00005;
      light.shadow.normalBias = 0.05;
    }
  }, []);
  return (
    <directionalLight
      ref={keyLightRef}
      color={0xffffff}
      intensity={config.keyIntensity}
      position={[config.keyPosX, config.keyPosY, config.keyPosZ]}
    />
  );
}

// 补光
function FillLight() {
  return (
    <directionalLight
      color={0xffffff}
      intensity={config.fillIntensity}
      position={[config.fillPosX, config.fillPosY, config.fillPosZ]}
    />
  );
}

// 轮廓光
function RimLight() {
  return (
    <directionalLight
      color={0xffffff}
      intensity={config.rimIntensity}
      position={[config.rimPosX, config.rimPosY, config.rimPosZ]}
    />
  );
}

// 顶光
function TopLight() {
  return (
    <directionalLight
      color={0xffffff}
      intensity={config.topIntensity}
      position={[config.topPosX, config.topPosY, config.topPosZ]}
    />
  );
}

// 光标跟随点光源
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  // 存储灯光目标位置（响应式）
  const [cursorTarget, setCursorTarget] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 监听鼠标移动，计算目标位置
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // 归一化鼠标坐标 (-1 ~ 1)
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      // 计算灯光目标位置
      setCursorTarget({
        x: mouseX * config.cursorLightScale,
        y: mouseY * config.cursorLightScale,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 每帧平滑更新灯光位置（替代原生animate中的逻辑）
  useFrame(() => {
    if (lightRef.current && config.cursorLightEnabled) {
      const light = lightRef.current;
      // 平滑插值
      light.position.x +=
        (cursorTarget.x - light.position.x) * config.cursorLightSmoothness;
      light.position.y +=
        (cursorTarget.y - light.position.y) * config.cursorLightSmoothness;
    }
  });

  return (
    <>
      {/* 点光源本身 */}
      <pointLight
        ref={lightRef}
        color={config.cursorLightColor}
        intensity={config.cursorLightIntensity}
        distance={config.cursorLightDistance}
        decay={config.cursorLightDecay}
        position={[0, 0, config.cursorLightPosZ]}
        visible={config.cursorLightEnabled}
      />
    </>
  );
}

// ====================== 4. 核心模型组件（含鼠标视差旋转） ======================
function GLTFModel() {
  const { scene: gltfScene } = useGLTF(config.modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  // 模型中心/尺寸缓存
  const modelCenterRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const modelSizeRef = useRef<THREE.Vector3>(new THREE.Vector3());
  // 响应式baseCamPosX
  const [baseCamPosX, setBaseCamPosX] = useState<number>(
    window.innerWidth < 1000 ? 0 : -0.75,
  );
  // 鼠标视差相关状态
  const [mouseState, setMouseState] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [rotationState, setRotationState] = useState<{
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
  }>({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  });

  // 1. 初始化模型（材质/阴影/包围盒/相机）
  useEffect(() => {
    if (modelRef.current) {
      const model = modelRef.current;
      const center = new THREE.Vector3();

      // 遍历设置材质/阴影
      model.traverse((node: THREE.Object3D) => {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.material instanceof THREE.MeshStandardMaterial) {
            node.material.metalness = config.metalness;
            node.material.roughness = config.roughness;
            node.material.needsUpdate = true;
          }
        }
      });

      // 计算包围盒并缓存
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      modelCenterRef.current = box.getCenter(center);
      modelSizeRef.current = size;

      // 设置模型初始位置
      model.position.set(
        // -center.x + baseCamPosX,
        // -center.y + config.baseCamPosY,
        -center.x,
        -center.y - 1.1,
        -center.z + config.baseCamPosZ,
      );
      model.rotation.set(
        config.baseRotationX,
        config.baseRotationY,
        config.baseRotationZ,
      );

      // 设置相机初始位置
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.z = maxDim * config.baseZoom;
      camera.lookAt(0, 0, 0);
    }
  }, [camera, baseCamPosX]);

  // 2. 窗口resize监听
  useEffect(() => {
    const handleResize = () => {
      // 更新相机
      // @ts-ignore
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      // 更新渲染器
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // 更新baseCamPosX
      const newBaseCamPosX = window.innerWidth < 1000 ? 0 : -0.75;
      setBaseCamPosX(newBaseCamPosX);
      // 更新模型位置
      if (modelRef.current && modelCenterRef.current) {
        const model = modelRef.current;
        const center = modelCenterRef.current;
        model.position.set(
          // -center.x + baseCamPosX,
          // -center.y + config.baseCamPosY,
          -center.x,
          -center.y - 1.2,
          -center.z + config.baseCamPosZ,
        );
        // 更新相机Z轴
        const maxDim = Math.max(
          modelSizeRef.current.x,
          modelSizeRef.current.y,
          modelSizeRef.current.z,
        );
        camera.position.z = maxDim * config.baseZoom;
        camera.lookAt(0, 0, 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, gl]);

  // 3. 监听鼠标移动，更新鼠标坐标（用于视差）
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouseState({ x, y });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 4. 每帧更新模型视差旋转（核心动画逻辑）
  useFrame(() => {
    if (modelRef.current) {
      const model = modelRef.current;
      // 计算目标旋转
      const targetY = mouseState.x * config.parallaxSensitivityX;
      const targetX = -mouseState.y * config.parallaxSensitivityY;
      // 平滑插值更新当前旋转
      setRotationState((prev) => ({
        ...prev,
        targetX,
        targetY,
        currentX: prev.currentX + (targetX - prev.currentX) * 0.05,
        currentY: prev.currentY + (targetY - prev.currentY) * 0.05,
      }));
      // 应用旋转到模型
      model.rotation.x = config.baseRotationX + rotationState.currentX;
      model.rotation.y = config.baseRotationY + rotationState.currentY;
      model.rotation.z = config.baseRotationZ;
    }
  });

  return <primitive object={gltfScene} ref={modelRef} />;
}

// ====================== 5. 主组件 ======================
function Model() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}
      camera={{ fov: 60, near: 0.1, far: 1000 }}
      gl={{ antialias: true }}
    >
      {/* 背景色 */}
      <color attach="background" args={[config.canvasBg]} />
      {/* 渲染器配置 */}
      <RendererConfig />
      {/* 所有灯光 */}
      <KeyLight />
      <FillLight />
      <RimLight />
      <TopLight />
      <CursorLight />
      {/* 模型 */}
      <GLTFModel />
    </Canvas>
  );
}

// 预加载模型
useGLTF.preload(config.modelPath);

export default Model;
