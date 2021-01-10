<template>
    <div>
        <template v-if="current_user.username == null">
          <form @submit.prevent="register">
              <h2>Création de compte</h2>
              <input type="text" v-model="user.username" placeholder="Pseudo" required>
              <input type="text" v-model="user.email" placeholder="Email" required>
              <input type="password" v-model="user.password" placeholder="Mot de passe" required>
              <button type="submit">S'enregistrer</button>
          </form>
        </template>
        <template v-else>
          <div>Vous êtes connecté en tant que {{ current_user.username }}</div>
        </template>
    </div>
</template>
 
<script>
module.exports = {
  props: {
    current_user:{ type: Object }
  },
  data () {
    return {
      user: {
        username:'',
        email: '',
        password: '',
      },
    }
  },
  methods: {
    register () {
      this.$emit('register', this.user)
    },
  }
}
</script>
 
<style>
</style>
