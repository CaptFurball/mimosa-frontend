<template>
    <v-dialog v-model="dialog" width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Comments</span>
            </v-card-title>
            
            <v-card-text v-for="comment in content" :key="comment.id">
                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title><strong>{{ comment.user.name }}</strong> says:</v-list-item-title>
                        <v-list-item-content>{{ comment.body }}</v-list-item-content>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>

            <v-card-text v-if="content && content.length == 0" align="center">
                No comments found
            </v-card-text>

            <v-text-field v-model="comment" label="Post a comment"></v-text-field>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" :disabled="!comment" text @click="onComment(storyId)">Post a comment</v-btn>
                <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>

        <notification ref="notify"></notification>
    </v-dialog>
</template>

<script>
import Notification from './Notification';

export default {
    components: {
        'notification': Notification
    },
    props: ['comments', 'storyId'],
    data: () => ({
        dialog: false,
        comment: null,
        content: [],
    }),
    created () {
        this.content = this.comments;
    },
    methods: {
        onComment(storyId) {
            if (this.comment != null || this.comment != '') {
                this.$server.post('api/story/comment', {
                    story_id: storyId,
                    body: this.comment
                }).then((resp) => {
                    if (resp.data.status === 'SUCCESS') {
                        this.$emit('onComment');

                        this.content.push({
                            user: {
                                name: this.$store.state.user.name
                            },
                            body: this.comment,
                        });

                        this.$refs.notify.show('Comment posted!');
                        this.comment = null;
                    } else {
                        this.$refs.notify.unabledToPerformMessage();
                    }
                });
            }
        },
        show () {
            this.dialog = true;
        }
    }
}
</script>