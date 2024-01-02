<template>
  <div>
    <h3 class="font-semibold text-gray-600 uppercase">Add Vehicle Type</h3>
    <form @submit.prevent="add">
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
                <option :selected="vehicleType.status" value="1">On</option>
                <option :selected="!vehicleType.status" value="0">Off</option>
              </select>
            </label>
          </div>
        </div>
        <div class="w-1/2">
          <div class="p-4">
            <p
              v-if="photoError"
              class="px-4 py-2 mb-4 text-red-900 bg-red-100 border-2 border-red-900 rounded"
            >
              {{ photoError }}
            </p>
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
          :disabled="busy"
          class="px-4 py-2 font-semibold text-white rounded"
          :class="
            busy
              ? 'bg-blue-300 cursor-not-allowed'
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
        rentDiscount: 0,
        poolBaseFare: 0,
        poolPricePerKM: 0,
        poolPricePerMin: 0,
      },
      photoError: "",
    };
  },
  methods: {
    setStatus(e) {
      this.vehicleType.ative = e.target.value === "1";
    },
    add() {
      if (this.vehicleType.photo.trim() === "") {
        this.photoError = "A photo is required!";
        window.flash({
          type: "error",
          body: "There are errors in your form!",
        });
        return false;
      }

      this.busy = true;

      this.photoError = "";

      this.$misc
        .post("vehicleTypes", this.vehicleType)
        .then(() => {
          window.flash({
            type: "success",
            body: "Vehicle type added successfully!",
          });
          this.$router.push("/vehicle-types");
        })
        .catch(err => console.log(err))
        .finally(() => (this.busy = false));
    },
  },
};
</script>
