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

export const images = [
  { src: img1.src, alt: "春日花海" },
  { src: img2.src, alt: "山间溪流" },
  { src: img3.src, alt: "城市夜景" },
  { src: img4.src, alt: "海边日落" },
  { src: img5.src, alt: "森林晨雾" },
  { src: img6.src, alt: "雪山之巅" },
  { src: img7.src, alt: "沙漠星空" },
  { src: img8.src, alt: "古镇小巷" },
  { src: img9.src, alt: "草原骏马" },
  { src: img10.src, alt: "湖泊倒影" },
];;

export const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    void main() {
        vUv = uv;
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
`;

export const fragmentShader = `
    uniform sampler2D uMap;
    uniform vec3 uCameraPosition;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    void main() {
        vec4 tex = texture2D(uMap, vUv);
        vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
        float facing = max(dot(-normalize(vWorldNormal), viewDir), 0.0);
        float falloff = smoothstep(-0.2, 0.5, facing) * 0.45 + 0.42;
        vec3 color = mix(vec3(1.0), tex.rgb * falloff, 0.975) * 1.25;
        gl_FragColor = vec4(color, tex.a);
    }
`;

export const CONFIG = {
  totalImages: 10, // 图片总数
  tilesPerRevolution: 15, // 每圈瓦片数
  revolutions: 5, // 总圈数
  startRadius: 5, // 螺旋起始半径
  endRadius: 3.5, // 螺旋结束半径
  tileHeightRatio: 1.12, // 瓦片高度比例
  tileSegments: 24, // 瓦片分段数（越高越平滑）
  spiralGap: 0.35, // 螺旋间隙
  tileOverlap: 0.005, // 瓦片重叠度
  cameraZ: 12, // 相机Z轴初始位置
  cameraSmoothing: 0.075, // 相机移动平滑度
  baseRotationSpeed: 0.0004, // 基础旋转速度
  scrollRotationMultiplier: 0.0035, // 滚动旋转乘数
  rotationDecay: 0.9, // 旋转衰减率
  scrollMultiplier: 1.25, // 滚动乘数
  cameraYMultiplier: 0.2, // 相机Y轴移动乘数
  parallaxStrength: 0.1, // 鼠标视差强度
};