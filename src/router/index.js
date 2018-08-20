import Vue from 'vue'
import Router from 'vue-router'
import Products from '@/components/Products'
import OrderDetail from '@/pages/order/orderDetail'
import Orders from '@/components/Orders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Products',
      component: Products
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
    },
    {
      path: '/orderDetail',
      component: OrderDetail,
    }
    
  ]
})
