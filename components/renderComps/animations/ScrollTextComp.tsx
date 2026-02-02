"use client";
import ScrollText from "@/app/(without-header)/20260129/ScrollTextAnimation";
import CodeBlock from "@/components/common/code-block";

export default function ScrollTextComp({ isPreview }: { isPreview: boolean }) {
  console.log(isPreview);
  return (
    <>
      {isPreview ? (
        <div className="flex justify-center w-full gap-20 pt-8">
          <div>
            <ScrollText animationOnScroll={false}>
              <span>Zheng</span>
            </ScrollText>
          </div>
          <div>
            <ScrollText delay={0.4} animationOnScroll={false}>
              <span>Xing</span>
              <span>About</span>
              <span>Contact</span>
              <span>Projects</span>
            </ScrollText>
          </div>
          <div className="w-1/5">
            <ScrollText delay={0.8} animationOnScroll={false}>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
              </p>
              <p>
                Neque placeat veniam incidunt aspernatur minima doloribus, quas sit voluptatum sint quaerat!
              </p>
            </ScrollText>
          </div>
        </div>
      ) : (
        <CodeBlock
          lang="ts"
          title="componets/BlockTextRevealComp.tsx"
          content={
`<div className="flex justify-center w-full gap-20 pt-8">
  <div>
    <ScrollText animationOnScroll={false}>
      <span>Zheng</span>
    </ScrollText>
  </div>
  <div>
    <ScrollText delay={0.4} animationOnScroll={false}>
      <span>Xing</span>
      <span>About</span>
      <span>Contact</span>
      <span>Projects</span>
    </ScrollText>
  </div>
  <div className="w-1/5">
    <ScrollText delay={0.8} animationOnScroll={false}>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      </p>
      <p>
        Neque placeat veniam incidunt aspernatur minima doloribus, quas sit voluptatum sint quaerat!
      </p>
    </ScrollText>
  </div>
</div>`}
        />
      )}
    </>
  );
}
