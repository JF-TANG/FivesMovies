<template>
  <div>
    <form @submit.prevent="search_movies">
        <input type="text" v-model="key_words" placeholder="Recherche" required>
        <button type="submit">Rechercher</button>
    </form>
    Film récemments ajoutés<br>
    <br>
    
    <div v-for="movie in recent_movies" :key="movie.id_movie">
      <div class="movie-img" @click="goToMovie(movie.id_movie)">
        <div :style="{ backgroundImage: 'url(' + movie.poster + ')' }">
        </div>
      </div>
      <div class="movie-title">
        <h2>{{ movie.title }} - {{ movie.release_date }}</h2>
      </div>
      <p>{{ movie.plot }}</p>
    </div>
    <br>
    Nombre de films dans la base de données : {{number_movies}}
</template>

<script>
module.exports = {
  props: {
    recent_movies: { type: Array },
    number_movies: { type: Number }
  },
  data () {
    return {
      key_words:''
    }
  },
  methods: {
    goToMovie(id_movie) {
      router.push('/movie/'+id_movie).catch(() => {})
    },
    search_movies () {
      this.$emit('search_movies', this.key_words)
    },
  }
}
</script>

<style scoped>
body {
    background: 'url(image/dégradé_gris.jpg)';
    font-family: monospace, serif;
}

form {
    border: 3px solid;
}

nav a {
    font-weight: normal;
    font-family: serif;
    text-transform: capitalize;
}

header h1 {
    font-family: 'ballparkweiner';
    font-size: 24px;
}

input[type=text] {
    width:100%;
    display: flex;
    border: 1px solid;
}

button {
    color:white;
    border: none;
    cursor: pointer;
    width: 100%;
}

.header {
    padding: 30px;
    text-align: center;
    color: white;
    font-size: 30px;
}
.movie-img div {
  height:200px;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
