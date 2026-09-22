import { createRouter, createWebHistory } from "vue-router";
import ProviderView from "../views/ProviderView.vue";
import FormView from "../views/FormView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: { name: "form" } },
    {
      path: "/form",
      name: "form",
      component: FormView,
    },
    {
      path: "/provider",
      name: "provider",
      component: ProviderView,
    },
  ],
});

export default router;
