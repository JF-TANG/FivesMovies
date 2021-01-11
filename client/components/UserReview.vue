<template>
  <div>
    <h2>Vos avis</h2>

    <template v-if="reviews === undefined || reviews == 0">
        Vous n'avez fait aucun avis
    </template>

    <template v-else>
        <div v-for="review in reviews" :key="review.id_movie">  
            <div class="movie-img" @click="goToMovie(review.id_movie)">
                <div :style="{ backgroundImage: 'url(' + review.poster + ')' }">
                </div>
            </div>
            <div class="movie-title">
                <h2>{{ review.title }} - {{ review.release_date }}</h2>
            </div>
            <p>{{ review.plot }}</p>
            Votre avis : Note : {{review.rating}}☆ <br>
            {{review.comment}}
            <div>
                <button @click="delete_review(review.id_movie)">Supprimer</button>
            </div>
        </div>
    </template>
  </div>
</template>

<script>
module.exports = {
  mounted:function(){
    this.$emit('get_user_reviews')
  },
  props: {
    current_user: { type: Object },
    reviews:{type : Array},
  },
  data () {
    return {
    }
  },
  methods: {
    url (x) {
      return "./#/movie?id_film=" + x
    },
    goToMovie(id_movie) {
      router.push('/movie/'+id_movie).catch(() => {})
    },
    delete_review (id_movie) {
      this.$emit('delete_review', id_movie)
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
