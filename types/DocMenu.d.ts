export interface DocMenu {
  id: string;
  name: string;
  href: string;
  icon: string | React.ReactNode;
  description: string;
  level: number;
  docId: number; // 关联文档ID
  sortNum: number;
  children: DocMenu[]; // 子菜单
}
