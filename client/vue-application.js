const Home = window.httpVueLoader('./components/Home.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Search = window.httpVueLoader('./components/Search.vue')
const UserEditMovie = window.httpVueLoader('./components/UserEditMovie.vue')
const UserFavorite = window.httpVueLoader('./components/UserFavorite.vue')
const UserReview = window.httpVueLoader('./components/UserReview.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/user_edit_movie', component: UserEditMovie },
  { path: '/user_favorite', component: UserFavorite },
  { path: '/user_review', component: UserReview },
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
      email : null,
    },
    login_error: null,
    movies : [],
    favorites : [],
    reviews : [],
    recent_movies :[],
    number_movies : null,
    search_result : []
  },
  async mounted () {
    const me = await axios.get('/api/me')
    if (!me.data.message){
      this.current_user = me.data
    }
    const recent_movies = await axios.get('/api/recent_movies')
    this.recent_movies = recent_movies.data
    const number_movies = await axios.get('/api/number_movies')
    this.number_movies = parseInt(number_movies.data)

  },
  methods: {
    async disconnect(){
      const res = await axios.post('/api/disconnect')
      console.log(res.data.message)
      this.current_user.id_user=null
      this.current_user.username=null
      this.current_user.email=null
      this.movies=[]
      this.favorites=[]
      this.reviews=[]
      window.location.href = "./#/";
    },
    async register(user){
      const res = await axios.post('/api/register', {username: user.username, email : user.email, password : user.password})
      console.log(res.data.message)
    },
    async login(user){
      const res = await axios.post('/api/login', {email : user.email, password : user.password})
      if (res.data.message){
        this.login_error=res.data
      }else{
        this.current_user=res.data
      }
    },
    async search_movies(key_words){
      const res = await axios.get('/api/search_movies/' + key_words)
      this.search_result=res.data
      window.location.href = "./#/search";
    },
    async get_user_movies(){
      if (this.current_user.id_user == null){
        window.location.href = "./#/login";
      }
      else{
        const res = await axios.get('/api/get_user_movies/' + this.current_user.id_user)
        this.movies=res.data
      }
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
    async add_movie (movie) {
      const res = await axios.post('/api/add_movie', {movie : movie, id_user : this.current_user.id_user })
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
    async delete_movie (id_movie) {
      const res = await axios.delete('/api/movie/' + id_movie + "/" + this.current_user.id_user)
      if (res.data==1){
        const index = this.movies.findIndex(movie => movie.id_movie === id_movie)
        this.movies.splice(index, 1)
      }
    }
  }
})
