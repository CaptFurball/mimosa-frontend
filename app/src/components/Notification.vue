<template>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout">
        
        {{ text }}

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
</template>

<script>
export default {
    data: () => ({
        snackbar: false,
        timeout: 3000,
        text: ''
    }),
    methods: {
        unabledToPerformMessage () {
            this.snackbar = true
            this.text = 'Unable to perform the action at the moment';
        },
        show (message) {
            this.snackbar = true;
            this.text = message;
        }
    }
}
</script>