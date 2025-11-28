import CodeBlock from "@/components/common/code-block";

export default async function Page() {
  return (
    <div className="w-3/5 mx-auto py-4">
      <CodeBlock
        lang="ts"
        title="componets/code-block.tsx"
        content={[
          "console.log('hewwo') // [!code --]",
          "console.log('hello')",
          "console.log('goodbye') // [!code highlight]",
          "",
          "function hello() {",
          "  console.log('hello') // [!code ++]",
          "}",
        ].join("\n")}
      />
    </div>
  );
}
