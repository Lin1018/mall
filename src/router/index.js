import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from 'src/views/GoodsList'
import Cart from 'src/views/Cart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
    	path: '/cart',
    	name: 'Cart',
    	component: Cart
    }
  ]
})
