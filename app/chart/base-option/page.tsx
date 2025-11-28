import MarkdownRenderer from "@/components/md/md-renderer";

const mdContent = `
# React 19 + RSC 测试

\`\`\`ts title="服务器组件示例" {3} +{8} -{6} 
'use server';
export async function getData() {
  return { name: 'React 19' };
}

console.log("aaa");

console.log("bbb");
\`\`\`

【【【Chart1?width=800】】】
  `;

export default function MarkdownPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* MarkdownRenderer 需标记为客户端组件（'use client'） */}
      <MarkdownRenderer content={mdContent} />
    </div>
  );
}
