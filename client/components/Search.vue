<template>
  <div>
    <form @submit.prevent="search_movies">
        <input type="text" v-model="key_words" placeholder="Recherche" required>
        <button type="submit">Rechercher</button>
    </form>
    Résultats de recherche<br>
    <br>
    <template v-if="search_result === undefined || search_result.length == 0">
        Aucun film ne correspond à votre recherche
    </template>
    <template v-else>
        <div v-for="movie in search_result" :key="movie.id_movie">
        <div class="movie-img">
            <div :style="{ backgroundImage: 'url(' + movie.poster + ')' }">
            </div>
        </div>
        <div class="movie-title">
            <h2>{{ movie.title }} - {{ movie.release_date }}</h2>
        </div>
        <p>{{ movie.plot }}</p>
        </div>
    </template>
</template>

<script>
module.exports = {
  props: {
  search_result: { type: Array }
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
  cursor: pointer;
}
</style>
