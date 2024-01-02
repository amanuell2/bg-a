<template>
  <div class="p-8">
    <form @submit.prevent="add">
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">New Corporate</h3>
          <p class="text-gray-600">Add a new corporate user!</p>
        </div>
        <div class="w-2/3">
          <div class="flex space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">Name</span>
              <input v-model="name" class="block w-full form-input" placeholder="Sheraton Addis" />
            </label>
            <label class="block w-1/2">
              <span class="text-gray-700">Short Name</span>
              <input
                v-model="shortName"
                minlength="3"
                maxlength="3"
                class="block w-full rounded-l-none form-input"
                placeholder="SHR"
              />
            </label>
          </div>
          <div class="flex space-x-4">
            <label class="block w-1/2">
              <span class="text-gray-700">Email</span>
              <input v-model="email" class="block w-full form-input" placeholder="Corporate email" />
            </label>
          </div>

          <div class="flex -mx-2 mt-2">
            <div class="w-full">
              <label class="block px-2">
                <span class="text-gray-700">Price per KM</span>
                <input
                  v-model="pricing.pricePerKM"
                  class="block w-full mt-1 form-input"
                  placeholder="10"
                />
              </label>
            </div>
            <div class="w-full">
              <label class="block px-2">
                <span class="text-gray-700">Price Per Min</span>
                <input
                  v-model="pricing.pricePerMin"
                  class="block w-full mt-1 form-input"
                  placeholder="10"
                />
              </label>
            </div>
          </div>
          <label class="block">
            <span class="text-gray-700">Base Fare</span>
            <input v-model="pricing.baseFare" class="block w-full mt-1 form-input" placeholder="10" />
          </label>
          <div class="mt-4">
            <back-button></back-button>
            <button
              :disabled="busy"
              class="w-32 py-2 rounded shadow text-shuufare-900"
              :class="
                busy
                  ? 'bg-shuufare-200 cursor-not-allowed'
                  : 'bg-shuufare-500 hover:bg-shuufare-600'
              "
            >Add</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton.vue";

export default {
  components: {
    BackButton,
  },
  data() {
    return {
      busy: false,
      name: "",
      email: "",
      shortName: "",
      pricing: {
        pricePerKM: null,
        pricePerMin: null,
        baseFare: null,
      }
    };
  },
  methods: {
    add() {
      if (this.name && this.shortName && this.shortName.length == 3) {
        this.busy = true;
        this.$http
          .post("/corporates", {
            name: this.name,
            email: this.email,
            shortName: this.shortName.toLowerCase(),
            pricing: this.pricing,
          })
          .then(() => this.$router.push("/corporate"))
          .catch(err => console.log(err))
          .finally(() => (this.busy = false));
      }
    }
  }
};
</script>
