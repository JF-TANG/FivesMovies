<template>
  <div>
    <form @submit.prevent="add_movie">
      <h2>Vous n'avez pas trouvez votre film ?<br>
      Ajoutez le !
      </h2>
      <input type="text" v-model="new_movie.title" placeholder="Titre du film" required>
      <input type="number" v-model="new_movie.release_date" placeholder="Date de sortie" required>
      <textarea type="text" v-model="new_movie.plot" placeholder="Description" required></textarea>
      <input type="text" v-model="new_movie.poster" placeholder="Lien vers l'image">
      <button type="submit">Ajouter</button>
    </form>

    <template v-if="movies === undefined || movies == 0">
        Vous n'avez ajoutez aucun films
    </template>
    <template v-else>
        <div v-for="movie in movies" :key="movie.id_movie">
        <div class="movie-img">
            <div :style="{ backgroundImage: 'url(' + movie.poster + ')' }">
            </div>
        </div>
        <div class="movie-title">
            <h2>{{ movie.title }} - {{ movie.release_date }}</h2>
            <div>
              <button @click="delete_movie(movie.id_movie)">Supprimer</button>
              <button @click="editArticle(movie)">Modifier</button>
            </div>
        </div>
        <p>{{ movie.plot }}</p>
        </div>
    </template>
  </div>
</template>

<script>

module.exports = {
  mounted:function(){
    this.$emit('get_user_movies')
  },
  props: {
    current_user: { type: Object },
    movies:{type : Array}
  },
  data () {
    return {
      new_movie: {
        title: '',
        release_date: '',
        plot: '',
        poster: ''
      },
      edit_movie: {
        title: '',
        release_date: '',
        plot: '',
        poster: ''
      }
    }
  },
  methods: {
    add_movie () {
      this.$emit('add_movie', this.new_movie)
    },
    delete_movie (id_movie) {
      this.$emit('delete_movie', id_movie)
    },
    editArticle (article) {
      this.editingArticle.id = article.id
      this.editingArticle.name = article.name
      this.editingArticle.description = article.description
      this.editingArticle.image = article.image
      this.editingArticle.price = article.price
    },
    sendEditArticle () {
      this.$emit('update-article', this.editingArticle)
      this.abortEditArticle()
    },
    cancel_edit_movie() {
      this.edit_movie = {
        title: '',
        release_date: '',
        plot: '',
        poster: ''
      }
    }
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
