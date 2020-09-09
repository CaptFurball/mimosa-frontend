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
                            type="url"
                            v-model="link"
                            label="Link"
                            required>
                        </v-text-field>

                        <v-text-field
                            v-model="tags"
                            label="Tags (Comma seperate eg: 'startup,vimigo')"
                            required>
                        </v-text-field>

                        <v-btn block :disabled="!status || !link" v-on:click="postStatus()">
                            Post
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
        status: null,
        tags: null,
        link: null
    }),
    methods: {
        postStatus: function () {
            this.$server.post('api/user/post/link', {
                body: this.status,
                url: this.link,
                tags: this.tags
            }).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.status = null;
                    this.tags = null;

                    this.$refs.notify.show('Story posted!');

                    setTimeout(() => { this.$router.push('/user/' + this.$store.state.user.id) }, 3000);
                } else if (resp.data.status === 'REJECTED') {
                    this.$refs.notify.show('Your post was reject, please check your form again');
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