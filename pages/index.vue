 <template>
  <v-container>
    <v-flex xs12 sm6 md3>
      Insert your phone number:
      <vue-tel-input
      v-model="caller"
      :preferredCountries="preferredCountries"
      defaultCountry="GB"
      ></vue-tel-input>

      Insert the person you intend to call number:
      <vue-tel-input
      v-model="receiver"
      :preferredCountries="preferredCountries"
      defaultCountry="GB"></vue-tel-input>

      <v-btn class="orange" v-on:click="callSet">Press me to call</v-btn>
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
      caller: '',
      receiver: '',
      preferredCountries: [
        'GB'
      ]
    }
  },
  methods: {
    callSet() {
      //Initalise the POST data for the API
      const formData = new FormData();
      formData.append("caller", this.caller);
      formData.append("receiver", this.receiver);
      this.$axios.post("/api/chats", formData)
      .then(response => {
        console.log(response);
        this.$router.push('/call/' + response.data._id)
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
}
</script>

<style>
</style>
