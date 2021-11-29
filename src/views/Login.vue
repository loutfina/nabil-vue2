<template>
    <div class="container">
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group mt-5">
                <label for="username">Username</label>
                <input type="text" v-model="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && !username }" aria-label="Username"/>
                <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
            </div>
            <div class="form-group mt-5">
                <label htmlFor="password">Password</label>
                <input type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" aria-label="Password" />
                <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
            </div>
            <div class="form-group mt-5">
                <b-button variant="primary" v-on:click="handleSubmit"  :disabled="!username || !password"> 
                    <b-icon-check />
                    Login 
                </b-button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            username: '',
            password: '',
            submitted: false
        }
    },
    methods: {
        ...mapActions( ['useSlice/login']),
        handleSubmit () {
            this.submitted = true;
            const { username, password } = this;
            if (username && password) {
                this.$store.dispatch('useSlice/login',{ username, password })
            }
        },
    }
};
</script>