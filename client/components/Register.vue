<template>
    <div>
        <form @submit.prevent="addUser">
            <h2>Création de compte</h2>
            <input type="text" v-model="user.username" placeholder="Pseudo" required>
            <input type="text" v-model="user.email" placeholder="Email" required>
            <input type="password" v-model="user.password" placeholder="Mot de passe" required>
            <button type="submit">S'enregistrer</button>
        </form>
    </div>
</template>
 
<script>
module.exports = {
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
    addUser () {
      this.$emit('add-user', this.user)
    },
  }
}
</script>
 
<style>
</style>
