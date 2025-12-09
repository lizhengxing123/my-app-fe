"use client";

import React, { useState, useEffect } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import MarkdownRenderer from "@/components/md/md-renderer";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Save } from "lucide-react";
import { useTheme } from "next-themes";
import WritePageSkeleton from "@/components/skeleton/write-skeleton";
import RelatedMenu from "@/components/write/related-menu";

export default () => {
  const [text, setText] = useState(
    `
# md-editor

## 😲 md-editor-rt

Markdown 编辑器，React 版本，使用 jsx 和 typescript 语法开发，支持切换主题、prettier 美化文本等。

### 🤖 基本演示

**加粗**，<u>下划线</u>，_斜体_，~~删除线~~，上标^26^，下标~1~，\`inline code\`，[超链接](https://github.com/imzbf)

> 引用：《I Have a Dream》

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

- [ ] 周五
- [ ] 周六
- [x] 周天

![图片](https://imzbf.github.io/md-editor-v3/imgs/mark_emoji.gif)

## 🤗 代码演示

\`\`\`js
import { defineComponent, ref } from 'vue';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default defineComponent({
  name: 'MdEditor',
  setup() {
    const text = ref('');
    return () => <MdEditor modelValue={text.value} onChange={(v: string) => (text.value = v)} />;
  },
});
\`\`\`

## 🖨 文本演示

依照普朗克长度这项单位，目前可观测的宇宙的直径估计值（直径约 930 亿光年，即 8.8 × 10^26^ 米）即为 5.4 × 10^61^倍普朗克长度。而可观测宇宙体积则为 8.4 × 10^184^立方普朗克长度（普朗克体积）。

## 📈 表格演示

| 表头 1 |  表头 2  | 表头 3 |
| :----- | :------: | -----: |
| 左对齐 | 中间对齐 | 右对齐 |

## 📏 公式

行内：$x+y^{2x}$

$$
\sqrt[3]{x}
$$

## 🧬 图表

mermaid

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

echarts

\`\`\`js
{
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}
\`\`\`

## 🪄 提示

!!! note 支持的类型

note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention

!!!

## ☘️ 占个坑@！

没了
`
  );
  const { theme = "light" } = useTheme();
  const [clientTheme, setClientTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  const [open, setOpen] = useState(false);

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
          <div className="w-1/2 h-full pl-4 border-r h-[80vh] overflow-auto">
            <MarkdownRenderer
              className="w-full"
              content={text}
              showAnchor={false}
            />
            <div className="fixed bottom-0 right-0 w-1/2 py-3 pr-6 border-t flex align-center justify-end space-x-4 bg-background">
              <Button variant="outline">
                <Save />
                保存文章
              </Button>
              <Button onClick={() => setOpen(true)} className="cursor-pointer">
                <BookOpenCheck />
                发布文章
              </Button>
            </div>
          </div>
        </>
      ) : (
        <WritePageSkeleton />
      )}
      <RelatedMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
};
