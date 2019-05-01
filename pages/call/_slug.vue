 <template>
  <v-container>
    <v-flex xs12 sm6 md3 v-if="chatData !==null && userNumber !==null">
      <template v-if='chatData.ended == false'>
  <v-layout row wrap class="chat">
        <v-flex sm12>
          <div
            v-bind:class="{'text-xs-right': message.number !== userNumber}"
            v-for="(message,index) in chatData.messages"
            v-bind:key="index"
          >
            <v-chip>
              <div class="message__bubble">
                <span class="message">{{message.message}}</span>
                <span class="time">Sent: {{message.time}}</span>
              </div>
              <v-btn flat icon color="pink" v-on:click="listenMessage(message.message)">
                <v-icon>volume_up</v-icon>
              </v-btn>
            </v-chip>
          </div>
        </v-flex>
      </v-layout>
      <div class="message__input">
        <vue-speech @onTranscriptionEnd="onEnd" class="speech"/>
        <v-text-field label="type your Message" placeholder="Message Here" v-model="message"></v-text-field>
        <v-btn class="orange" v-on:click="pushMessage()">Send a message</v-btn>
        <v-btn flat icon color="pink" v-on:click="mute = !mute">
          <v-icon v-if="!mute">mic</v-icon>
          <v-icon v-else>mic_off</v-icon>
        </v-btn>
        <v-btn flat icon color="pink" v-on:click="voiceMute = !voiceMute">
          <v-icon v-if="!voiceMute">volume_up</v-icon>
          <v-icon v-else>volume_off</v-icon>
        </v-btn>
         <v-btn flat icon color="pink" v-on:click="endCall()">
          <v-icon>call_end</v-icon>

        </v-btn>
      </div>
      </template>
      <template v-else>
        The call has ended
      </template>
    </v-flex>
    <v-flex xs12 sm6 md3 v-else-if="chatData !==null && userNumber == null">
      <!-- Check the Phone Number -->
      Please insert your number to enter the chat
      <vue-tel-input
        v-model="insertedNumber"
        :preferredCountries="preferredCountries"
        defaultCountry="GB"
        v-on:input="numberChecker()"
      ></vue-tel-input>
    </v-flex>
    <v-flex xs12 sm6 md3 v-else>Call does not exist!</v-flex>
  </v-container>
</template> a page to put the other persons mobile

and the other page to have the text field and button

<script>
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'

import socket from '~/plugins/socket-local.js'

export default {
  components: {
    VueTelInput
  },
  data() {
    return {
      chatData: null,
      userNumber: null,
      insertedNumber: '',
      preferredCountries: ['GB'],
      message: '',
      mute: true,
      voiceMute: false
    }
  },
  beforeMount() {
    socket.on('newMessage', message => {
        if(message._id == this.chatData._id) {
      this.chatData.messages.push(message)

      if (this.voiceMute !== true) {
        var msg = new SpeechSynthesisUtterance(message.message)
        window.speechSynthesis.speak(msg)
      }

      this.scrollBottom()
      }
    })
     socket.on('callEnded', message => {
       if(message._id == this.chatData._id) {
      this.chatData.ended = true
      }
    })
  },
  created() {
    // Getting the chat data
    this.$axios
      .get('/api/chats/find/' + this.$route.params.slug)
      .then(response => {
        this.chatData = response.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    scrollBottom() {
      window.scrollTo(0, document.body.scrollHeight)
    },
    pushMessage(message) {
      console.log('sending message')
      const formData = new FormData()
      formData.append('number', this.insertedNumber)
      if (message == null) {
        if(this.message == '') {
          return
        }
        formData.append('message', this.message)
      } else {

        formData.append('message', message)

      }
      formData.append('chat_id', this.chatData._id)
      this.$axios
        .put('/api/chats/message', formData)
        .then(response => {
          console.log(response)
          this.message = ""
        })
        .catch(error => {
          console.log(error)
        })
    },
    numberChecker() {
      if (
        this.insertedNumber == this.chatData.caller ||
        this.insertedNumber == this.chatData.receiver
      ) {

        // If the number the user matches either one of the numbers that are part of the call, then we set the user number to that
        this.userNumber = this.insertedNumber


      } else {
        console.log('incorrect number')
      }
    },
    onEnd({ lastSentence, transcription }) {
      // `lastSentence` is the last sentence before the pause
      // `transcription` is the full array of sentences
      console.log(lastSentence)
      let voicedMessage = lastSentence
      if (this.mute !== true) {
        this.pushMessage(voicedMessage)
      }
    },
    listenMessage(messageString) {
      console.log(messageString)
      var msg = new SpeechSynthesisUtterance(messageString)
      window.speechSynthesis.speak(msg)
    },
    endCall() {
      console.log("call ended");
       console.log('sending message')
      const formData = new FormData()

      formData.append('chat_id', this.chatData._id)
      this.$axios
        .put('/api/chats/endcall', formData)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}

</script>

<style>
.message__bubble {
  display: flex;
  flex-direction: column;
}
.message {
  font-weight: 700;
}
.speech {
  display: none;
}

.message__input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #fff;
  display: flex;
  z-index: 5;
}

.message__input {
  z-index: 5;
}

.chat {
  padding-bottom: 150px;
}
</style>
