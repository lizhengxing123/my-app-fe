import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItContainer from "markdown-it-container";

// 自定义插件：解析 【【【组件名】】】 语法
// 用来渲染项目中的自定义组件
const componentPlugin = (md: MarkdownIt) => {
  // 定义语法规则：匹配 【【【xxx】】】（支持中文/英文组件名）
  const componentRegex = /【{3}([A-Za-z0-9_]+)】{3}/g;

  // 注册 inline 级别的解析器（行内语法）
  md.inline.ruler.push("custom-component", (state, silent) => {
    const start = state.pos;
    const match = componentRegex.exec(state.src.slice(start));

    if (!match) return false; // 无匹配则退出

    // silent 为 true 时仅检查语法，不生成 tokens
    if (!silent) {
      const componentName = match[1];
      // 生成一个自定义 token，类型为 'component'，携带组件名
      const token = state.push("component", "", 0);
      token.meta = { componentName };
    }

    // 更新解析位置（跳过匹配的字符串）
    state.pos += match[0].length;
    return true;
  });

  // 注册 token 渲染器：将 custom-component token 转为占位符 HTML
  md.renderer.rules.component = (tokens, idx) => {
    const componentName = tokens[idx].meta.componentName;
    // 生成带 data 属性的占位符，后续 React 会替换这个 div
    return `<div data-md-component="${componentName}" class="md-component-placeholder"></div>`;
  };
};

// 自定义插件：解析代码块语法
// 使用自定义 Shiki 组件来渲染代码块
const codeBlockPlugin = (md: MarkdownIt) => {
  // 保存原始的代码块渲染器
  const defaultFenceRenderer =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // 辅助函数：解析行范围表达式，如 "1,3-5" 转为 [1,3,4,5]
  const parseLineRanges = (rangeStr: string): Set<number> => {
    const lines = new Set<number>();
    if (!rangeStr) return lines;

    const parts = rangeStr.split(",");
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.match(/^\d+$/)) {
        // 单行，如 "1"
        lines.add(parseInt(trimmed, 10));
      } else if (trimmed.match(/^(\d+)-(\d+)$/)) {
        // 范围，如 "3-5"
        const [, start, end] = trimmed.match(/^(\d+)-(\d+)$/)!;
        const startNum = parseInt(start, 10);
        const endNum = parseInt(end, 10);
        for (let i = startNum; i <= endNum; i++) {
          lines.add(i);
        }
      }
    });

    return lines;
  };

  // 辅助函数：处理代码内容，根据行标记添加特殊注释
  const processCodeWithLineMarkers = (
    code: string,
    highlightLines: Set<number>,
    addedLines: Set<number>,
    deletedLines: Set<number>
  ): string => {
    return code
      .split("\n")
      .map((line, index) => {
        const lineNum = index + 1;
        let marker = "";

        // 添加对应的标记注释
        if (highlightLines.has(lineNum)) {
          marker = " // [!code highlight]";
        } else if (addedLines.has(lineNum)) {
          marker = " // [!code ++]";
        } else if (deletedLines.has(lineNum)) {
          marker = " // [!code --]";
        }

        return line + marker;
      })
      .join("\n");
  };

  // 重写代码块渲染器
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();

    // 解析信息行，提取语言、标题（文件名）和行标记
    let language = "";
    let title = "";
    let highlightLines = new Set<number>();
    let addedLines = new Set<number>();
    let deletedLines = new Set<number>();

    // 匹配更复杂的格式，包括语言、title和行标记
    // 匹配格式：language title="xxx" {1,3-5} +{1,3-5} -{1,3-5}
    const match = info.match(
      /^([^\s]+)(?:\s+title="([^"]+)")?(?:\s+(\{[^\}]+\}))?(?:\s+(\+\{[^\}]+\}))?(?:\s+(-\{[^\}]+\}))?/
    );

    if (match) {
      language = match[1];
      title = match[2] || "";

      // 解析高亮行标记，如 {1,3-5}
      if (match[3]) {
        const rangeStr = match[3].replace(/[{}]/g, "");
        highlightLines = parseLineRanges(rangeStr);
      }

      // 解析新增行标记，如 +{1,3-5}
      if (match[4]) {
        // 只移除开头的加号和大括号，保留范围中的连字符
        const rangeStr = match[4].replace(/^\+|{|}/g, "");
        addedLines = parseLineRanges(rangeStr);
      }

      // 解析删除行标记，如 -{1,3-5}
      if (match[5]) {
        // 只移除开头的负号和大括号，保留范围中的连字符
        const rangeStr = match[5].replace(/^-|{|}/g, "");
        deletedLines = parseLineRanges(rangeStr);
      }
    }

    // 获取代码内容
    let code = token.content.trim();

    // 根据标记处理代码行
    code = processCodeWithLineMarkers(
      code,
      highlightLines,
      addedLines,
      deletedLines
    );

    // 生成带数据属性的占位符，后续React会替换这个div
    // 将语言、标题和代码内容作为data属性传递
    return `<div 
      data-md-component="CodeBlock" 
      data-props-lang="${encodeURIComponent(language)}"
      data-props-title="${encodeURIComponent(title)}"
      data-props-content="${encodeURIComponent(code)}"
    ></div>`;
  };
};

// 将所有链接添加 target="_blank" 属性的插件
const blankATagPlugin = (md: MarkdownIt) => {
  // 记住原始的链接渲染器
  const defaultLinkRenderer =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // 重写链接渲染器
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // 添加 target="_blank" 属性
    tokens[idx].attrSet("target", "_blank");

    // 调用原始渲染器
    return defaultLinkRenderer(tokens, idx, options, env, self);
  };
}


// 初始化 markdown-it 实例，加载自定义插件
export const createMarkdownIt = () => {
  return MarkdownIt({
    html: true, // 允许 MD 中包含 HTML（可选）
    breaks: true,
    linkify: true,
  })
    .use(componentPlugin)
    .use(codeBlockPlugin) // 注册代码块插件
    .use(blankATagPlugin) // 注册链接插件
    .use(markdownItAnchor, {
      slugify: (str: string) => str,
      permalink: true,
      permalinkSymbol: "§",
      permalinkBefore: true,
    })
    .use(markdownItContainer, "tip");
};
