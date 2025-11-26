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

interface Props {
  children: string;
  lang: BundledLanguage;
  title?: string;
}

function CodeBlock(props: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCodeToHtml = async () => {
    setLoading(true);
    const out = await codeToHtml(props.children, {
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
  }, [props.children, props.lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.children);
      setIsCopied(true);
      // 2秒后重置状态
      //   setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="w-full rounded-md bg-code-block relative">
      {props.title && (
        <div className="text-sm text-foreground/60 border-b pl-3 py-2 flex items-center">
          <FileCode className="w-4 h-4 mr-2" />
          <span>{props.title}</span>
        </div>
      )}
      {/* 在右上角展示粘贴按钮和语言类型 */}
      <span className="absolute right-4 top-9 text-ring">{props.lang}</span>
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
        <div className="py-2" dangerouslySetInnerHTML={{ __html: output }} />
      )}
    </div>
  );
}

export default CodeBlock;
