import { createRouter, createWebHistory } from 'vue-router'
import DataDisplay from '../components/DataDisplay.vue'
import PeopleDetail from '../components/PeopleDetail.vue'
import FilmDetail from '../components/FilmDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DataDisplay
  },
  {
    path: '/people/:id',
    name: 'PeopleDetail',
    component: PeopleDetail,
    props: true
  },
  {
    path: '/films/:id',
    name: 'FilmDetail',
    component: FilmDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
