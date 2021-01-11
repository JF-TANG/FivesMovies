<template>
    <div>
        <h1 v-if='movie_result[0] !== undefined'>{{ movie_result[0].title }}</h1>    
        <img v-if='movie_result[0] !== undefined' v-bind:src="movie_result[0].poster"> 
        <p v-if='movie_result[0] !== undefined'>Date de sortie : {{ movie_result[0].release_date }}</p>
        <p v-if='movie_result[0] !== undefined'>Synopsis : {{ movie_result[0].plot }}</p>
        <p v-if='moyenne[0] !== undefined'>{{ Math.round(moyenne[0].avg) }}☆</p>
        <form @submit.prevent="noter">
            <input type="number" v-model="film.Note" id="note" placeholder="Note" required>
            <input type="text" v-model="film.Avis" id="avis" placeholder="Avis">
            <button type="submit">Noter ce film</button>
        </form>
        
        <div v-if='all_ratings[0] !== undefined'>
            <h2>Avis :</h2>
            <div v-for="avis in all_ratings">
                <p>pseudo : {{ avis.username }}</p>
                <p>{{ avis.rating }}☆</p>
                <p>Commentaire : {{ avis.comment }}</p>
            </div>
        </div>
    </div>
</template>
<script>
module.exports = {
    mounted:function(){
    this.$emit('get_movie_by_id', [router.app._route.params.id_movie][0])
    this.$emit('get_avis',[router.app._route.params.id_movie][0])
    this.$emit('get_moyenne',[router.app._route.params.id_movie][0])
    //console.log(all_ratings)
  },
  props: {
    movie_result: { type: Array },
    all_ratings: { type: Array },
    moyenne: { type: Array },
  },
  data () {
    return {
        Liste_avis: [],
        Moyenne: '',
        film: {
            Nom_film: '',
            Id_film: '',
            Note: '',
            Avis: '',
        },
        movie_id:''
    }
  },/*
  created() {
    this.film.Nom_film = "Star Wars"
    var url = window.location.href
    console.log(url)
    //url.searchParams.get("id_film");
    this.Moyenne = url.searchParams.get("id_film")
    this.film.Id_film = 1
    var movie_id = [router.app._route.params.id_movie][0]
    console.log(movie_id)
    this.$emit('get_movie_by_id', movie_id)
  },*/
  methods: {
      noter() {
          var data = {
            id_film: [router.app._route.params.id_movie][0],
            Note: this.film.Note,
            Avis: this.film.Avis,
          }
          this.$emit('notation', data)
      },/*
      getUsername(id) {
          var id_user = id
          return [this.$emit('get_username', id_user)][0].username
      }*/
  }
}

</script>