<template>
    <div>
        <v-container>
            <v-row>
                <v-col>
                     <v-form ref="form">
                        <v-text-field
                            v-model="status"
                            label="Status"
                            required>
                        </v-text-field>

                        <v-text-field
                            v-model="tags"
                            label="Tags (Comma seperate eg: 'startup,vimigo')"
                            required>
                        </v-text-field>

                        <v-btn block :disabled="!status || !tags" v-on:click="postStatus()">
                            Post
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
        status: null,
        tags: null,
        snackbarTimeout: 2000,
        snackbar: false,
        snackbarText: ''
    }),
    methods: {
        postStatus: function () {
            this.$server.post('api/user/post/status', {
                body: this.status,
                tags: this.tags
            }).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.status = null;
                    this.tags = null;

                    this.snackbar = true;
                    this.snackbarText = 'Status post successful, redirecting to home in 3s...';

                    setTimeout(() => { this.$router.push('/') }, 3000);
                } else if (resp.data.status === 'REJECTED') {
                    this.snackbar = true;
                    this.snackbarText = 'Post reject, please check your form';
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