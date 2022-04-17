<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from "axios";
export default {
  async mounted() {
    if (localStorage.getItem('authorization') == null) {
      this.$store.dispatch('setUser', '{}')  
    }
    
    const user = this.$store.getters.getUser;

    if (!this.$store.getters.isUser) {
      localStorage.setItem('authorization', '{}')
    } 

    else if (this.$store.getters.isUser) {
      try {
        await axios.post(`https://chatappexpressmn.herokuapp.com/auth/check`, user)
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
  },
}
</script>