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

                        <v-file-input @change="setPhoto" @clear="clearPhoto()" label="Photo"></v-file-input>
                        <small>Please make sure image size is less than 1mb</small>

                        <v-text-field
                            v-model="tags"
                            label="Tags (Comma seperate eg: 'startup,vimigo')"
                            required>
                        </v-text-field>

                        <v-btn block :disabled="!status || !photo" v-on:click="postStatus()">
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
        photo: null,
        tags: null
    }),
    methods: {
        setPhoto(file) {
            this.photo = file;
        },
        clearPhoto() {
            this.photo = null;
        },
        postStatus: function () {

            let formData = new FormData();
            formData.append('body', this.status);
            formData.append('photo', this.photo);

            if (this.tags) {
                formData.append('tags', this.tags);
            }

            this.$server.post('api/user/post/photo', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
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
                }
            }).catch(() => {
                this.$refs.notify.unabledToPerformMessage();
            });
        }
    }
}
</script>