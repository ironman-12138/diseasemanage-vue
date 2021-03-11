import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/Index'
import User from '@/views/user/User'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/users'
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