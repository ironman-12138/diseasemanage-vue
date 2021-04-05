import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/Index'
import User from '@/views/user/User'
import GoodsGoto from '@/views/business/GoodsGoto'
import Suppliers from '@/views/business/Suppliers'
import Welcome from '@/views/Welcome'
import Products from '@/views/business/Products'
import ProductCategorys from '@/views/business/ProductCategorys'
import InStock from '@/views/business/InStock'
import AddStock from '@/views/business/AddStock'
import OutStock from '@/views/business/OutStock'
import PushStock from '@/views/business/PushStock'
import Stock from '@/views/business/Stock'
import HealthMap from '@/views/health/HealthMap'
import HealthCard from '@/views/health/HealthCard'
import Dept from '@/views/system/Dept'
import Role from '@/views/system/Role'
import Menu from '@/views/system/Menu'
import LoginLog from '@/views/log/LoginLog'
import Swagger from '@/views/other/Swagger'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
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
          path: '/system/users',
          name: 'user',
          component: User,
          meta: {
            title: '用户'
          }
        },
        {
          path: '/consumer',
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
        },
        {
          path: '/welcome',
          name: 'Welcome',
          component: Welcome,
          meta: {
            title: '欢迎'
          }
        },
        {
          path: '/products',
          name: 'Products',
          component: Products,
          meta: {
            title: '物资资料'
          }
        },
        {
          path: '/productCategorys',
          name: 'ProductCategorys',
          component: ProductCategorys,
          meta: {
            title: '物资类别'
          }
        },
        {
          path: '/instock',
          name: 'InStock',
          component: InStock,
          meta: {
            title: '物资入库'
          }
        },
        {
          path: '/addstock',
          name: 'AddStock',
          component: AddStock,
          meta: {
            title: '添加入库'
          }
        },
        {
          path: '/outstock',
          name: 'OutStock',
          component: OutStock,
          meta: {
            title: '物资出库'
          }
        },
        {
          path: '/pushstock',
          name: 'PushStock',
          component: PushStock,
          meta: {
            title: '添加出库'
          }
        },
        {
          path: '/stock',
          name: 'Stock',
          component: Stock,
          meta: {
            title: '物资库存'
          }
        },
        {
          path: '/health/map',
          name: 'HealthMap',
          component: HealthMap,
          meta: {
            title: '全国疫情'
          }
        },
        {
          path: '/health/getCard',
          name: 'HealthCard',
          component: HealthCard,
          meta: {
            title: '健康打卡'
          }
        },
        {
          path: '/system/department',
          name: 'Dept',
          component: Dept,
          meta: {
            title: '部门管理'
          }
        },
        {
          path: '/system/role',
          name: 'Role',
          component: Role,
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/system/menu',
          name: 'Menu',
          component: Menu,
          meta: {
            title: '菜单管理'
          }
        },
        {
          path: '/log/loginLog',
          name: 'LoginLog',
          component: LoginLog,
          meta: {
            title: '登录日志'
          }
        },
        {
          path: '/swagger',
          name: 'Swagger',
          component: Swagger,
          meta: {
            title: '接口文档'
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