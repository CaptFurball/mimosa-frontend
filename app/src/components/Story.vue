<template>
    <v-card class="ma-2" :color="cardColor" min-width="95%">
        <!-- Story body -->
        <v-card-text class="headline font-weight-bold">
            "{{ content.body }}" 
            
            <span class="ml-2" v-for="tag in content.tags" :key="tag.id">
                <a @click="$router.push('/tag/' +  tag.name)">#{{tag.name}}</a>
            </span>
        </v-card-text>

        <!-- Photo content -->
        <div v-if="!!content.photo">
            <v-img :src="storageUrl + content.photo.path" height="200px"></v-img>
        </div>

        <!-- Link content -->
        <div v-if="!!content.link">
            <v-img v-if="content.link.image_url" :src="content.link.image_url" height="200px"></v-img>

            <v-card-text class="headline">
                <a :href="content.link.url">{{ content.link.title? content.link.title: content.link.url }}</a>
            </v-card-text>
            <v-card-text v-if="content.link.description">{{ content.link.description }}</v-card-text>
        </div>

        <!-- Video content -->
        <div v-if="!!content.video">
            <video width="100%" height="240" controls>
                <source :src="storageUrl + content.video.path">
                Your browser does not support the video tag.
            </video>
        </div>

        <!-- Author button -->
         <v-card-actions>
            <v-list-item>
                <v-list-item-avatar color="grey darken-3">
                    <v-img class="elevation-6" src=""></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>
                        <v-btn text @click="$router.push('/user/' + content.user.id)">
                            {{ content.user.name }}
                        </v-btn>

                        <v-btn v-if="!followed && $store.state.user.id != content.user.id" icon @click="onFollowUser(content.user.id)">
                            <v-icon>mdi-account-check-outline</v-icon>
                        </v-btn>

                        <v-btn v-if="followed && $store.state.user.id != content.user.id" icon @click="onUnfollowUser(content.user.id)">
                            <v-icon>mdi-account-check</v-icon>
                        </v-btn>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-card-actions>

        <v-card-actions>
            <v-list-item class="grow">
                <v-row align="center">
                    <!-- Delete button -->
                    <v-btn v-if="$store.state.user.id == content.user.id" icon v-on:click="deleteStory(content.id)">
                        <v-icon class="mr-1">mdi-trash-can</v-icon>
                    </v-btn>

                    <!-- Divider -->
                    <span v-if="$store.state.user.id == content.user.id" class="mr-1">·</span>

                    <!-- Comment button -->
                    <v-btn icon v-on:click="$refs.comments.show()"><v-icon class="mr-1">mdi-comment</v-icon></v-btn>

                    <!-- Comment count -->
                    <span class="subheading mr-2">{{ commentCount }}</span>

                    <!-- Divider -->
                    <span class="mr-1">·</span>

                    <!-- Unlike button -->
                    <v-btn v-if="like" icon @click="onUnlike(content.id)">
                        <v-icon class="mr-1">mdi-heart</v-icon>
                    </v-btn>

                    <!-- Like button -->
                    <v-btn v-if="!like" icon @click="onLike(content.id)">
                        <v-icon class="mr-1">mdi-heart-outline</v-icon>
                    </v-btn>

                    <!-- Like count -->
                    <span class="subheading mr-2">{{ likeCount }}</span>

                    <!-- Divider -->
                    <span class="mr-1">·</span>

                    <!-- Share button -->
                    <v-icon class="mr-1">mdi-share-variant</v-icon>
                </v-row>
            </v-list-item>
        </v-card-actions>

        <comments 
            ref="comments" 
            :comments="content.comments" 
            :storyId="content.id"
            @onComment="commentCount++">
        </comments>

        <notification ref="notify"></notification>
    </v-card>
</template>

<script>
import Comments from './Comments';
import Notification from './Notification';

export default {
    props: ['content'],
    components: {
        'comments': Comments,
        'notification': Notification
    },
    data: () => ({
        cardColor: 'yellow',
        storageUrl: process.env.VUE_APP_MIMOSA_BACKEND_STORAGE,
        like: false,
        likeCount: 0,
        followed: false,
        commentCount: 0
    }),
    mounted () {
        this.content.likes.forEach((like) => {
            if (like.user_id == this.$store.state.user.id) {
                this.like = true;
            }
        });

        this.likeCount = this.content.likes.length;

        this.$store.state.user.following.forEach((following) => {
            if (following.following == this.content.user.id) {
                this.followed = true;
            }
        });

        this.commentCount = this.content.comments.length;
    },
    methods: {
        onUnlike (storyId) {
            this.$server.delete('api/story/unlike/' + storyId).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.like = false;
                    this.likeCount--;
                } else {
                    this.$refs.notify.unabledToPerformMessage();
                }
            })
        },
        onLike (storyId) {
            this.$server.post('api/story/like/' + storyId).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.like = true;
                    this.likeCount++;
                } else {
                    this.$refs.notify.unabledToPerformMessage();
                }
            })
        },
        onFollowUser (userId) {
            this.$server.post('api/user/follow/' + userId).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.$emit('onFollowUser');
                    this.followed = true;
                    this.$refs.notify.show('User followed!');
                } else {
                    this.$refs.notify.unabledToPerformMessage();
                }
            })
        },
        onUnfollowUser (userId) {
            if (confirm("Confirm unfollow this user?")) {
                this.$server.delete('api/user/unfollow/' + userId).then((resp) => {
                    if (resp.data.status === 'SUCCESS') {
                        this.$emit('onUnfollowUser');
                        this.followed = false;
                        this.$refs.notify.show('User unfollowed!');
                    } else {
                        this.$refs.notify.unabledToPerformMessage();
                    }
                });
            }
        },
        deleteStory(storyId) {
            if (confirm("Confirm delete this story?")) {
                this.$server.delete('api/user/post/delete/' + storyId).then((resp) => {
                    if (resp.data.status === 'SUCCESS') {
                        this.$emit('onDelete', storyId);
                        this.$refs.notify.show('Post deleted!');
                    }  else {
                        this.$refs.notify.unabledToPerformMessage();
                    }
                });
            }
        }
    }
}
</script>