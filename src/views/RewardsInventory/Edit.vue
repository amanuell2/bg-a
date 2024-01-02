<template>
  <div>
    <h2 class="mb-8 font-semibold text-gray-600 uppercase">Add Prize</h2>

    <form @submit.prevent class="space-y-4">
      <div class="flex -mx-2">
        <div class="w-full">
          <label class="block px-2">
            <span class="text-gray-700">Prize</span>
            <input
              v-model="rewardPrize.prizeItem"
              class="block w-full mt-1 form-input"
              placeholder="55 Inch TV"
              required
            />
          </label>
        </div>
      </div>
      <label class="block">
        <span class="text-gray-700">Items Available</span>
        <input
          v-model="rewardPrize.initialAmountInStock"
          class="block w-full mt-1 form-input"
          type="number"
          placeholder="1"
          required
        />
      </label>
      <div>
          <div class="w-48">

        <photo-uploader v-model="rewardPrize.prizeImage" label="Prize Image" />
          </div>

      </div>
      <back-button></back-button>
      <button
        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
        @click="updatePrize"
      >
        Update Prize
      </button>
    </form>
  </div>
</template>

<script>
import PhotoUploader from "@/components/PhotoUploader.vue";
import BackButton from "@/components/BackButton.vue";

export default {
  components: {
    PhotoUploader,
    BackButton,
  },
  data() {
    return {
      rewardPrize: {
        prizeItem: null,
        initialAmountInStock: null,
        prizeImage: null,
      },
    };
  },
  created() {
    this.getPrize();
  },
  methods: {
    getPrize() {
      this.$misc
        .get(`rewards-inventory/${this.$route.params.id}`)
        .then((response) => {
          this.rewardPrize = response.data;
        })
        .catch((err) => console.log(err));
    },
    updatePrize() {
      this.$misc
        .patch(`rewards-inventory/${this.$route.params.id}`, this.rewardPrize)
        .then(() => {
          window.flash({
            type: "success",
            body: "Prize updated successfully!",
          });
          this.$router.push("/rewards-inventory");
        })
        .catch((err) => {
          window.flash({
            type: "error",
            body: "Failed to update the prize!",
          });
          console.log(err);
        });
    },
  },
};
</script>
