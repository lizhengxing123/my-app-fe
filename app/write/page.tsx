"use client";

import React, { useState, useEffect } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import MarkdownRenderer from "@/components/md/md-renderer";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Save } from "lucide-react";
import { useTheme } from "next-themes";
import WritePageSkeleton from "@/components/skeleton/write-skeleton";

export default () => {
  const [text, setText] = useState("# Hello Editor");
  const { theme = "light" } = useTheme();
  const [clientTheme, setClientTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  // 只在客户端执行主题相关逻辑
  useEffect(() => {
    setIsMounted(true);
    setClientTheme(theme);
  }, [theme]);

  return (
    <div className="h-full w-full px-6 flex">
      {isMounted ? (
        <>
          <MdEditor
            className={
              isMounted && clientTheme === "dark"
                ? "md-editor-dark"
                : "md-editor"
            }
            style={{ height: "100%", width: "50%" }}
            value={text}
            onChange={setText}
            preview={false}
            showToolbarName
            toolbars={[
              "bold",
              "underline",
              "italic",
              "-",
              "strikeThrough",
              "sub",
              "sup",
              "quote",
              "unorderedList",
              "orderedList",
              "task",
              "-",
              "codeRow",
              "code",
            ]}
            footers={[]}
          />
          <div className="w-1/2 h-full pl-4 relative border-r">
            <MarkdownRenderer
              className="w-full"
              content={text}
              showAnchor={false}
            />
            <div className="absolute bottom-0 right-0 w-full py-3 pr-6 border-t flex align-center justify-end space-x-4">
              <Button variant="outline">
                <Save />
                保存文章
              </Button>
              <Button>
                <BookOpenCheck />
                发布文章
              </Button>
            </div>
          </div>
        </>
      ) : (
        <WritePageSkeleton />
      )}
    </div>
  );
};
