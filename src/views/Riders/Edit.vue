<template>
  <div class="max-w-4xl space-y-4 w-ful">
    <h2 class="font-semibold text-gray-600 uppercase">
      Add Passenger
    </h2>
    <form @submit.prevent="update" class="space-y-4">
      <div class="flex -mx-2">
        <div class="w-1/2">
          <label class="block px-2">
            <span class="text-gray-700">First Name</span>
            <input
              v-model="passenger.firstName"
              class="block w-full mt-1 form-input"
              placeholder="Jane"
            />
          </label>
        </div>
        <div class="w-1/2">
          <label class="block px-2">
            <span class="text-gray-700">Last Name</span>
            <input
              v-model="passenger.lastName"
              class="block w-full mt-1 form-input"
              placeholder="Doe"
            />
          </label>
        </div>
      </div>
      <label class="block">
        <span class="text-gray-700">Email</span>
        <input
          v-model="passenger.email"
          class="block w-full mt-1 form-input"
          type="email"
          placeholder="johndoe@gmail.com"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Contact Number</span>
        <input
          v-model="passenger.phoneNumber"
          class="block w-full mt-1 form-input"
          type="tel"
          placeholder="+251 912345678"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Profile Picture</span>
        <input class="block w-full mt-1 form-input" type="file" />
      </label>
      <back-button></back-button>
      <button
        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Update Passenger
      </button>
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
      passenger: {},
    };
  },
  created() {
    this.getRider();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    getRider() {
      this.$misc
        .get(`users/${this.id}`)
        .then(response => (this.passenger = response.data))
        .catch(err => console.log(err));
    },
    update() {
      this.$misc
        .patch(`users/${this.id}`, { ...this.passenger })
        .then(() => {
          window.flash({
            type: "success",
            body: "Passenger information was updated successfully!",
          });
          this.$router.push("/passengers");
        })
        .catch(err => console.log(err));
    },
  },
};
</script>
