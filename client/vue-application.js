const Home = window.httpVueLoader('./components/Home.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Search = window.httpVueLoader('./components/Search.vue')
const UserEditMovie = window.httpVueLoader('./components/UserEditMovie.vue')
const UserFavorite = window.httpVueLoader('./components/UserFavorite.vue')
const UserReview = window.httpVueLoader('./components/UserReview.vue')
const Movie = window.httpVueLoader('./components/Movie.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/user_edit_movie', component: UserEditMovie },
  { path: '/user_favorite', component: UserFavorite },
  { path: '/user_review', component: UserReview },
  { path: '/movie/:id_movie', component: Movie },
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
    login_error: {
      message:''
    },
    movies : [],
    favorites : [],
    reviews : [],
    recent_movies :[],
    number_movies : null,
    search_result : [],
    movie_result : [],
    all_ratings: []
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
      window.location.href = "./#/"
    },
    async register(user){
      const res = await axios.post('/api/register', {username: user.username, email : user.email, password : user.password})
      console.log(res.data.message)
      this.login(user)
    },
    async login(user){
      const res = await axios.post('/api/login', {email : user.email, password : user.password})
      if (res.data.message){
        this.login_error=res.data
      }else if (this.current_user.id_user==null){
        this.current_user=res.data
        window.location.href = "./#/"
      }
    },
    async search_movies(key_words){
      const res = await axios.get('/api/search_movies/' + key_words)
      this.search_result=res.data
      console.log(search_result)
      window.location.href = "./#/search";
    },
    async get_movie_by_id(movie_id){
      const res = await axios.get('/api/get_movie_by_id/' + movie_id)
      this.movie_result=res.data
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
    async add_movie (new_movie) {
      const res = await axios.post('/api/add_movie', {
        title : new_movie.title, 
        release_date : new_movie.release_date, 
        plot : new_movie.plot, 
        poster : new_movie.poster, 
        id_user : this.current_user.id_user 
      })
      if (res.data==1){
        const movie_clone = Object.assign({}, new_movie);
        this.movies.unshift(movie_clone)
      }
    },
    async send_edited_movie (edited_movie) {
      var movie_clone=Object.assign({}, edited_movie);

      const res =await axios.put('/api/movie/' + edited_movie.id_movie, {
        title : edited_movie.title, 
        release_date : edited_movie.release_date, 
        plot : edited_movie.plot, 
        poster : edited_movie.poster, 
        id_user : this.current_user.id_user 
      })
      if (res.data==1){
        const index = this.movies.findIndex(movie => movie.id_movie === movie_clone.id_movie)
        this.movies[index].title = movie_clone.title
        this.movies[index].release_date = movie_clone.release_date
        this.movies[index].plot = movie_clone.plot
        this.movies[index].poster = movie_clone.poster
      }
    },
    async delete_movie (id_movie) {
      const res = await axios.delete('/api/movie/' + id_movie + "/" + this.current_user.id_user)
      if (res.data==1){
        const index = this.movies.findIndex(movie => movie.id_movie === id_movie)
        this.movies.splice(index, 1)
      }
    },
    async notation(film){
      const res = await axios.post('/api/notation', {Note : film.Note, Avis : film.Avis
        , Id_film : film.id_film, id_user : this.current_user.id_user })
    },
    async get_avis(id_film){
      const res = await axios.post('/api/get_avis', {id_film : id_film})
      this.all_ratings=res.data
      console.log(res.data)
    },
    async get_moyenne(id_film){
      const res = await axios.post('/api/get_moyenne', {id_film : id_film})
      //console.log(res.data)
      return res.data
    },
  }
})
