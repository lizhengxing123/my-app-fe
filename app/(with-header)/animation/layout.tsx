import SidebarLayout from "@/components/layout/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout basePath="/animation" allItemsTitle="所有动画">
      {children}
    </SidebarLayout>
  );
}