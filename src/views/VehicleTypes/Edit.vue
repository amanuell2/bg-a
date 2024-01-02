<template>
  <div>
    <h3 class="font-semibold text-gray-600 uppercase">Add Vehicle Type</h3>
    <form @submit.prevent="update">
      <div class="flex -mx-4 items-strech">
        <div class="w-1/2">
          <div class="p-4 space-y-4">
            <label class="block">
              <span class="text-gray-700">Vehicle Type Name</span>
              <input
                v-model="vehicleType.name"
                class="block w-full mt-1 form-input"
                placeholder="Luxury"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">City</span>
              <input
                v-model="vehicleType.city"
                class="block w-full mt-1 form-input"
                placeholder="Addis Ababa"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Cost per KMs</span>
              <input
                v-model="vehicleType.pricePerKM"
                class="block w-full mt-1 form-input"
                placeholder="$"
              />
            </label>
            <div class="flex -mx-4">
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Rent Price per Day</span>
                    <input
                      v-model="vehicleType.rentPerDay"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Rent Price per Hour</span>
                    <input
                      v-model="vehicleType.rentPerHour"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div class="flex -mx-4">
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Price for Hard Workers</span>
                    <input
                      v-model="vehicleType.priceForHardWorkers"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Price for Medium Workers</span>
                    <input
                      v-model="vehicleType.priceForMediumWorkers"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div class="flex -mx-4">
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Base Fare</span>
                    <input
                      v-model="vehicleType.baseFare"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Surge Price</span>
                    <input
                      v-model="vehicleType.surgePrice"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Rent Discount</span>
                    <input
                      v-model="vehicleType.rentDiscount"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div class="flex -mx-4">
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Price per Minute</span>
                    <input
                      v-model="vehicleType.pricePerMin"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Number of Seats</span>
                    <input
                      v-model="vehicleType.numberOfSeats"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div class="flex -mx-4">
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Pool Base Fare</span>
                    <input
                      v-model="vehicleType.poolBaseFare"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Pool Price per Minute</span>
                    <input
                      v-model="vehicleType.poolPricePerMin"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Pool Cost per KMs</span>
                    <input
                      v-model="vehicleType.poolPricePerKM"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div class="flex -mx-4">
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Surge Base Fare</span>
                    <input
                      v-model="vehicleType.surgeBaseFare"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Surge Price per Minute</span>
                    <input
                      v-model="vehicleType.surgePricePerMin"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
              <div class="w-1/2">
                <div class="px-4">
                  <label class="block">
                    <span class="text-gray-700">Surge Cost per KMs</span>
                    <input
                      v-model="vehicleType.surgePricePerKM"
                      class="block w-full mt-1 form-input"
                    />
                  </label>
                </div>
              </div>
            </div>
            <label class="block">
              <span class="text-gray-700">Status</span>
              <select @change="setStatus" class="block w-full mt-1 form-select">
                <option value="1" :selected="vehicleType.active">On</option>
                <option value="0" :selected="!vehicleType.active">Off</option>
              </select>
            </label>
          </div>
        </div>
        <div class="w-1/2">
          <div class="p-4">
            <photo-uploader
              v-model="vehicleType.photo"
              label="Vehicle Type Image"
            />
          </div>
        </div>
      </div>
      <div>
        <back-button></back-button>
        <button
          class="px-4 py-2 font-semibold text-white rounded"
          :disabled="busy"
          :class="
            busy
              ? 'bg-500-100 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700'
          "
        >
          Save
        </button>
      </div>
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
      busy: false,
      vehicleType: {
        photo: "",
        name: "",
        pricePerKM: 0,
        active: false,
        rentPerDay: 0,
        rentPerHour: 0,
        priceForHardWorkers: 0,
        priceForMediumWorkers: 0,
        baseFare: 0,
        surgePrice: 0,
        pricePerMin: 0,
        numberOfSeats: 0,
        poolBaseFare: 0,
        poolPricePerKM: 0,
        poolPricePerMin: 0,
      },
    };
  },
  created() {
    this.getVehicleType();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    setStatus(e) {
      this.vehicleType.active = e.target.value === "1";
    },
    update() {
      this.busy = true;
      this.$misc
        .patch(`/vehicleTypes/${this.id}`, { ...this.vehicleType })
        .then(() => {
          this.$router.push("/vehicle-types");
          window.flash({
            type: "success",
            body: "Vehicle Type edited successfully!",
          });
        })
        .catch(err => console.log(err))
        .finally(() => (this.busy = false));
    },
    getVehicleType() {
      this.$misc
        .get(`vehicleTypes/${this.id}`)
        .then(response => (this.vehicleType = response.data))
        .catch(err => console.log(err));
    },
  },
};
</script>
