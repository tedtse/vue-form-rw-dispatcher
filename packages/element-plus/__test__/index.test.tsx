import { createApp, h, nextTick, resolveComponent } from "vue";
import { describe, test, expect, afterEach } from "vitest";
import { DispatcherPlugin } from "../index";
import { Config, setConfig, DEFAULT_NAMESPACE } from "../config";

/**
 * Regression test for the runtime `namespace` option.
 *
 * Previously `nsStateKey` / `classNamespace` were module-level constants that
 * captured `Config.namespace` at import time, so `app.use(DispatcherPlugin, {
 * namespace })` (which runs *after* the component modules are already loaded)
 * could not take effect — the consumer had to use the default `rwDispatcher`
 * namespace. Option A makes those keys resolve lazily at setup/render time, so
 * the realistic "import then register" flow below now works.
 */
const mountWithPlugin = async (
  options: Parameters<typeof DispatcherPlugin>[1],
  namespace: string,
  stateValue: "read" | "write",
) => {
  const host = document.createElement("div");
  document.body.appendChild(host);

  const app = createApp({
    render() {
      const ElInputDispatcher = resolveComponent("ElInputDispatcher");
      return h(ElInputDispatcher as any, {
        [`${namespace}State`]: stateValue,
        modelValue: "hello",
      });
    },
  });

  app.use(DispatcherPlugin, options);
  app.mount(host);
  await nextTick();

  return { host, app };
};

describe("DispatcherPlugin namespace", () => {
  afterEach(() => {
    setConfig({ namespace: DEFAULT_NAMESPACE });
  });

  test("object-form { namespace } renders the reader for :ns-state='read'", async () => {
    const { host, app } = await mountWithPlugin(
      { namespace: "ns" },
      "ns",
      "read",
    );

    // The plugin's setConfig took effect on the shared Config.
    expect(Config.namespace).toBe("ns");
    // Read mode renders the plain-text reader, never a native <input>.
    expect(host.querySelector("input")).toBeNull();
    // The reader root carries the namespaced class `ns-el-input`.
    const reader = host.querySelector(".ns-el-input");
    expect(reader).not.toBeNull();
    expect(reader!.textContent).toContain("hello");

    app.unmount();
    host.remove();
  });

  test("string-form namespace behaves the same", async () => {
    const { host, app } = await mountWithPlugin("ns", "ns", "read");

    expect(Config.namespace).toBe("ns");
    expect(host.querySelector("input")).toBeNull();
    expect(host.querySelector(".ns-el-input")).not.toBeNull();

    app.unmount();
    host.remove();
  });

  test("write mode under the custom namespace renders a native input", async () => {
    const { host, app } = await mountWithPlugin(
      { namespace: "ns" },
      "ns",
      "write",
    );

    expect(host.querySelector("input")).not.toBeNull();
    expect(host.querySelector(".ns-el-input")).toBeNull();

    app.unmount();
    host.remove();
  });

  test("default namespace prop is untouched when no option is given", async () => {
    const { host, app } = await mountWithPlugin(
      undefined,
      DEFAULT_NAMESPACE,
      "read",
    );

    expect(Config.namespace).toBe(DEFAULT_NAMESPACE);
    expect(host.querySelector("input")).toBeNull();
    expect(host.querySelector(".rw-dispatcher-el-input")).not.toBeNull();

    app.unmount();
    host.remove();
  });
});
