const Home = window.httpVueLoader('./components/Home.vue')
const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/panier', component: Panier },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    articles: [],
    panier: {
      createdAt: null,
      updatedAt: null,
      articles: []
    },
  },
  async mounted () {
    const res = await axios.get('/api/articles')
    this.articles = res.data
    const res2 = await axios.get('/api/panier')
    this.panier = res2.data
  },
  methods: {
    async pay(panier){
      const res = await axios.post('/api/panier/pay',{panier : panier})
    if (res.data.connected===false){
        window.location.href = "./#/login";
      }
      console.log(res.data.message)
    },
    async login(user){
      const res = await axios.post('/api/login', {email : user.email, password : user.password})
      console.log(res.data.message)
    },
    async addUser(user){
      const res = await axios.post('/api/register', {email : user.email, password : user.password})
      console.log(res.data.message)
    },
    async editQuantity (articleId, qte) {
      await axios.put('/api/panier/' + articleId, {qte : qte})
      const article = this.panier.articles.find(a => a.id === articleId)
      article.qte = qte
    },
    async removeFromPanier (articleId) {
      await axios.delete('/api/panier/' + articleId)
      const index = this.panier.articles.findIndex(a => a.id === articleId)
      this.panier.articles.splice(index,1)
    },
    async addToPanier (articleId) {
      const res = await axios.post('/api/panier', {id : articleId, qte : 1})
      this.panier.articles.push(res.data)
    },
    async addArticle (article) {
      const res = await axios.post('/api/article', article)
      this.articles.push(res.data)
    },
    async updateArticle (newArticle) {
      await axios.put('/api/article/' + newArticle.id, newArticle)
      const article = this.articles.find(a => a.id === newArticle.id)
      article.name = newArticle.name
      article.description = newArticle.description
      article.image = newArticle.image
      article.price = newArticle.price
    },
    async deleteArticle (articleId) {
      await axios.delete('/api/article/' + articleId)
      const index = this.articles.findIndex(a => a.id === articleId)
      this.articles.splice(index, 1)
    }
  }
})
