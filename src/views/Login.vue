<template>
  <div>
    <div class="center-middle">
      <div class="center-middle__centered" style="width: 400px">
          <h1 clas>Login page</h1>
          <form action="" @submit.prevent="login()">
            <input v-model="username" type="text" class="input my-1 w-100" placeholder="Username">
            <input v-model="password" type="password" class="input my-1 w-100" placeholder="Password">
            <button class="btn w-100">{{ btnText }}</button>
          </form>
          <router-link :to="{name: 'register'}">Don't you have an account?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    username: '',
    password: '',
    btnText: 'Login'
  }),

  methods: {
    async login() {
      try {
        this.btnText = 'Logging in...';
        const result = await axios.post(`http://${window.location.hostname}:9000/auth/login`, {
          username: this.username,
          _password: this.password
        })
        this.$store.dispatch('setUser', result.data)
        alert("Authorized!");
        this.$router.push('/')

      }
      catch(err) {
        alert(err.response.data.message)
      }
      this.btnText = 'Login';
    }
  },
}
</script>