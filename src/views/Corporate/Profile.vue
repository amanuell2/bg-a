<template>
  <div class="p-8">
    <form @submit.prevent="update">
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="font-semibold uppercase text-gray-600 text-xl">Corporate profile</h3>
          <p class="text-gray-600">{{ corporate._id }}</p>
        </div>
        <div class="w-2/3">
          <div class="flex space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">Name</span>
              <input
                v-model="corporate.name"
                class="form-input block w-full"
                placeholder="Sheraton Addis"
              />
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700">Short Name</span>
              <input
                :value="corporate.shortName"
                minlength="3"
                maxlength="3"
                disabled
                class="form-input block w-full rounded-l-none"
                placeholder="SHR"
              />
            </label>
          </div>
          <div class="w-2/3 mt-4">
            <div class="flex space-x-4">
              <label class="block w-1/2">
                <span class="text-gray-700">Email</span>
                <input
                  v-model="email"
                  class="form-input block w-full"
                  placeholder="email"
                />
              </label>
            </div>
          </div>

          <div class="mt-4">
            <button
              v-if="changed"
              :disabled="busy"
              class="w-32 py-2 text-shuufare-900 rounded shadow"
              :class="
                busy
                  ? 'bg-shuufare-200 cursor-not-allowed'
                  : 'bg-shuufare-500 hover:bg-shuufare-600'
              "
            >Update</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["corporate"],
  data() {
    return {
      busy: false,
      name: "",
      email: "",
    };
  },
  mounted() {
    this.name = this.corporate.name;
    this.email = this.corporate.email;
  },
  computed: {
    changed() {
      const nameChanged = this.corporate.name != this.name ? true : false;
      const emailChanged = this.corporate.email != this.email ? true : false;

      return nameChanged || emailChanged;
    }
  },
  watch: {
    corporate() {
      this.name = this.corporate.name;
      this.email = this.corporate.email;
    }
  },
  methods: {
    update() {
      if (this.corporate.name) {
        this.busy = true;
        this.$http
          .patch("/corporates/" + this.corporate._id, {
            name: this.name,
            email: this.email,
          })
          .then(() =>
            window.flash({ body: "Profile updated!", type: "success" })
          )
          .catch(err => console.log(err))
          .finally(() => (this.busy = false));
      }
    }
  }
};
</script>
