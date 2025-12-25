"use client";

import MarkdownRenderer from "@/components/md/md-renderer";
import { getDocumentById } from "@/services/techDocumentService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MdAnchor from "@/components/md/md-anchor";

interface MarkdownPageProps {
  className?: string;
}

export default function MarkdownPage({ className }: MarkdownPageProps) {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const docId = searchParams.get("docId") || "";

  // 初始化加载数据（或通过按钮触发）
  const fetchData = async () => {
    if (!docId || docId.trim() === "null" || docId.trim() === "undefined") {
      setError("没有文档ID，无法获取内容！");
      toast.error("没有文档ID，无法获取内容！");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getDocumentById(docId);
      if (res.success) {
        setData(res.data.content);
      }
    } catch (err) {
      setError("请求失败，请重试");
      console.error("错误详情：", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    fetchData(); // 组件挂载时请求
  }, []);
  return (
    <div className="w-full h-full">
      <div className="w-[calc(100%-200px)]">
        <MarkdownRenderer content={data} className={className} />
      </div>
      {/* 文档锚点 */}
      <MdAnchor />
    </div>
  );
}