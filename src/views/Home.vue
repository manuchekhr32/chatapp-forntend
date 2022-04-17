<template>
  <div class="">
    <div class="center-middle">
      <div class="center-middle__centered">
        <h1>Chat app</h1>
        <p v-if="Object.keys($store.getters.getUser).length >= 2">Current user: {{ $store.getters.getUser.username }}</p>
        <input @keyup.enter='chat()' v-model="username" type="text" style="width: 400px" class="input my-1" placeholder="Enter username">
        <button @click="chat()" class="btn" style="width: 400px">{{ btnText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    username: '',
    btnText: 'Chat'
  }),

  methods: {
    async chat() {
      if (this.username.toLowerCase() == this.$store.getters.getUser.username) return alert("It's you!")
      try {
        this.btnText = 'Please wait...';
        const result = await axios.get(`http://${window.location.hostname}:9000/user/get/${this.username.toLowerCase()}`)
        if (result.status == 200) {
          this.$router.push({
            name: 'chat',
            params: {
              username: result.data.username
            }
          })
        }
        else {
          alert("Something wrong!");
        }
      }
      catch(err) {
        alert(err.response.data.message)
      }
      this.username = ''
      this.btnText = 'Chat';
    }
  }
}
</script>