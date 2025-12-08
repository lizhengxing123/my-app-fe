// services/docMenuService.ts
import request from "@/lib/axiosInstance";
import { DocMenu } from "@/types/DocMenu";

const baseUrl = "/api/menus";

// 获取菜单树
export const getMenuTree = async (startLevel: number, endLevel: number) => {
  return request<DocMenu[]>({
    method: "GET",
    url: `${baseUrl}/tree?startLevel=${startLevel}&endLevel=${endLevel}`,
  });
};
