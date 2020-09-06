<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                     <v-form ref="form">
                        <v-text-field
                            v-model="email"
                            label="E-mail"
                            required>
                        </v-text-field>

                        <v-text-field
                            v-model="password"
                            type="password"
                            label="Password"
                            required>
                        </v-text-field>

                        <v-btn block v-on:click="login()">
                            Login
                        </v-btn>
                    </v-form>
                </v-col>
            </v-row>
           
            <v-snackbar
                v-model="snackbar"
                :timeout="snackbarTimeout"
                >
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
        </v-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            email: null,
            password: null,
            snackbarTimeout: 2000,
            snackbar: false,
            snackbarText: ''
        };
    },
    methods: {
        login: function () {
            this.$server.post('login', {
                email: this.email,
                password: this.password
            }).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    let user = resp.data.message.user;

                    // use vuex to commit
                } else if (resp.data.status === 'REJECTED') {
                    this.snackbar = true;
                    this.snackbarText = 'Invalid credentials';
                } else {
                    this.snackbar = true;
                    this.snackbarText = 'Server error';
                }
            }).catch(() => {
                this.snackbar = true;
                this.snackbarText = 'Server error';
            });
        }
    }
}
</script>