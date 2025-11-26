import { BundledLanguage, codeToHtml } from "shiki";
import "@/assets/css/shiki-theme.css";
import { FileCode, Files } from "lucide-react";
import { transformerNotationDiff, transformerNotationHighlight } from "@shikijs/transformers";

interface Props {
  children: string;
  lang: BundledLanguage;
  title?: string;
}

async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    themes: {
      light: "github-light-high-contrast",
      dark: "nord",
    },
    transformers: [
      transformerNotationDiff(),
      transformerNotationHighlight(),
    ],
  });

  console.log(out)

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
      <Files className="w-4 h-4 absolute right-4 top-2 text-foreground/70 cursor-pointer" />
      <div className="py-2" dangerouslySetInnerHTML={{ __html: out }} />
    </div>
  );
}

export default CodeBlock;
