<template>
  <div>
    <h2 class="font-semibold text-gray-600 uppercase">Add Vehicle</h2>
    <form @submit.prevent="add" class="w-full max-w-2xl">
      <label class="block mt-4">
        <span class="text-gray-700">Vehicle Type</span>
        <select
          @change="setVehicleType"
          class="block w-full mt-1 form-select"
          required
        >
          <option value="" disabled selected hidden>
            Select a vehicle type
          </option>
          <option
            v-for="vehicleType in vehicleTypes"
            :value="vehicleType._id"
            :key="`vt-opt-${vehicleType._id}`"
          >
            {{ vehicleType.name }}
          </option>
        </select>
      </label>
      <label class="block mt-4">
        <span class="text-gray-700">Model</span>
        <input
          v-model="vehicle.modelName"
          class="block w-full mt-1 form-input"
          placeholder="Yaris"
        />
      </label>
      <label class="block mt-4">
        <span class="text-gray-700">Year</span>
        <input
          v-model="vehicle.modelYear"
          class="block w-full mt-1 form-input"
          placeholder="2009"
        />
      </label>
      <label class="block mt-4">
        <span class="text-gray-700">Plate Number</span>
        <p
          v-if="plateNumberError"
          v-text="plateNumberError"
          class="text-red-500"
        ></p>
        <input
          @blur="validatePlateNumber"
          v-model="vehicle.plateNumber"
          class="block w-full mt-1 form-input"
          :class="{ 'border-red-500': plateNumberError }"
          placeholder="3-AA-XXXXXX"
          required
        />
      </label>
      <label class="block mt-4">
        <span class="text-gray-700">Color</span>
        <input
          v-model="vehicle.color"
          class="block w-full mt-1 form-input"
          placeholder="Teal"
        />
      </label>
      <label class="block mt-4">
        <span class="text-gray-700">VIN</span>
        <p
          v-if="vinValidationError"
          v-text="vinValidationError"
          class="text-red-500"
        ></p>
        <input
          @blur="validateVIN"
          @keyup="vehicle.vin = vehicle.vin.toUpperCase()"
          v-model="vehicle.vin"
          class="block w-full mt-1 form-input"
          :class="{ 'border-red-500': vinValidationError }"
          placeholder="(Optional)"
        />
      </label>
      <div class="mt-4">
        <photo-uploader
          v-model="vehicle.photo"
          :error="photoError"
          label="Vehicle Photo"
        />
      </div>
      <div class="mt-4">
        <photo-uploader
          v-model="vehicle.libre"
          :error="libreError"
          label="Registration"
        />
      </div>
      <div class="mt-4">
        <photo-uploader
          v-model="vehicle.insurance"
          :error="insuranceError"
          label="3rd Party Insurance"
        />
      </div>
      <div class="relative mt-4">
        <label class="block">
          <span class="text-gray-700">Driver</span>
          <input
            v-model="selectedDriver"
            @keyup="searchDriver"
            class="block w-full mt-1 form-input"
            placeholder="Search drivers..."
          />
        </label>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="driverSearchResults.length"
            class="absolute inset-x-0 bottom-0 mb-12"
          >
            <div
              class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64"
            >
              <ul>
                <li
                  v-for="(result, index) in driverSearchResults"
                  :key="result._id"
                  @click="result.disabled ? () => {} : selectDriver(index)"
                  :disabled="result.disabled"
                  class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                  :class="{
                    'bg-gray-100 text-gray-500 hover:bg-blue-700 hover:text-red-500 cursor-not-allowed':
                      result.disabled,
                  }"
                >
                  <img
                    class="object-cover w-12 h-12 rounded-full"
                    :src="result.profileImage"
                    :alt="`${result.firstName} ${result.lastName}`"
                  />
                  <div>
                    <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                    <p class="text-sm font-semibold">
                      {{ result.phoneNumber }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <div class="mt-4">
        <back-button></back-button>
        <button
          :disabled="busy || !valid"
          class="px-4 py-2 font-semibold text-white rounded"
          :class="[ busy || !valid ? 'bg-blue-200 cursor-not-allowed': 'bg-blue-500 hover:bg-blue-700']"
        >
          Add Vehicle
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
      vehicleTypes: [],
      vehicle: {
        modelYear: "",
        modelName: "",
        color: "",
        libre: "",
        insurance: "",
        plateNumber: "",
        vehicleType: "",
        driver: "",
        photo: "",
        vin: "",
      },
      vinValidationError: null,
      selectedDriver: "",
      drivers: [],
      driverSearchResults: [],
      plateNumberError: "",
      libreError: "",
      photoError: "",
      insuranceError: "",
    };
  },
  created() {
    this.$misc
      .get("vehicleTypes")
      .then((response) => (this.vehicleTypes = response.data.data))
      .catch((err) => console.log(err));

    if (this.$route.query.driver) {
      this.$misc
        .get(`drivers/${this.$route.query.driver}`)
        .then((response) => {
          let driver = response.data.driver;

          this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
          this.vehicle.driver = driver._id;
          this.driverSearchResults = [];
        })
        .catch((err) => console.log(err));
    }
  },
  computed: {
    valid() {
      return !(this.vinValidationError || this.plateNumberError)
    }
  },
  methods: {
    setVehicleType(e) {
      this.vehicle.vehicleType = e.target.value;
    },
    validateVIN() {
      this.vehicle.vin = this.vehicle.vin.toUpperCase();
      if (!this.vehicle.vin.length) {
        this.vinValidationError = "";
      } else {
        if (this.vehicle.vin.length < 11)
          this.vinValidationError = "Invalid VIN format! (min: 11)";
        else if (this.vehicle.vin.length > 17)
          this.vinValidationError = "Invalid VIN format! (max: 17)";
        else if (/[^A-Z\d]$/.test(this.vehicle.vin)) {
          this.vinValidationError =
            "Invalid VIN format! (only ALL CAPs and Numbers are allowed) ";
        } else {
          this.vinValidationError = "";
        }
      }
    },
    add() {
      if (!this.validateFields()) {
        return false;
      }

      this.busy = true;

      this.$misc
        .post("vehicles", this.vehicle)
        .then(() => {
          window.flash({
            body: "Vehicle added successfully!",
            type: "success",
          });
          this.$router.push("/vehicles");
        })
        .catch((err) => {
          window.flash({ body: "Failed to add vehicle!", type: "error" });
          console.log(err);
        })
        .finally(() => (this.busy = false));
    },
    searchDriver(e) {
      if (e.target.value.trim() === "") {
        this.driverSearchResults = [];
      } else {
        this.$misc
          .get(`/drivers/search?q=${e.target.value.trim()}`)
          .then((response) => {
            this.driverSearchResults = response.data.map((driver) => {
              if (driver.vehicle) {
                driver.disabled = true;
              } else {
                driver.disabled = false;
              }
              return driver;
            });
          })
          .catch((err) => console.log(err));
      }
    },
    selectDriver(index) {
      let driver = this.driverSearchResults[index];
      this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.vehicle.driver = driver._id;
      this.driverSearchResults = [];
    },
    async validatePlateNumber() {
      let exp = /^[13]{1}-[A-Z]{2}-[A-Z]?\d{5}$/;
      if (!exp.test(this.vehicle.plateNumber)) {
        this.plateNumberError = "Invalid plate number!";
        return;
      }

      this.plateNumberError = "validating... please wait"

      const {data: isTaken} = await this.$misc
          .get(`/vehicles/is-taken`, {
            params: {
              plateNumber: this.vehicle.plateNumber
            }
          })
          if (isTaken) {
            this.plateNumberError = "plate number is taken."
          } else {
            this.plateNumberError = ""
          }
    },
    validateFields() {
      let error = false;

      // if (!this.vehicle.photo) {
      //   this.photoError = "A vehicle photo must be provided!";
      //   error = true;
      // } else {
      //   this.photoError = "";
      // }

      // if (!this.vehicle.libre) {
      //   this.libreError = "A vehicle registration must be provided!";
      //   error = true;
      // } else {
      //   this.libreError = "";
      // }

      // if (!this.vehicle.libre) {
      //   this.insuranceError =
      //     "A third-party vehicle insurance must be provided!";
      //   error = true;
      // } else {
      //   this.insuranceError = "";
      // }

      return error === false;
    },
  },
};
</script>
