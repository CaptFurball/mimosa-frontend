<template>
    <div>
        <v-container v-if="!$store.state.authenticated" class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col class="text-center">
                    <div class="mb-2">Welcome to Mimosa V2 WIP Demo where Mimosa gets a social media platform</div>

                    <div class="mb-4">To continue, please login using the preconfigured account below for this demo purposes</div>

                    <div>email address <strong>[password]</strong></div>
                    <div>henry@mail.com <strong>[henry123]</strong></div>
                    <div>sarah@mail.com <strong>[sarah123]</strong></div>
                    <div>thomas@mail.com <strong>[thomas123]</strong></div>
                    <div>julie@mail.com <strong>[julie123]</strong></div>
                    <div>marco@mail.com <strong>[marco123]</strong></div>
                </v-col>
            </v-row>
        </v-container>

        <v-container v-if="$store.state.authenticated" class="fill-height" fluid>
            <v-row align="center" justify="center" v-for="story in stories" :key="story.id">
                  <v-card
                    class="ma-2"
                    color="#26c6da"
                    min-width="95%"
                    dark>

                    <v-card-text class="headline font-weight-bold">
                    "{{ story.body }}" 
                    <span v-for="tag in story.tags" :key="tag.id">
                        <a @click="$router.push('/tag/' +  tag.name)"># {{tag.name}}</a>
                    </span>
                    </v-card-text>

                    <div v-if="!!story.photo">
                        <v-img
                            :src="storageUrl + story.photo.path"
                            height="200px">
                        </v-img>
                    </div>

                    <div v-if="!!story.link">
                        <v-img v-if="story.link.image_url"
                            :src="story.link.image_url"
                            height="200px">
                        </v-img>

                        <v-card-text class="headline">
                            <a :href="story.link.url">{{ story.link.title? story.link.title: story.link.url }}</a>
                        </v-card-text>
                        <v-card-text v-if="story.link.description">
                            {{ story.link.description }}
                        </v-card-text>
                    </div>

                    <div v-if="!!story.video">
                        <video width="100%" height="240" controls>
                            <source :src="storageUrl + story.video.path">
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <v-card-actions>
                        <v-list-item class="grow">
                            <v-list-item-avatar color="grey darken-3">
                                <v-img
                                    class="elevation-6"
                                    src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light">
                                </v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title @click="$router.push('/user/' + story.user.id)">{{ story.user.name }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card-actions>

                    <v-card-actions>
                        <v-list-item class="grow">
                            <v-row
                                align="center"
                                justify="end">

                                <v-btn v-if="$store.state.user.id == story.user.id" icon v-on:click="deleteStory(story.id)">
                                    <v-icon class="mr-1">mdi-trash-can</v-icon>
                                </v-btn>
                                <span v-if="$store.state.user.id == story.user.id" class="mr-1">·</span>
                                <v-btn icon v-on:click="showComments(story)"><v-icon class="mr-1">mdi-comment</v-icon></v-btn>
                                <span class="subheading mr-2">{{ story.comments.length }}</span>
                                <span class="mr-1">·</span>
                                <v-btn v-if="hasLiked(story.likes)" icon v-on:click="unlikeStory(story.id)">
                                    <v-icon class="mr-1">mdi-heart</v-icon>
                                </v-btn>
                                <v-btn v-if="!hasLiked(story.likes)" icon v-on:click="likeStory(story.id)">
                                    <v-icon class="mr-1">mdi-heart-outline</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{ story.likes.length }}</span>
                                <span class="mr-1">·</span>
                                <v-icon class="mr-1">mdi-share-variant</v-icon>
                            </v-row>
                        </v-list-item>
                    </v-card-actions>
                </v-card>
            </v-row>

            <v-dialog v-model="commentDialog" width="600px">
                <v-card>
                    <v-card-title>
                     <span class="headline">Comments</span>
                    </v-card-title>
                    
                    <v-card-text v-for="comment in commentDialogStory.comments" :key="comment.id">
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title><strong>{{ comment.user.name }}</strong> says:</v-list-item-title>
                                <v-list-item-content>{{ comment.body }}</v-list-item-content>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card-text>

                    <v-card-text v-if="commentDialogStory.comments && commentDialogStory.comments.length == 0" align="center">
                        No comments found
                    </v-card-text>

                    <v-card-text v-if="$store.state.authenticated" align="center">
                        <v-text-field v-model="comment" label="Post a comment"></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" :disabled="!comment" text @click="postComment(commentDialogStory.id)">Post a comment</v-btn>
                        <v-btn color="green darken-1" text @click="closeComments()">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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
        stories: [],
        commentDialog: false,
        commentDialogStory: {},
        comment: null,
        snackbarTimeout: 2000,
        snackbar: false,
        snackbarText: '',
        storageUrl: process.env.VUE_APP_MIMOSA_BACKEND_STORAGE
    }),
    mounted () {
        this.fetchStories();
    },
    methods: {
        hasLiked(likes) {
            let likedFlag = false;  
            likes.forEach((value) => {
                if (value.user_id == this.$store.state.user.id) {
                    likedFlag = true;
                }
            });

            return likedFlag;
        },
        fetchStories() {
            this.$server.get('api/story').then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.stories = resp.data.message.stories;
                } else {
                    this.stories = [];
                }
            });
        },
        showComments(story) {
            this.commentDialogStory = story;
            this.commentDialog = true;
        },
        closeComments() {
            this.commentDialogStory = {};
            this.commentDialog = false;
        },
        postComment(storyId) {
            if (this.comment != null || this.comment != '') {
                this.$server.post('api/story/comment', {
                    story_id: storyId,
                    body: this.comment
                }).then((resp) => {
                    if (resp.data.status === 'SUCCESS') {
                        this.fetchStories();
                        this.commentDialogStory.comments.push({
                            user: {
                                name: this.$store.state.user.name
                            },
                            body: this.comment,
                        });

                        this.comment = null;
                        this.snackbar = true;
                        this.snackbarText = 'Comment posted';
                    } else {
                        this.snackbar = true;
                        this.snackbarText = 'Comment post failed, please try again later';
                    }
                });
            }
        },
        unlikeStory(storyId) {
            this.$server.delete('api/story/unlike/' + storyId).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.fetchStories();
                    this.snackbar = true;
                    this.snackbarText = 'You have unliked this story';
                } else {
                    this.snackbar = true;
                    this.snackbarText = 'Can\'t unlike now, please try again later';
                }
            })
        },
        likeStory(storyId) {
            this.$server.post('api/story/like/' + storyId).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.fetchStories();
                    this.snackbar = true;
                    this.snackbarText = 'You have liked this story';
                } else {
                    this.snackbar = true;
                    this.snackbarText = 'Can\'t like now, please try again later';
                }
            })
        },
        deleteStory(storyId) {
            this.$server.delete('api/user/post/delete/' + storyId).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.fetchStories();
                    this.snackbar = true;
                    this.snackbarText = 'You have deleted this story';
                } else {
                    this.snackbar = true;
                    this.snackbarText = 'Can\'t delete now, please try again later';
                }
            })
        }
    }
}
</script>