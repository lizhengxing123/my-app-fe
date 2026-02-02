"use client";
import BlockTextReveal from "@/app/(without-header)/20260129/BlockTextReveal";
import CodeBlock from "@/components/common/code-block";

export default function BlockTextRevealComp({
  isPreview,
}: {
  isPreview: boolean;
}) {
    console.log(isPreview);
  return (
    <>
      {isPreview ? (
        <div className="flex justify-center w-full gap-20 pt-8">
          <div>
            <BlockTextReveal blockColor="#ff0" animationOnScroll={false}>
              <span>Zheng</span>
            </BlockTextReveal>
          </div>
          <div>
            <BlockTextReveal
              blockColor="#ff0"
              delay={0.5}
              animationOnScroll={false}
            >
              <span>Xing</span>
              <span>About</span>
              <span>Contact</span>
              <span>Projects</span>
            </BlockTextReveal>
          </div>
        </div>
      ) : (
        <CodeBlock
          lang="ts"
          title="componets/BlockTextRevealComp.tsx"
          content={
`<div className="flex justify-center w-full gap-20 pt-8">
    <div>
        <BlockTextReveal blockColor="#ff0" animationOnScroll={false}>
            <span>Zheng</span>
        </BlockTextReveal>
    </div>
    <div>
        <BlockTextReveal
            blockColor="#ff0"
            delay={0.5}
            animationOnScroll={false}
        >
            <span>Xing</span>
            <span>About</span>
            <span>Contact</span>
            <span>Projects</span>
        </BlockTextReveal>
    </div>
</div>`}
        />
      )}
    </>
  );
}
