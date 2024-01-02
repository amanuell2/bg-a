<template>
  <div class="w-full min-h-screen flex justify-center bg-shuufare-200">
    <div class="mt-24 p-6 w-full max-w-xl">
      <div class="p-4 bg-white rounded shadow overflow-hidden">
        <h1 class="text-2xl font-semibold text-center text-gray-700">Login</h1>
        <form @submit.prevent="login" class="mt-4">
          <div v-if="error" class="mt-4">
            <div
              class="border rounded border-red-800 bg-red-100 text-red-900 px-4 py-2"
            >
              Invalid username/password combination!
            </div>
          </div>
          <label class="block mt-4">
            <span class="text-gray-700">Email</span>
            <input
              required
              v-model="email"
              type="email"
              class="form-input mt-1 block w-full"
              placeholder="jane@example.com"
            />
          </label>
          <label class="block mt-4">
            <span class="text-gray-700">Password</span>
            <input
              required
              v-model="password"
              type="password"
              class="form-input mt-1 block w-full"
              placeholder="Password"
            />
          </label>
          <button
            :disabled="busy"
            class="mt-4 w-full px-3 py-2 text-white font-semibold rounded-md"
            :class="
              busy
                ? 'bg-shuufare-200 cursor-not-allowed'
                : 'bg-shuufare-500 hover:bg-shuufare-600'
            "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      busy: false,
      error: false,
    };
  },
  methods: {
    login() {
      this.busy = true;
      this.error = false;
      const user = {
        email: this.email,
        password: this.password,
      };

      this.$store
        .dispatch("login", user)
        .then(() => {
          console.log("after login")

          window.flash({ type: "success", body: "Logged in successfully!" });
          this.$router.push('/role');
        })
        .catch(() => {
          this.error = true;
        })
        .finally(() => (this.busy = false));
    },
  },
};
</script>
