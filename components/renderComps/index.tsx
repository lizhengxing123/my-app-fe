"use client";
import { createElement, ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

import BlockTextRevealComp from "./animations/BlockTextRevealComp";

// 定义compsMap的类型，确保值是React组件
interface CompsMap {
  [key: string]: React.FC<{ isPreview: boolean }>;
}

const compsMap: CompsMap = {
  BlockTextRevealComp: BlockTextRevealComp,
};

export default function RenderComponent({
  comp,
}: {
  comp: keyof typeof compsMap;
}) {
  const [isPreview, setIsPreview] = useState(true);
  return (
    <>
      <div>
        <div>
          <Button
            variant="outline"
            className={cn(
              "cursor-pointer mr-3",
              isPreview ? "bg-foreground text-background" : "",
            )}
            onClick={() => setIsPreview(true)}
          >
            <Eye /> 预览
          </Button>
          <Button
            variant="outline"
            className={cn(
              "cursor-pointer",
              !isPreview ? "bg-foreground text-background" : "",
            )}
            onClick={() => setIsPreview(false)}
          >
            <Code /> 代码
          </Button>
        </div>
        <div
          className={cn(
            "w-full h-[300px] border rounded-md mt-2 overflow-auto",
            isPreview ? "" : "bg-code-block",
          )}
        >
          {(() => {
            const Component = compsMap[comp];
            return <Component isPreview={isPreview} />;
          })()}
        </div>
      </div>
    </>
  );
}
