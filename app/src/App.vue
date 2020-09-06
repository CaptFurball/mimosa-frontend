<template>
    <v-app id="app">
        <v-navigation-drawer v-model="drawer" app>
            <v-list dense>
                <v-list-item link v-on:click="$router.push('/')">
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Mimosa</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn icon v-on:click="$router.push('/login')">
                <v-icon>mdi-account</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>

        <v-footer color="indigo" app>
            <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        props: {
            source: String,
        },
        created () {
            this.$server.get('sanctum/csrf-cookie');
        },
        data: () => ({
            drawer: null,
        }),
    }
</script>