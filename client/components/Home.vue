<template>
  <div>
    <form @submit.prevent="search_movies">
        <input type="text" v-model="key_words" placeholder="Recherche" required>
        <button type="submit">Rechercher</button>
    </form>
    Film récemments ajoutés<br>
    <br>
    
    <div v-for="movie in recent_movies" :key="movie.id_movie">
      <div class="movie-img">
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
    search_movies () {
      this.$emit('search_movies', this.key_words)
    },
  }
}
</script>

<style scoped>
.movie-img div {
  height:200px;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
