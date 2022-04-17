<template>
  <div class="chat-field">
    <!-- <div class="drag-bg" v-show="dragging">
      <div class="drag-bg__centered">
        <span>
          <p>Drag here</p>
          <p class="info" id="drag-info">File: </p>
        </span>
      </div>
    </div> -->
    
    <div class="alert-msg" v-show="tf.sending">{{ tf.text }}</div>

    <div class="chat-field__main">
      <div class="title">
        <p class="name">{{ user.firstName }} {{ user.lastName }}</p>
        <p class="username">@{{ user.username }}</p>
      </div>

      <div class="messages">
        <div 
          class="msg-cont"
          :class="{'msg-cont--isme': msg.from == $store.getters.getUser.id}" 
          v-for="(msg, ind) in messages" 
          :key="ind">

          <span @dblclick="deleteMessage(ind, msg.id)">
            <div class="msg-cont__card" v-if="!msg.file">
              <p class="text">
                {{ msg.text }} 
                <span class="pencil" @click="editMessage(ind, msg.id)" v-if="msg.from == $store.getters.getUser.id">✏️</span>
              </p>
              <p class="info"><i v-if="msg.createdAt !== msg.updatedAt">updated</i> {{ date(msg.createdAt) }}</p>
            </div>

            <div v-else class="msg-cont__card msg-cont__card--file">
              <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z"/></svg>
              </div>
              <div class="body">
                <p class="text">{{ msg.text }}</p>
                <p class="file-info">{{ filesize(jsonFilter(msg.file).size) }}</p>
                <a :href="`http://localhost:9000/files/${jsonFilter(msg.file).name}`" target="_blank" download>
                  <button class="download-btn">Download</button>
                </a>
                <p class="info">{{ date(msg.createdAt) }}</p>
              </div>
            </div>
          </span>
          
        </div>
      </div>

    </div>
    <div class="chat-field__typing">
      <form action="" @submit.prevent="sendMessage()">
        <textarea 
          v-model="newMessage" 
          @keyup.ctrl.enter="sendMessage()"
          name="" id="" cols="30" rows="10" 
          placeholder="Message (Ctrl + Enter)">
        </textarea>
        <input type="file" id="fileUP" @change="sendFile" class="file_input">
        <button type="submit">{{ mode == 'sendMessage' ? 'Send' : 'Edit' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    messages: [],
    newMessage: '',
    ws: '',
    user: {},
    clientHere: true,
    tf: {
      sending: false,
      text: ''
    },
    dragging: false,
    mode: 'sendMessage',
    edittingMessage: {
      id: '',
      index: ''
    }
  }),

  async mounted() {
    try {
      const result = await axios({
        method: 'get',
        url: `https://chatappexpressmn.herokuapp.com/message/get/${this.$route.params.username}`,
        headers: {
          authorization: localStorage.getItem('authorization')
        }
      })
      this.messages = result.data.messages;
      this.user = result.data.user;
      document.title = `${this.$store.getters.getUser.username} | @${this.user.username}`
      this.scrollBottom()
    } 
    catch (e) {
      if (!e.response.data.error) return this.$router.push({ name: 'login'})
      alert(e.response.data.error)
      this.$router.push('/')
    }

    // Socket
    const ws = new WebSocket(`ws://chatappexpressmn.herokuapp.com`);
    this.ws = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'join',
        from: this.$store.getters.getUser.id,
        to: this.user.id
      }))
    }

    ws.addEventListener('message', message => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case 'newMessage':
          this.messages.push(data.body);
          this.scrollBottom();
          
          if (data.from !== this.user.id) {
            this.tf.text = "File sent!"
            setTimeout(() => {
              this.tf.sending = false
            }, 2000);
          }
    
          if (!this.clientHere) {
            new Notification(`Message from: @${this.user.username}`, {
              body: data.body.text,
            }).onclick = (e) => {
              e.preventDefault();
              window.focus()
            }
          }
          break;
        
        case 'deleteMessage':
          this.messages.splice(data.body.msgIndex, 1);
          break;

        case 'editMessage':
          this.messages[data.body.msgIndex].text = data.body.message.text;
          this.messages[data.body.msgIndex].updatedAt = data.body.message.updatedAt;
          break;

        case 'error':
          console.log(data.body);
          alert(data.body.error)
          break;
      }
    })
    
    // Window events
    window.addEventListener('focus', () => {
      this.clientHere = true;
    })
    window.addEventListener('blur', () => {
      this.clientHere = false;
    })
    this.scrollBottom();

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    })

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation()
      this.sendFile({
        target: {
          files: e.dataTransfer.files
        }
      })
    })
  },

  methods: {
    sendMessage() {
      if (this.newMessage.length == 0) return alert("Enter message")
      const message = {
        type: this.mode,
        from: this.$store.getters.getUser.id,
        to: this.user.id,
        text: this.newMessage,
      }
      if (this.mode == 'editMessage') {
        message.msgID = this.edittingMessage.id;
        message.msgIndex = this.edittingMessage.index;
      }
      this.ws.send(JSON.stringify(message));
      this.newMessage = '';
      this.scrollBottom();
      this.edittingMessage = {}
      this.mode = 'sendMessage';
    },

    date(dateString) {
      const d = new Date(dateString);
      return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} ${this.time(dateString)}`
    },

    time(timeString) {
      const d = new Date(timeString);
      const h = d.getHours();
      const m = d.getMinutes();
      return `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}`
    },

    scrollBottom() {
      setTimeout(() => {
        const elm = document.querySelector('.chat-field__main');
        elm.scrollTop = elm.scrollHeight
      }, 0);
    },

    async sendFile(e) {
      const file = e.target.files[0];
      if (file.size / 1024 / 1024 > 100) return alert("File size is bigger than 100MB!")
      const read = new FileReader();
      read.readAsBinaryString(file);
      read.onprogress = (e) => {
        this.tf.sending = true
        this.tf.text = `Sending file (${Math.round(e.loaded / e.total * 100)}%)`
        if (e.loaded == e.total) this.tf.text = "Please wait..."
      }
      read.onload = () => {
        this.ws.send(JSON.stringify({
          type: 'sendFile',
          from: this.$store.getters.getUser.id,
          to: this.user.id,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            data: read.result
          },
        }))
      }
      read.onloadend = () => {
        document.getElementById("fileUP").value = ''
      }
    },

    deleteMessage(index, msgID) {
      if (this.messages[index].from == this.user.id) return;
      if (!confirm("This message will be removed. Are you sure?")) return;

      this.ws.send(JSON.stringify({
        type: 'deleteMessage',
        from: this.$store.getters.getUser.id,
        to: this.user.id,
        msgIndex: index,
        msgID: msgID
      }))
    },

    editMessage(index, msgID) {
      this.mode = 'editMessage';
      this.edittingMessage.id = msgID;
      this.edittingMessage.index = index;
      this.newMessage = this.messages[index].text;
    },

    jsonFilter(data) {
      return JSON.parse(data)
    },

    filesize(size) {
      return size / 1000000 < 1 ? `${Math.floor(size / 1000)}KB` : `${Math.floor(size / 1000000)}MB`
    }
  },

  unmounted() {
    document.removeEventListener('dragover', (e) => {
      e.preventDefault();
    })
    document.removeEventListener('drop', (e) => {
      e.preventDefault();
    })
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.getters.isUser) return vm.$router.push({name: 'login'})
      return true
    })
  }
}
</script>

<style lang="sass" src="@/assets/styles/chat-field.sass"></style>