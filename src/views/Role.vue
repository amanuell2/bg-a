<template>
  <div class="w-full min-h-screen flex justify-center bg-shuufare-200">
    <div class="mt-24 p-6 w-full">
      <div class="p-4 rounded shadow overflow-hidden">
        <div class="">
          <button class="float-right" @click="logout()">Logout</button>
        </div>
        <h1 class="text-2xl font-semibold text-center text-gray-700">
          Select role
        </h1>
        <div class="flex mt-4 justify-center" v-if="this.$store.state.auth.account && this.$store.state.auth.account.corporate">
          <div
            class="card flex h-48 justify-center w-1/4 p-5 m-2 bg-white rounded shadow hover:bg-shuufare-400 cursor-pointer"
            v-for="role in activatedCorporateRoles"
            @click="selectCorporateRole(role)"
            :key="role"
          >
            <p class="m-12 text-2xl font-semibold text-center text-gray-700">
              {{ role.roleName }}
            </p>
          </div>
        </div>
        <div class="flex mt-4 justify-center">
          <div
            class="card flex h-48 justify-center w-1/4 p-5 m-2 bg-white rounded shadow hover:bg-shuufare-400 cursor-pointer"
            v-for="role in activatedRoles"
            @click="selectRole(role)"
            :key="role"
          >
            <p class="m-12 text-2xl font-semibold text-center text-gray-700">
              {{ role.roleName }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ROLES } from "@/config";

export default {
  data() {
    return {};
  },
  computed: {
    activatedRoles() {
      return this.$store.getters.isLoggedIn
        ? this.$store.state.auth.account.roles
        : [];
    },
    activatedCorporateRoles() {
      return this.$store.getters.isLoggedIn
        ? this.$store.state.auth.account.corporateRoles
        : [];
    },
  },
  mounted() {
    if (
      this.$store.getters.isLoggedIn &&
      this.$store.state.auth.account.roles.length == 1
    ) {
      this.selectRole(this.$store.state.auth.account.roles[0]);
      window.flash({
        type: "info",
        body: `Using the only available role: ${this.$store.state.auth.account.roles[0].roleName}`,
      });
    }
  },
  methods: {
    // roleName(id) {
    //   return ROLES.resolveName(id);
    // },
    async selectRole(role) {
      // alert(JSON.stringify(role))
      await this.$store.dispatch("setRole", role);
      this.$router.push('/dashboard');
    },
    async selectCorporateRole(role) {
      // alert(JSON.stringify(role))
      await this.$store.dispatch("setCorporateRole", role);
      this.$router.push('/corporate/dashboard');
    },
    logout() {
      this.$store.dispatch("logout").finally(() => this.$router.push("/login"));
    },
  },
};
</script>
