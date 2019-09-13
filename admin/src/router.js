import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

import CategroiesEdit from './views/CategoriesEdit.vue'
import CategroiesList from './views/CategoriesList.vue'

import GoodsEdit from './views/GoodsEdit.vue'
import GoodsList from './views/GoodsList.vue'

import HeroesEdit from './views/HeroesEdit.vue'
import HeroesList from './views/HeroesList.vue'

import ArticlesEdit from './views/ArticlesEdit.vue'
import ArticlesList from './views/ArticlesList.vue'

import AdsEdit from './views/AdsEdit.vue'
import AdsList from './views/AdsList.vue'

import UsersEdit from './views/UsersEdit.vue'
import UsersList from './views/UsersList.vue'

import Login from "./views/Login.vue"




Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path:"/login",
      name:"Login",
      component: Login,
      meta:{
        isPublic: true
      }
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children:[
        {path:"/categroies/create",component:CategroiesEdit},
        {path:"/categroies/edit/:id",component:CategroiesEdit},
        {path:"/categroies/list",component:CategroiesList},

        {path:"/goods/create",component:GoodsEdit},
        {path:"/goods/edit/:id",component:GoodsEdit},
        {path:"/goods/list",component:GoodsList},

        {path:"/heroes/create",component:HeroesEdit},
        {path:"/heroes/edit/:id",component:HeroesEdit},
        {path:"/heroes/list",component:HeroesList},

        {path:"/articles/create",component:ArticlesEdit},
        {path:"/articles/edit/:id",component:ArticlesEdit},
        {path:"/articles/list",component:ArticlesList},

        {path:"/ads/create",component:AdsEdit},
        {path:"/ads/edit/:id",component:AdsEdit},
        {path:"/ads/list",component:AdsList},

        {path:"/users/create",component:UsersEdit},
        {path:"/users/edit/:id",component:UsersEdit},
        {path:"/users/list",component:UsersList},


      ]
    }
  ]
})

router.beforeEach((to, from, next) => {

  if(!to.meta.isPublic && !localStorage.token){
    return next("/login")
  }
  next()
})

export default router