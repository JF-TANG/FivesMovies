<template>
  <div>
    <form @submit.prevent="add_movie">
      <h2>Vous n'avez pas trouvé votre film ?<br>
      Ajoutez le !
      </h2>
      <input type="text" v-model="new_movie.title" placeholder="Titre du film" required>
      <input type="number" v-model="new_movie.release_date" placeholder="Date de sortie" required>
      <textarea type="text" v-model="new_movie.plot" placeholder="Description" required></textarea>
      <input type="text" v-model="new_movie.poster" placeholder="Lien vers l'image">
      <button type="submit">Ajouter</button>
    </form>

    <template v-if="movies === undefined || movies == 0">
        Vous n'avez ajoutés aucun films
    </template>

    <template v-else>
        <div v-for="movie in movies" :key="movie.id_movie">
          
          <div class="movie-img" @click="goToMovie(movie.id_movie)">
              <div :style="{ backgroundImage: 'url(' + movie.poster + ')' }">
              </div>
          </div>

          <template v-if="editing_movie.id_movie == movie.id_movie">
            <input type="text" v-model="editing_movie.title" placeholder="Titre du film" required> - <input type="number" v-model="editing_movie.release_date" placeholder="Date de sortie" required>
            
            <p><textarea type="text" v-model="editing_movie.plot" placeholder="Description" required></textarea></p>
            <input type="text" v-model="editing_movie.poster" placeholder="Lien vers l'image">

            <div>
              <button @click="send_edited_movie()">Valider</button>
              <button @click="cancel_edit_movie()">Annuler</button>
            </div>
          </template>

          <template v-else>
            <div class="movie-title">
            
              <h2>{{ movie.title }} - {{ movie.release_date }}</h2>
            </div>
            <p>{{ movie.plot }}</p>
            <div>
                <button @click="delete_movie(movie.id_movie)">Supprimer</button>
                <button @click="edit_movie(movie)">Modifier</button>
            </div>
          </template>
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
    movies:{type : Array},
  },
  data () {
    return {
      new_movie: {
        title: '',
        release_date: '',
        plot: '',
        poster: ''
      },
      editing_movie: {
        id_movie: 0,
        title: '',
        release_date: '',
        plot: '',
        poster: ''
      }
    }
  },
  methods: {
    url (x) {
      return "./#/movie?id_film=" + x
      //onclick="this.href=url(movie.id_movie);"
    },
    goToMovie(id_movie) {
      router.push('/movie/'+id_movie).catch(() => {})
    },
    add_movie () {
      this.$emit('add_movie', this.new_movie)
    },
    delete_movie (id_movie) {
      this.$emit('delete_movie', id_movie)
    },
    edit_movie (movie) {
      this.editing_movie.id_movie = movie.id_movie
      this.editing_movie.title = movie.title
      this.editing_movie.release_date = movie.release_date
      this.editing_movie.plot = movie.plot
      this.editing_movie.poster = movie.poster
    },
    send_edited_movie () {
      this.$emit('send_edited_movie', this.editing_movie)
      this.cancel_edit_movie()
    },
    cancel_edit_movie() {
      this.editing_movie.id_movie=0
      this.editing_movie.title= ''
      this.editing_movie.release_date= ''
      this.editing_movie.plot= ''
      this.editing_movie.poster= ''
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
