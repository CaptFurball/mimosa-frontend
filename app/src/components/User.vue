<template>
    <div>
        <v-container v-if="!$store.state.authenticated" class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col class="text-center">
                    <demo-message></demo-message>
                </v-col>
            </v-row>
        </v-container>

        <v-container v-if="$store.state.authenticated" class="fill-height" fluid>
            <v-row>
                <v-col>
                    <h2>{{ user.name }} | {{ followerCount }} followers | {{ stories.length }} stories</h2>
                </v-col>
            </v-row>
            <v-row align="center" justify="center" v-for="story in stories" :key="story.id">
                <story :content="story" @onDelete="deleteStory" @onFollowUser="followerCount++" @onUnfollowUser="followerCount--"></story>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Story from './Story';
import DemoMessage from './DemoMessage';

export default {
    components: {
        'story': Story,
        'demo-message': DemoMessage
    },
    data: () => ({
        stories: [],
        user: {},
        followerCount: 0
    }),
    mounted () {
        this.fetchStories();
    },
    methods: {
        fetchStories() {
            this.$server.get('api/story/user/' + this.$route.params.id).then((resp) => {
                if (resp.data.status === 'SUCCESS') {
                    this.stories = resp.data.message.stories;
                    this.user = resp.data.message.user;

                    this.followerCount = this.user.followers.length;
                } else {
                    this.stories = [];
                }
            });
        },
        deleteStory(storyId) {
            this.stories = this.lodash.reject(this.stories, {'id': storyId});
        }
    }
}
</script>