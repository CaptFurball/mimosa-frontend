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
           
            <notification ref="notify"></notification>
        </v-container>
    </div>
</template>

<script>
import Notification from '../Notification';

export default {
    components: {
        'notification': Notification
    },
    data: () => ({
        email: null,
        password: null,
        loginBtnDisabled: false
    }),
    methods: {
        login: function () {
            this.loginBtnDisabled = true;

            this.$server.post('login', {
                email: this.email,
                password: this.password
            }).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.$store.dispatch('onSuccessLogin', resp.data.message.user);

                    this.$refs.notify.show('Welcome back to Mimosa! Redirecting in 3s...');

                    setTimeout(() => { this.$router.push('/') }, 3000);
                } else if (resp.data.status === 'REJECTED') {
                    this.$refs.notify.show('Invalid credentials');
                    this.loginBtnDisabled = false;
                } else {
                    this.$refs.notify.unabledToPerformMessage();
                    this.loginBtnDisabled = false;
                }
            }).catch(() => {
                this.$refs.notify.unabledToPerformMessage();
            });
        }
    }
}
</script>