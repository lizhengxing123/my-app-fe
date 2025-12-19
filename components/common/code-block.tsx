"use client";

import { BundledLanguage, codeToHtml } from "shiki";
import "@/assets/css/shiki-theme.css";
import { FileCode, Files, Check } from "lucide-react";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { useState, useEffect, Suspense } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardSkeleton } from "@/components/skeleton/card-skeleton";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  lang: BundledLanguage;
  title?: string;
}

function CodeBlock(props: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCodeToHtml = async () => {
    setLoading(true);
    const out = await codeToHtml(props.content, {
      lang: props.lang,
      themes: {
        light: "github-light-high-contrast",
        dark: "nord",
      },
      transformers: [transformerNotationDiff(), transformerNotationHighlight()],
    });
    setLoading(false);
    setOutput(out);
  };

  useEffect(() => {
    handleCodeToHtml();
  }, [props.content, props.lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.content);
      setIsCopied(true);
      // 2秒后重置状态
      //   setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="w-full rounded-md bg-code-block relative my-3">
      {props.title && (
        <div className="text-sm text-foreground/60 border-b pl-3 py-2 flex items-center">
          <FileCode className="w-4 h-4 mr-2" />
          <span>{props.title}</span>
        </div>
      )}
      {/* 在右上角展示粘贴按钮和语言类型 */}
      <span className={cn("absolute text-ring text-sm", props.title ? "right-4 top-9" : "right-11 top-1.5")}>{props.lang}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={handleCopy}
            className="absolute right-4 top-2 cursor-pointer text-foreground/60 hover:text-foreground"
          >
            {isCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Files className="w-4 h-4" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "已复制" : "点击复制"}</p>
        </TooltipContent>
      </Tooltip>
      {loading ? (
        <div className="w-full py-4 flex justify-center items-center">
          <CardSkeleton />
        </div>
      ) : (
        <div className="py-2 overflow-auto" dangerouslySetInnerHTML={{ __html: output }} />
      )}
    </div>
  );
}

export default CodeBlock;
