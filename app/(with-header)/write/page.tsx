"use client";

import React, { useState, useEffect } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import MarkdownRenderer from "@/components/md/md-renderer";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Save, ScanEye } from "lucide-react";
import { useTheme } from "next-themes";
import WritePageSkeleton from "@/components/skeleton/write-skeleton";
import RelatedMenu from "@/components/write/related-menu";
import {
  addDocumentAndRelateMenu,
  getDocumentById,
} from "@/services/techDocumentService";
import { toast } from "sonner";
import { DocMenu } from "@/types/DocMenu";
import { TechDocument } from "@/types/TechDocument";

export default () => {
  const DEFAULT_TITLE = "# 请输入标题";
  // 输入的文章内容
  const [text, setText] = useState(DEFAULT_TITLE);
  // 预览的 md 内容
  const [preview, setPreview] = useState(DEFAULT_TITLE);
  const { theme = "light" } = useTheme();
  const [clientTheme, setClientTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  /**
   * 发布文章相关
   */
  // 选中的菜单
  const [selectedPublishMenu, setSelectedPublishMenu] =
    useState<DocMenu | null>(null);
  // 弹框开关
  const [publishOpen, setPublishOpen] = useState(false);

  /**
   * 发布文章 -- 一个菜单关联一篇文章
   * 1、如果已加载文章，发布时直接发布
   * 3、如果未加载文章，选择之后再发布
   */
  const publishDoc = async () => {
    if (!loadedDoc && !selectedPublishMenu) {
      toast.warning("发布文章需要关联菜单！");
      return;
    }
    const res = await addDocumentAndRelateMenu({
      id: loadedDoc?.id,
      title: text.split("\n")[0].replace("# ", ""),
      content: text,
      menuId: selectedPublishMenu?.id ?? undefined,
    });
    if (res.success) {
      toast.success(res.msg);
      setPublishOpen(false);
    }
  };

  // 处理发布点击事件
  const handlePublishClick = () => {
    if (loadedDoc) {
      publishDoc();
    } else {
      setPublishOpen(true);
    }
  };

  /**
   * 文章加载相关
   */
  // 选中的菜单
  const [selectedLoadMenu, setSelectedLoadMenu] = useState<DocMenu | null>(
    null
  );
  // 弹框开关
  const [loadOpen, setLoadOpen] = useState(false);
  // 已加载的文章信息
  const [loadedDoc, setLoadedDoc] = useState<TechDocument | null>(null);

  // 加载文章
  const loadDoc = async () => {
    if (!selectedLoadMenu || !selectedLoadMenu.id) {
      toast.warning("请选择文章关联的菜单！");
      return;
    }
    if(!selectedLoadMenu.docId) {
      toast.warning("当前菜单还未发布文章，请先发布！");
      return;
    }
    const res = await getDocumentById(selectedLoadMenu.docId);
    if (res.success) {
      setLoadedDoc(res.data);
      setText(res.data.content || DEFAULT_TITLE);
      setPreview(res.data.content || DEFAULT_TITLE);
      setLoadOpen(false);
    }
  };

  // 只在客户端执行主题相关逻辑
  useEffect(() => {
    setIsMounted(true);
    setClientTheme(theme);
  }, [theme]);

  return (
    <div className="h-full w-full px-6 flex">
      {isMounted ? (
        <>
          <MdEditor
            className={
              isMounted && clientTheme === "dark"
                ? "md-editor-dark"
                : "md-editor"
            }
            style={{ height: "100%", width: "50%" }}
            value={text}
            onChange={setText}
            preview={false}
            showToolbarName
            toolbars={[
              "bold",
              "underline",
              "italic",
              "-",
              "strikeThrough",
              "sub",
              "sup",
              "quote",
              "unorderedList",
              "orderedList",
              "task",
              "-",
              "codeRow",
              "code",
            ]}
            footers={[]}
          />
          <div className="w-1/2 h-full pl-4 border-r h-[80vh] overflow-auto">
            <MarkdownRenderer
              className="w-full"
              content={preview}
            />
            <div className="fixed top-[90px] left-1/2 transform -translate-y-1/2">
              <Button onClick={() => setPreview(text)} className="cursor-pointer">
                <ScanEye />
              </Button>
            </div>
            <div className="fixed bottom-0 right-0 w-1/2 py-3 pr-6 border-t flex items-center justify-between space-x-4 bg-background">
              <span className="text-sm text-foreground/80 pl-3">
                {loadedDoc && selectedLoadMenu
                  ? "文章已加载，关联菜单：" + selectedLoadMenu.name
                  : ""}
              </span>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setLoadOpen(true)}
                  className="cursor-pointer"
                >
                  <Save />
                  加载文章
                </Button>
                <Button onClick={handlePublishClick} className="cursor-pointer">
                  <BookOpenCheck />
                  发布文章
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <WritePageSkeleton />
      )}
      <RelatedMenu
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        publishDoc={publishDoc}
        selectedMenu={selectedPublishMenu}
        setSelectedMenu={setSelectedPublishMenu}
        btnType="publish"
      />
      <RelatedMenu
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
        loadDoc={loadDoc}
        selectedMenu={selectedLoadMenu}
        setSelectedMenu={setSelectedLoadMenu}
        btnType="load"
      />
    </div>
  );
};
