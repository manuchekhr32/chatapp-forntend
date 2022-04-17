<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from "axios";
export default {
  async mounted() {
    const user = this.$store.getters.getUser;

    if (typeof user != 'object') {
      localStorage.setItem('authorization', '{}')
    } 

    else if (Object.keys(user).includes('username') && Object.keys(user).includes('_password')) {
      try {
        await axios.post(`http://${window.location.hostname}:9000/auth/check`, user)
      }
      catch (e) {
        if (e.response.status == 404) {
          this.$store.dispatch('setUser', {})
        }
      }
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    console.log(process.env.TEST);
  }
}
</script>