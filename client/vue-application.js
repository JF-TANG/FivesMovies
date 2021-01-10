const Home = window.httpVueLoader('./components/Home.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Search = window.httpVueLoader('./components/Search.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    current_user: {
      id_user : null,
      username : null,
      email: null,
    },
    recent_movies :[],
    number_movies : null,
    search_result : []
  },
  async mounted () {
    const recent_movies = await axios.get('/api/recent_movies')
    this.recent_movies = recent_movies.data
    const number_movies = await axios.get('/api/number_movies')
    this.number_movies = parseInt(number_movies.data)
  },
  methods: {
    async register(user){
      const res = await axios.post('/api/register', {username: user.username, email : user.email, password : user.password})
      console.log(res.data.message)
    },
    async login(user){
      const res = await axios.post('/api/login', {email : user.email, password : user.password})
      this.current_user=res.data
    },
    async search_movies(key_words){
      const res = await axios.get('/api/search_movies/' + key_words)
      this.search_result=res.data
      window.location.href = "./#/search";
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
