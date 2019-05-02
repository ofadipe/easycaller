<template>
<nav>
    <v-toolbar app dark class="pink">
        <v-toolbar-side-icon  @click="drawer = !drawer" class="blue--text">

        </v-toolbar-side-icon>
        <v-toolbar-title>

            <span> EasyCaller</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-title>
          <span> Making calls for everyone</span>
        </v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" class="primary">
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: 'home', text: 'Home', route: '/' },
      ]
    }
  }
}
</script>
