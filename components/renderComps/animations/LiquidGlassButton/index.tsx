"use client";

import CodeBlock from "@/components/common/code-block";
import LiquidGlassButton from "./LiquidGlassButton";

export default function LiquidGlassButtonComp({
  isPreview,
}: {
  isPreview: boolean;
}) {
  return isPreview ? (
    <div className="w-full h-full flex items-center justify-center bg-[#e8e8e8] dark:bg-[#212121]">
      <LiquidGlassButton />
    </div>
  ) : (
    <CodeBlock
      lang="ts"
      title="componets/LiquidGlassButtonComp.tsx"
      content={`<LiquidGlassButton />`}
    />
  );
}
