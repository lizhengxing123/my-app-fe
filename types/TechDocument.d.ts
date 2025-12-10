export interface TechDocument {
  id: number;
  title: string;
  content: string;
  createTime: string;
  updateTime: string;
  menuId: string // 关联的菜单ID，在新增的时候需要提供
}