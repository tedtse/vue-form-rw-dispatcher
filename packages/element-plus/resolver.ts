/**
 * Build-tool integration for `element-plus-form-dispatcher`.
 *
 * This module is intentionally dependency-free: importing it must NOT pull the
 * runtime component tree (`vue`, `element-plus`, the dispatcher components,
 * ...) into a Node-side config file such as `vite.config.ts`. That is why the
 * resolver lives behind its own `element-plus-form-dispatcher/resolver`
 * subpath instead of the package root entry.
 *
 * It ships a resolver factory for `unplugin-vue-components` (方案 A). See the
 * docs "自动导入集成" page for the alternative that needs no custom resolver
 * at all (方案 B: `ElementPlusResolver({ exclude: /Dispatcher$/ })`).
 */

/**
 * Minimal, structural mirror of the `ComponentResolver` object that
 * `unplugin-vue-components` expects. Declared locally (rather than imported)
 * so this subpath stays free of any build-tool dependency.
 */
export interface FormDispatcherComponentResolver {
  type: "component";
  resolve: (
    name: string,
  ) =>
    | { name: string; from: string }
    | undefined
    | Promise<{ name: string; from: string } | undefined>;
}

export interface FormDispatcherResolverOptions {
  /**
   * PascalCase suffix that identifies a dispatcher component (the name
   * `unplugin-vue-components` hands to `resolve`, e.g. `ElInputDispatcher`).
   * @default "Dispatcher"
   */
  suffix?: string;
  /**
   * Module the matched components are imported from.
   * @default "element-plus-form-dispatcher"
   */
  from?: string;
}

/**
 * Create a `unplugin-vue-components` resolver that claims the library's
 * `*Dispatcher` components and routes them to this package.
 *
 * `ElementPlusResolver` greedily matches ANY name shaped like `/^El[A-Z]/`
 * (it does not validate against a whitelist), so it would otherwise hijack
 * `ElInputDispatcher` and emit a bogus `element-plus/es/...` import. Place the
 * returned resolver BEFORE `ElementPlusResolver` in the `resolvers` array so
 * it wins for dispatcher names and `resolve` returns `undefined` (pass-through)
 * for everything else.
 *
 * @example
 * ```ts
 * import { FormDispatcherResolver } from "element-plus-form-dispatcher/resolver";
 * import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
 *
 * Components({
 *   resolvers: [FormDispatcherResolver(), ElementPlusResolver()],
 * });
 * ```
 */
export function FormDispatcherResolver(
  options: FormDispatcherResolverOptions = {},
): FormDispatcherComponentResolver {
  const { suffix = "Dispatcher", from = "element-plus-form-dispatcher" } =
    options;
  return {
    type: "component",
    resolve: (name: string) => {
      if (name.endsWith(suffix)) {
        return { name, from };
      }
      // Return undefined so unplugin falls through to the next resolver.
      return undefined;
    },
  };
}

export default FormDispatcherResolver;
