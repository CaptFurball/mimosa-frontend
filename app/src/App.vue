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

                <v-list-item link v-on:click="$router.push('/popular')">
                    <v-list-item-action>
                        <v-icon>mdi-fire</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Popular</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link v-on:click="$router.push('/discussed')">
                    <v-list-item-action>
                        <v-icon>mdi-chat</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Most Talked</v-list-item-title>
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

            <v-btn text 
                v-if="$store.state.authenticated" 
                @click="$router.push('/user/' + $store.state.user.id)">
                {{ $store.state.user.name }}
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view :key="$route.path"></router-view>
        </v-main>

        <v-footer color="indigo" app>
            <v-row justify="end">
                <v-speed-dial
                    v-model="fab"
                    :bottom="true"
                    :right="true">

                    <template v-slot:activator>
                        <v-btn
                        v-model="fab"
                        color="blue darken-2"
                        dark
                        fab
                        >
                        <v-icon v-if="fab">mdi-close</v-icon>
                        <v-icon v-else>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    
                    <v-btn
                        fab
                        dark
                        small
                        color="green"
                        @click="$router.push('/status')">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                        fab
                        dark
                        small
                        color="indigo"
                        @click="$router.push('/photo')">
                        <v-icon>mdi-image</v-icon>
                    </v-btn>

                    <v-btn
                        fab
                        dark
                        small
                        color="orange"
                        @click="$router.push('/video')">
                        <v-icon>mdi-video</v-icon>
                    </v-btn>

                    <v-btn
                        fab
                        dark
                        small
                        color="pink"
                        @click="$router.push('/link')">
                        <v-icon>mdi-link</v-icon>
                    </v-btn>
                </v-speed-dial>
            </v-row>
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
        snackbarText: '',
        fab: false,
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