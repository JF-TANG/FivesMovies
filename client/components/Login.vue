<template>
    <div>
        <form @submit.prevent="login">
            <h2>Connexion</h2>
            <input type="text" v-model="user.email" placeholder="Email" required>
            <input type="password" v-model="user.password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
        </form>
        <button><a href="./#/register">Pas encore inscrit ?</a></button>
    </div>
</template>
 
<script>
module.exports = {
  props: {
    articles: { type: Array, adefault: [] },
    panier: { type: Object },
  },
  data () {
    return {
      user: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    login () {
      this.$emit('login', this.user)
    },
  }
}
</script>
 
<style>
</style>
