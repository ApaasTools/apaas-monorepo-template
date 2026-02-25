import admin from '@/pages/admin/admin.vue'
import menu from '@/pages/admin/menu/menu.vue'

export default {
  path: '/admin',
  name: 'admin',
  component: admin,
  redirect: '/admin/menu',
  children: [
    {
      path: 'menu',
      name: 'menu',
      component: menu
    }
  ]
}
