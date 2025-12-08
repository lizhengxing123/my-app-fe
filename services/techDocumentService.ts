// services/documentService.ts
import request from "@/lib/axiosInstance";
import { TechDocument } from "@/types/TechDocument";

const baseUrl = "/api/tech-documents";

// 获取单个文档详情
export const getDocumentById = async (id: string) => {
  return request<TechDocument>({
    method: "GET",
    url: `${baseUrl}/${id}`,
  });
};
