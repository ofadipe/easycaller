 <template>
  <v-container>


    <v-flex xs12 sm6 md3 v-if="chatData !==null && userNumber !==null">
        <v-layout row wrap>
      <v-flex sm12>
        <div v-bind:class="{'text-xs-right': message.number !== userNumber}" v-for="(message,index) in chatData.messages" v-bind:key="index">
          <v-chip>{{message.message}}</v-chip>
        </div>
      </v-flex>
      </v-layout>
      <v-text-field label="type your Message" placeholder="Message Here" v-model="message"></v-text-field>
      <v-btn class="orange" v-on:click="pushMessage()">Send a message</v-btn>
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
    <v-flex xs12 sm6 md3 v-else>
      Call does not exist!
      </v-flex>
  </v-container>
</template> a page to put the other persons mobile

and the other page to have the text field and button

<script>
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'
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
      message: ""
    }
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
    pushMessage() {
      console.log('sending message');
      const formData = new FormData();
      formData.append("number", this.insertedNumber);
      formData.append("message", this.message );
      formData.append("chat_id", this.chatData._id)
      this.$axios.put('/api/chats/message', formData)
      .then(response => {
        console.log(response);
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
    }
  }
}
</script>

<style>
</style>
