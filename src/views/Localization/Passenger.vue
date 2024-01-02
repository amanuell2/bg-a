<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl font-semibold text-gray-600 uppercase">
      Passenger Localizations
    </h2>

    <form @submit.prevent="update">
      <div class="flex pt-4 border-t">
        <div class="w-full flex justify-center items-center py-20" v-if="notFound">
          Passenger Localization not found for the selected language
        </div>
        <div class="w-full flex flex-wrap" v-else>
          <label class="block w-1/3 px-4 my-3" v-for="(value, key) of localizations" :key="key">
            <span class="text-gray-700">{{key}}</span>
            <input
              v-model="localizations[key]"
              class="block w-full form-input"
            />
          </label>
        </div>
        </div>
      <div class="flex pt-4 mt-4 justify-center" v-if="!notFound">
          <button
            class="px-24 py-2 font-bold text-white rounded shadow"
            :disabled="busy"
            :class="
              busy
                ? 'bg-shuufare-300 cursor-not-allowed'
                : 'bg-shuufare-700 hover:bg-shuufare-800 hover:shadow-none'
            "
          >
            Update
          </button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  props: {
localization: Object
  },
  data() {
    return {
      localizations: {},
      busy: false,
      newIncentive: {
        rate: 0,
        every: 0,
      },
      newVoucherType: {
        amount: 0,
        id: 0,
      },
      notFound: false,
      error: null
    };
  },
  watch: {
    localization: {
      deep: true,
      handler() {
        this.$misc
      .get(`/passenger-localizations/${this.localization.name}`)
      .then((response) => {
        this.localizations = response.data.data;
      })
      .catch((err) => {
        if (err.response.status == "404") {
          this.notFound = true;
        }
        this.error = err
      });
      }
    }
  },
  created() {
    this.$misc
      .get(`/passenger-localizations/${this.localization.name}`)
      .then((response) => {
        this.localizations = response.data.data;
      })
      .catch((err) => {
        if (err.response.status == "404") {
          this.notFound = true;
        }
        this.error = err
      });
  },
  computed: {
    addIncentiveDisabled() {
      return [
        !this.newIncentive.rate,
        !this.newIncentive.every,
        isNaN(this.newIncentive.rate),
        isNaN(this.newIncentive.every),
        this.newIncentive.rate > 100,
        this.newIncentive.rate <= 0,
        this.newIncentive.every != parseInt(this.newIncentive.every),
        this.newIncentive.every < 1,
      ].some((x) => x);
    },
    addVoucherTypeDisabled() {
      return [
        !this.newVoucherType.amount,
        !this.newVoucherType.id,
        isNaN(this.newVoucherType.amount),
        this.newVoucherType.amount < 0,
        parseInt(this.newVoucherType.amount) != Number(this.newVoucherType.amount),
      ].some(x => x)
    }
  },
  methods: {
    update() {
      this.busy = true;
      this.$misc
        .patch(`/passenger-localizations/${this.localization._id}`, { ...this.localizations })
        .then(() => {
          window.flash({ type: "success", body: "Updated Successfully!" });
        })
        .catch((err) => {
          window.flash({ type: "error", body: "Failed to save localizations!" });
          console.log(err);
        })
        .finally(() => (this.busy = false));
    },
  },
};
</script>
