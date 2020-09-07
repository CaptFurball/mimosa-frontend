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

                        <v-btn block :disabled="loginBtnDisabled" v-on:click="login()">
                            Login
                        </v-btn>
                    </v-form>
                </v-col>
            </v-row>
           
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
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        email: null,
        password: null,
        loginBtnDisabled: false,
        snackbarTimeout: 2000,
        snackbar: false,
        snackbarText: ''
    }),
    mounted () {
        console.log(this.$store.state.authenticated);
        console.log(this.$store.state.user.name);
    },
    methods: {
        login: function () {
            this.loginBtnDisabled = true;

            this.$server.post('login', {
                email: this.email,
                password: this.password
            }).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.$store.dispatch('onSuccessLogin', resp.data.message.user);

                    this.snackbar = true;
                    this.snackbarText = 'Welcome back to Mimosa! Redirecting in 3s..';

                    setTimeout(() => { this.$router.push('/') }, 3000);
                } else if (resp.data.status === 'REJECTED') {
                    this.snackbar = true;
                    this.snackbarText = 'Invalid credentials';
                    this.loginBtnDisabled = false;
                } else {
                    this.snackbar = true;
                    this.snackbarText = 'Server error';
                    this.loginBtnDisabled = false;
                }
            }).catch(() => {
                this.snackbar = true;
                this.snackbarText = 'Server error';
            });
        }
    }
}
</script>