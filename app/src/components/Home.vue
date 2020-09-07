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
                    </v-card-text>

                    <div v-if="!!story.photo">
                        <v-img
                            :src="'http://localhost:9000/storage/' + story.photo.path"
                            height="200px">
                        </v-img>
                    </div>

                    <div v-if="!!story.link">
                        <v-img
                            :src="story.link.image_url"
                            height="200px">
                        </v-img>

                        <v-card-text class="headline">
                            <a :href="story.link.url">{{ story.link.title }}</a>
                        </v-card-text>
                        <v-card-text>
                            {{ story.link.description }}
                        </v-card-text>
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
                                <v-list-item-title>{{ story.user.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-row
                                align="center"
                                justify="end">

                            <v-icon class="mr-1">mdi-heart</v-icon>
                            <span class="subheading mr-2">{{ story.likes.length }}</span>
                            <span class="mr-1">·</span>
                            <v-icon class="mr-1">mdi-share-variant</v-icon></v-row>
                        </v-list-item>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        stories: []
    }),
    mounted () {
        this.$server.get('api/story').then((resp) => {
            if (resp.data.status === 'SUCCESS') {
                this.stories = resp.data.message.stories;
            } else {
                this.storeis = [];
            }
        });
    },
    methods: {
       
    }
}
</script>