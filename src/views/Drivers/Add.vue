<template>
  <div>
    <h2 class="font-semibold text-gray-600 uppercase">Add Driver</h2>

    <form @submit.prevent class="space-y-4">
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
            <input v-model="driver.lastName" class="block w-full mt-1 form-input" placeholder="Doe" />
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
        <select class="block w-full mt-1 form-select">
          <option
            v-for="type in vehicleTypes"
            :value="type._id"
            :key="`vType-${type._id}`"
          >{{ type.name }}</option>
        </select>
      </label>
      <div>
        <photo-uploader v-model="driver.businessLicense" label="BusinessLicense" />
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
          <photo-uploader @input="x => driver.additionalDocuments.push(x)" />
        </div>
      </div>
      <label class="flex items-center space-x-4">
        <input type="checkbox" class="form-checkbox" v-model="driver.representative" />
        <span>Representative (Optional)</span>
      </label>
      <div v-if="driver.representative">
        <photo-uploader v-model="driver.representationPaper" label="Representation Paper" />
      </div>
      <back-button></back-button>
      <button
        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
        @click="add"
      >Add Driver</button>
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
        driverId: "",
      },
      vehicleTypes: [],
    };
  },
  created() {
    this.getVehicleTypes();
  },
  methods: {
    getVehicleTypes() {
      this.$misc
        .get("vehicleTypes")
        .then(({ data }) => (this.vehicleTypes = data.data))
        .catch(err => console.log(err));
    },
    add() {
      this.$misc
        .post("drivers", this.driver)
        .then(() => {
          window.flash({
            type: "success",
            body: "Driver added successfully!",
          });
          this.$router.push("/drivers");
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('validation failed')) {
            window.flash({
              type: "error",
              body: err.response.data.message.split(':').slice(1).join(':').split(',').join('<br/>'),
            });
            console.log(err);
          } else {
            window.flash({
              type: "error",
              body: "Failed to add the driver!",
            });
            console.log(err);
          }
        });
    },
  },
};
</script>
