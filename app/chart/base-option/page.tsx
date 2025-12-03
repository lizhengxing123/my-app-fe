"use client";
import MarkdownRenderer from "@/components/md/md-renderer";
import { getDocumentById } from "@/services/techDocumentService";
import { useEffect, useState } from "react";

export default function MarkdownPage() {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 初始化加载数据（或通过按钮触发）
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDocumentById("1996044129830584321");
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
    <div className="w-full mx-auto h-full p-4">
      {/* MarkdownRenderer 需标记为客户端组件（'use client'） */}
      <MarkdownRenderer content={data} />
    </div>
  );
}
