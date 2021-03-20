import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/Index'
import User from '@/views/user/User'
import GoodsGoto from '@/views/business/GoodsGoto'
import Suppliers from '@/views/business/Suppliers'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/GoodsGoto'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/users',
          name: 'user',
          component: User,
          meta: {
            title: '用户'
          }
        },
        {
          path: '/goodsGoto',
          name: 'GoodsGoto',
          component: GoodsGoto,
          meta: {
            title: '物资去处'
          }
        },
        {
          path: '/suppliers',
          name: 'Suppliers',
          component: Suppliers,
          meta: {
            title: '物资来源'
          }
        }
      ]
    }
  ],
  mode: 'history'  //改变url地址的风格（#/ ==> /）
})

//前置钩子，显示标题
router.beforeEach((to,from,next) => {
  if(to.meta.title){
    document.title = to.meta.title;
  }
  next();
})

export default router;