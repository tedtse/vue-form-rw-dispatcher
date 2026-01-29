import fs from "fs";
import path from "path";
import { camelize } from "vue";
import { type Plugin } from "vite";

type Append = Record<"headers" | "footers" | "scriptSetups", string[]>;

const rootPath = process.cwd();

export function markdownTransform(): Plugin {
  return {
    name: "rw-dispatcher-md-transform",
    enforce: "pre",

    async transform(code, id) {
      if (!id.endsWith(".md")) return;

      const componentId = path.basename(id, ".md");
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId),
      };

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      );
    },
  };
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join("\n")}
</script>
`;

const combineMarkdown = (
  code: string,
  headers: string[],
  footers: string[],
) => {
  const frontmatterEnds = code.indexOf("---\n\n");
  const firstHeader = code.search(/\n#{1,6}\s.+/);
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader;

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join("\n") + code.slice(sliceIndex);
  code += footers.join("\n");
  return `${code}\n`;
};

const getExampleImports = (componentId: string) => {
  const exampleDir = path.join(rootPath, "examples", componentId);
  if (!fs.existsSync(exampleDir)) {
    return [];
  }

  const exampleFiles = fs.readdirSync(exampleDir);
  const imports: string[] = [];
  for (const item of exampleFiles) {
    if (!item.endsWith(".vue")) continue;
    const file = item.replace(/\.vue$/, "");
    const name = camelize(`Ep-${componentId}-${file}`);
    imports.push(
      `import ${name} from "../examples/${componentId}/${file}.vue"`,
    );
  }

  return imports;
};
