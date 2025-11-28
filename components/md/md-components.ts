import CodeBlock from "@/components/common/code-block";

// 组件映射表：key 是 MD 中写的组件名，value 是 React 组件
export const componentMap = {
  CodeBlock: CodeBlock,
};

// 导出组件类型（TS 可选）
export type ComponentName = keyof typeof componentMap;
