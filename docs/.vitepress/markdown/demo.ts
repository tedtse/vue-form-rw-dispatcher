import path from "path";
import fs from "fs";
import { type MarkdownRenderer } from "vitepress";

const docRoot = process.cwd();

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?: MarkdownRenderer["renderer"]["rules"]["container"];
}

function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/);
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : "";
        const sourceFileToken = tokens[idx + 2];
        let source = "";
        const sourceFile = sourceFileToken.children?.[0].content ?? "";

        // sourceFile 允许显式声明扩展名（如 "foo/bar.tsx"）；
        // 未声明扩展名时默认按 .vue 处理，保持向后兼容。
        const fileName = path.extname(sourceFile)
          ? sourceFile
          : `${sourceFile}.vue`;

        if (sourceFileToken.type === "inline") {
          source = fs.readFileSync(
            path.resolve(docRoot, "examples", fileName),
            "utf-8",
          );
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`);

        // 按源文件扩展名选择高亮语言：.vue -> vue、.tsx -> tsx、.ts -> ts ...
        let lang = path.extname(fileName).slice(1) || "vue";
        // Shiki 内置 vue grammar 对 .vue 文件里 <script lang="tsx"> 内嵌
        // JSX 的支持不完整，整段 tsx 会失去高亮。检测到这种情况时改用
        // tsx 高亮整体内容，让 <script setup lang="tsx"> 中的 JSX 获得正确高亮
        // （template/style 部分 tsx grammar 也能部分识别，影响较小）。
        if (lang === "vue" && /<script\b[^>]*\blang=["']tsx["']/.test(source)) {
          lang = "tsx";
        }

        return `<VpDemo source="${encodeURIComponent(
          md.render(`\`\`\`${lang}\n${source}\`\`\``),
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source,
        )}" description="${encodeURIComponent(md.render(description))}">
  <template #source><ep-${sourceFile.replaceAll("/", "-")}/></template>`;
      } else {
        return "</VpDemo>\n";
      }
    },
  };
}

export default createDemoContainer;
