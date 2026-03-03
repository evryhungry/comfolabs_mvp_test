import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Projects',
    component: () => import('../domains/project/components/ProjectList.vue'),
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('../domains/project/components/ProjectCard.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
