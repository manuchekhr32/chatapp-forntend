<template>
  <div>
    <div class="center-middle">
      <div class="center-middle__centered" style="width: 400px">
          <h1 clas>Register</h1>
          <form action="" @submit.prevent="register()">
            <input required v-model="userData.firstName" type="text" class="input my-1 w-100" placeholder="First name">
            <input required v-model="userData.lastName" type="text" class="input my-1 w-100" placeholder="Last name">
            <input required v-model="userData.username" type="text" class="input my-1 w-100" placeholder="Username">
            <input required v-model="userData._password" type="password" class="input my-1 w-100" placeholder="Password">
            <button class="btn w-100">{{ btnText }}</button>
          </form>
          <router-link :to="{name: 'login'}">Do you have an account?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    userData: {
      username: '',
      _password: '',
      firstName: '',
      lastName: ''
    },
    btnText: 'Register'
  }),

  methods: {
    async register() {
      if (this.btnText == 'Register') {
        try {
          this.btnText = 'Please wait...';
          const result = await axios.post(`https://chatappexpressmn.herokuapp.com/auth/register`, this.userData)
          this.$store.dispatch('setUser', result.data)
          alert("Successfully registered!");
          this.$router.push('/')
        }
        catch(err) {
          alert(err.response.data.message)
        }
        this.btnText = 'Register';
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.getters.isUser) return vm.$router.push({name: 'home'})
      return true
    })
  }
}
</script>