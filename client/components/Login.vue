<template>
    <div>
      <template v-if="current_user.username == null">
        <form @submit.prevent="login">
            <h2>Connexion</h2>
            <input type="text" v-model="user.email" placeholder="Email" required>
            <input type="password" v-model="user.password" placeholder="Mot de passe" required>
            <button type="submit">Se connecter</button>
            {{login_error.message}}
        </form>
        <button><a href="./#/register">Pas encore inscrit ?</a></button>
      </template>
      <template v-else>
        <div>Vous êtes connecté en tant que {{ current_user.username }}</div>
      </template>
    </div>
</template>
 
<script>
module.exports = {
  props: {
    current_user:{ type: Object },
    login_error:{type : Object}
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