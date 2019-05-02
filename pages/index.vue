 <template>
  <v-container  bg fill-height grid-list-md text-xs-center>
    <v-layout row wrap align-center>
<v-flex xs12 sm6 offset-sm3 text-xs-center>
      <v-card>
        <v-card-title primary-title>
          <div class='center--box'>
            <h3 class="headline mb-0">Start a call</h3>

              Insert your phone number:
              <vue-tel-input
                v-model="caller"
                :preferredCountries="preferredCountries"
                defaultCountry="GB"
              ></vue-tel-input>
              <br>Insert  the person you intend to call number:
              <vue-tel-input
                v-model="receiver"
                :preferredCountries="preferredCountries"
                defaultCountry="GB"
              ></vue-tel-input>

          </div>
        </v-card-title>

        <v-card-actions>
          <div class="center--box">
          <v-btn class="orange" v-on:click="callSet">Press me to call</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-flex>
    </v-layout>

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
      preferredCountries: ['GB']
    }
  },
  methods: {
    callSet() {
      //Initalise the POST data for the API
      const formData = new FormData()
      formData.append('caller', this.caller)
      formData.append('receiver', this.receiver)
      this.$axios
        .post('/api/chats', formData)
        .then(response => {
          console.log(response)
          this.$router.push('/call/' + response.data._id)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style>
.center--box {
  margin: 0 auto ;
}
</style>
