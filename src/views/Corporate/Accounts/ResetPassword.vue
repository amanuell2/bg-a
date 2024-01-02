<template>
  <div class="">
    <div class="flex mb-2" @click="changePage('index')">
      <span class="font-semibold text-gray-600 uppercase"
        ><i class="mr-2 material-icons">arrow_back</i></span
      ><strong class="pb-4 text-gray-600 uppercase">Back</strong>
    </div>
    <form @submit.prevent="resetPassword">
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Reset Password
          </h3>
          <p class="text-red-600" v-if="invalid">{{ this.errorMessage }}</p>
        </div>
        <div class="w-2/3">
          <div class="flex mt-4 space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">New Password</span>
              <input
                v-model="newPassword"
                :type="showPasswords?'text':'password'"
                class="block w-full form-input"
                placeholder="New Password"
              />
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700"> Confirm Password </span>
              <input
                v-model="confirmPassword"
                :type="showPasswords?'text':'password'"
                class="block w-full form-input"
                placeholder="Confirm password"
              />
            </label>
          </div>
          <div class="mt-4">
            <label><input type="checkbox" class="mr-4" v-model="showPasswords">Show Passwords</label>
          </div>
          <div class="mt-4">
            <button
              :disabled="busy || invalid"
              class="p-8 py-2 rounded shadow w-52 text-shuufare-900"
              :class="{
                'bg-shuufare-200 cursor-not-allowed': invalid || busy,
                'bg-shuufare-500 hover:bg-shuufare-600': !invalid && !busy,
              }"
            >
              Set New Password
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["account", "changePage"],
  data() {
    return {
      busy: false,
      newPassword: "",
      confirmPassword: "",
      startValidating: false,
      showPasswords: false,
    };
  },
  computed: {
    id() {
      return this.account ? this.account._id : "";
    },
    invalid() {
      return (
        this.newPassword.length < 8 || this.newPassword !== this.confirmPassword
      );
    },
    errorMessage() {
      if (this.startValidating) {
        if (this.newPassword.length < 8)
          return "password too short (< 8 chars.)";
        else if (this.newPassword !== this.confirmPassword)
          return "passwords don't match";
        return "";
      }
      return "";
    },
    validationTrigger() {
      return this.newPassword + this.confirmPassword;
    },
  },
  created() {},
  methods: {
    resetPassword() {
      this.busy = true;
      this.$misc
        .post(`accounts/${this.id}/reset-password`, {
          newPassword: this.newPassword
        })
        .then(() => {
          window.flash({
            body: "Password set successfully!",
            type: "success",
          });
          this.changePage("index");
        })
        .catch((err) => {
          window.flash({ body: "Failed to set new password!", type: "error" });
          console.log(err);
        })
        .finally(() => (this.busy = false));
    },
  },
  watch: {
    validationTrigger() {
      if (!this.startValidating) this.startValidating = true;
    },
  },
};
</script>
