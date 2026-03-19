"use client";

import styles from "./FlowingLightButton.module.css";
import CodeBlock from "@/components/common/code-block";
import FlowingLightButton from "./FlowingLightButton";
export default function FlowingLightButtonComp({
  isPreview,
}: {
  isPreview: boolean;
}) {
  return isPreview ? (
    <div className="w-full h-full flex items-center justify-center bg-[#e8e8e8] dark:bg-[#212121]">
      <FlowingLightButton>Join Now</FlowingLightButton>
    </div>
  ) : (
    <CodeBlock
      lang="ts"
      title="componets/BlockTextRevealComp.tsx"
      content={`<FlowingLightButton>Join Now</FlowingLightButton>`}
    />
  );
}
