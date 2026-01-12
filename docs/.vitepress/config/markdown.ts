import mdContainer from "markdown-it-container";
import createDemoContainer from "../markdown/demo";
import type { MarkdownRenderer } from "vitepress";

export const mdPlugin = (md: MarkdownRenderer) => {
  md.use(mdContainer, "demo", createDemoContainer(md));
};
