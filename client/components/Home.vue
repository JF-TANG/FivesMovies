<template>
  <div>
    <article v-for="movie in movies" :key="movie.idMovie">
      <div class="article-img">
        <div :style="{ backgroundImage: 'url(' + movie.poster + ')' }">
        </div>
      </div>
      <div class="article-content" v-if="editingArticle.id !== movie.idMovie">
        <div class="article-title">
          <h2>{{ movie.title }} - {{ movie.releaseDate }}€</h2>
          <div>
          </div>
        </div>
        <p>{{ movie.plot }}</p>
      </div>
      <div class="article-content" v-else>
        <div class="article-title">
        </div>
    </article>
  </div>
</template>

<script>
module.exports = {
  props: {
    movies:{type: Array, default: []},
    articles: { type: Array, default: [] },
    panier: { type: Object }
  }
}
</script>

<style scoped>
article {
  display: flex;
}

.article-img {
  flex: 1;
}

.article-img div {
  width: 100px;
  height: 100px;
  background-size: cover;
}

.article-content {
  flex: 3;
}

.article-title {
  display: flex;
  justify-content: space-between;
}

textarea {
  width: 100%;
}
</style>
