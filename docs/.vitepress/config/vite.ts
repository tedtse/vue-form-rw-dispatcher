import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { markdownTransform } from "../plugins/markdown-transform";

export const getViteConfig = () => {
  return {
    plugins: [
      vueJsx(),
      Components({
        dts: true,
        dirs: [".vitepress/vitepress/components"],
        deep: true,
        allowOverrides: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          // auto import icons
          // https://github.com/antfu/unplugin-icons
          IconsResolver(),
        ],
      }),
      // https://github.com/antfu/unplugin-icons
      Icons({
        autoInstall: true,
      }),
      markdownTransform(),
    ],
  };
};
