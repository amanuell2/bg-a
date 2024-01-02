<template>
  <div class="space-y-4 w-ful">
    <h2 class="font-semibold text-gray-600 uppercase">Add Driver</h2>

    <div class="flex">
      <form @submit.prevent class="w-full max-w-4xl space-y-4">
        <div class="flex -mx-2">
          <div class="w-1/2">
            <label class="block px-2">
              <span class="text-gray-700">First Name</span>
              <input
                v-model="driver.firstName"
                class="block w-full mt-1 form-input"
                placeholder="Jane"
              />
            </label>
          </div>
          <div class="w-1/2">
            <label class="block px-2">
              <span class="text-gray-700">Last Name</span>
              <input
                v-model="driver.lastName"
                class="block w-full mt-1 form-input"
                placeholder="Doe"
              />
            </label>
          </div>
        </div>
        <div class="flex -mx-2">
          <div class="w-1/2">
            <label class="block px-2">
              <span class="text-gray-700">ID</span>
              <input
                v-model="driver.driverId"
                class="block w-full mt-1 form-input"
                placeholder="ILIft ID"
              />
            </label>
          </div>
        </div>
        <label class="block">
          <span class="text-gray-700">Email</span>
          <input
            v-model="driver.email"
            class="block w-full mt-1 form-input"
            type="email"
            placeholder="johndoe@gmail.com"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Contact Number</span>
          <input
            v-model="driver.phoneNumber"
            class="block w-full mt-1 form-input"
            type="text"
            placeholder="+251 912345678"
          />
        </label>
        <label class="flex items-center space-x-4">
          <input type="checkbox" class="form-checkbox" v-model="driver.isEmployee" />
          <span>This driver is an employee</span>
        </label>
        <div>
          <photo-uploader v-model="driver.profileImage" label="Profile Picture" />
        </div>
        <label class="block">
          <span class="text-gray-700">City</span>
          <input
            v-model="driver.city"
            class="block w-full mt-1 form-input"
            type="text"
            placeholder="Addis Ababa"
          />
        </label>
        <label class="block mt-4">
          <span class="text-gray-700">Vehicle Type</span>
          <select class="block w-full mt-1 form-select" v-model="driver.vehicleType">
            <option
              v-for="type in vehicleTypes"
              :value="type._id"
              :key="`vType-${type._id}`"
            >{{ type.name }}</option>
          </select>
        </label>
        <div>
          <photo-uploader v-model="driver.businessLicense" label="Business License" />
        </div>
        <div>
          <photo-uploader v-model="driver.drivingLicense" label="Driver's License" />
        </div>
        <div>
          <span class="text-gray-700">Additional Document(s):</span>

          <div class="flex gap-6">
            <photo-uploader
              v-for="(i, index) in driver.additionalDocuments"
              :key="`additional-document-${index}`"
              :value="driver.additionalDocuments[index]"
              @input="driver.additionalDocuments.splice(index, 1)"
            />
            <photo-uploader @input="(x) => driver.additionalDocuments.push(x)" />
          </div>
        </div>
        <label class="flex items-center space-x-4">
          <input
            type="checkbox"
            class="form-checkbox"
            :checked="representative"
            v-model="representative"
          />
          <span>Representative (Optional)</span>
        </label>
        <div v-if="representative">
          <photo-uploader v-model="driver.representationPaper" label="Representation Paper" />
        </div>
        <back-button></back-button>
        <button
          class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
          @click="edit"
        >Save Changes</button>
      </form>

      <div class="flex justify-center w-full">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            is profile complete?
            <div
              class="relative inline-block w-16 mr-2 align-middle transition duration-200 ease-in select-none"
            >
              <input
                type="checkbox"
                name="toggle"
                v-model="driver.completed"
                id="toggle"
                class="absolute block w-8 h-8 bg-white border-4 rounded-full appearance-none cursor-pointer toggle-checkbox"
              />
              <label
                for="toggle"
                class="block h-8 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"
              ></label>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            Has completed payment?
            <div
              class="relative inline-block w-16 mr-2 align-middle transition duration-200 ease-in select-none"
            >
              <input
                type="checkbox"
                name="toggle"
                v-model="driver.hasCompletedPayment"
                id="toggle-payment"
                class="absolute block w-8 h-8 bg-white border-4 rounded-full appearance-none cursor-pointer toggle-checkbox"
              />
              <label
                for="toggle-payment"
                class="block h-8 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"
              ></label>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      driver: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        profileImage: "",
        city: "",
        vehicleType: "",
        businessLicense: "",
        drivingLicense: "",
        representationPaper: "",
        additionalDocuments: [],
        completed: true,
        driverId: "",
      },
      vehicleTypes: [],
      representative: null,
    };
  },
  created() {
    this.representative = false;
    this.getVehicleTypes();
    this.getDriver();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    getDriver() {
      this.$misc
        .get(`drivers/${this.id}`)
        .then((response) => {
          this.driver = response.data.driver;
          if (response.data.vehicle && response.data.vehicle.vehicleType) {
            this.driver.vehicleType = response.data.vehicle.vehicleType._id;
          }
          this.representative = response.data.driver.representationPaper
            ? true
            : false;
        })
        .catch((err) => console.log(err));
    },
    getVehicleTypes() {
      this.$misc
        .get("vehicleTypes")
        .then(({ data }) => (this.vehicleTypes = data.data))
        .catch((err) => console.log(err));
    },
    edit() {
      this.$misc
        .patch(`drivers/${this.id}`, this.driver)
        .then(() => {
          window.flash({
            type: "success",
            body: "Driver updated successfully!",
          });
          this.$router.push("/drivers");
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('ValidationError')) {
            window.flash({
              type: "error",
              body: err.response.data.message.split(':').slice(1).join(':').split(',').join('<br/>'),
            });
            console.log(err);
          } else {
            window.flash({
              type: "error",
              body: "Driver couldn't be updated!",
            });
            console.log(err);
          }
        });
    },
  },
};
</script>
<style>
.toggle-checkbox:checked {
  @apply right-0;
  @apply border-green-400;
  right: 0;
  border-color: #68d391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-green-400;
  background-color: #68d391;
}
</style>