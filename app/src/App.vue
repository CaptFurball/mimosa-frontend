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

                <v-list-item v-if="$store.state.authenticated" link v-on:click="logout()">
                    <v-list-item-action>
                        <v-icon>mdi-logout-variant</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Mimosa</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn v-if="!$store.state.authenticated" icon v-on:click="$router.push('/login')">
                <v-icon>mdi-account</v-icon>
            </v-btn>

            <div v-if="$store.state.authenticated">{{ $store.state.user.name }}</div>
        </v-app-bar>

        <v-main>
            <router-view></router-view>
        </v-main>

        <v-footer color="indigo" app>
            <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>

        <v-snackbar
            v-model="snackbar"
            :timeout="snackbarTimeout">
            {{ snackbarText }}

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
    export default {
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
            snackbarTimeout: 2000,
            snackbar: false,
            snackbarText: ''
        }),
        created () {
            this.$server.get('sanctum/csrf-cookie');

            this.$server.get('api/user').then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.$store.dispatch('onSuccessLogin', resp.data.message.user);
                } else {
                    this.$store.dispatch('onLogout');
                    this.$router.push('/');
                    this.snackbarText = 'You have logged out';
                    this.snackbar = true;
                }
            });
        },
        methods: {
            logout () {
                this.$server.get('logout').then(() => {
                    this.$store.dispatch('onLogout');
                });
            }
        }
    }
</script>