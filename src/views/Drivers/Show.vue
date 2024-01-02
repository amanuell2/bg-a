<template>
  <div class="w-3/5 mx-auto">
    <div class="p-8 my-12 bg-white rounded-lg shadow-md">
      <h2 class="h-16 font-semibold text-gray-600 uppercase">Driver Info</h2>

      <div class="flex justify-center">
        <img
          :src="driver.profileImage"
          v-image-preview
          :alt="driver.firstName"
          class="w-64 h-64 p-2 mr-10 border rounded-full shadow bg-shuufare-100 border-shuufare-200"
        />

        <div class="flex flex-col w-full gap-2">
          <div>
            <p class="text-xl text-gray-900">
              {{ driver.firstName }} {{ driver.lastName }}
            </p>
            <p class="text-sm text-gray-600">Name</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">
              {{ driver.email || "N/A" }}
            </p>
            <p class="text-sm text-gray-600">Email</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">
              {{ driver.driverId || "-" }}
            </p>
            <p class="text-sm text-gray-600">ILIft ID</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">
              {{ driver.phoneNumber || "N/A" }}
            </p>
            <p class="text-sm text-gray-600">Contact Number</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">
              {{ driver.city || "N/A" }}
            </p>
            <p class="text-sm text-gray-600">City</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">
              {{ vehicle.plateNumber || "N/A" }}
            </p>
            <p class="text-sm text-gray-600">Plate Number</p>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8 my-12 bg-white rounded-lg shadow-md">
      <h2 class="h-16 font-semibold text-gray-600 uppercase">Legal Info</h2>

      <div class="flex justify-start gap-10 mb-10">
        <div>
          <div class="h-56 p-2 shadow">
            <img
              v-image-preview
              :src="driver.businessLicense"
              alt="Driver Business License"
              class="h-full"
            />
          </div>
          <p class="mt-3 text-gray-600">Business License</p>
        </div>
        <div>
          <div class="h-56 p-2 shadow">
            <img
              v-image-preview
              :src="driver.drivingLicense"
              alt="Driver's License"
              class="h-full"
            />
          </div>
          <p class="mt-3 text-gray-600">Driver's License</p>
        </div>
      </div>
      <div
        v-if="driver.additionalDocuments && driver.additionalDocuments.length"
      >
        <div class="flex gap-10">
          <div
            class="h-56 p-2 shadow"
            v-for="(document, i) in driver.additionalDocuments"
            :key="`additional-document-${i}`"
          >
            <img
              v-image-preview
              :src="document"
              alt="Driver's License"
              class="h-full"
            />
          </div>
        </div>
        <p class="pb-4 mt-3 text-gray-600">Additional Documents</p>
      </div>
      <div class="flex space-x-4" v-if="driver.representationPaper">
        <div class="w-full">
          <p class="text-gray-600">Representation Paper</p>
          <img
            v-image-preview
            :src="driver.representationPaper"
            alt="Driver Representation Paper"
            class="rounded-lg"
          />
        </div>
        <div class="w-full"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      },
      vehicle: {
        plateNumber: "",
      },
    };
  },
  created() {
    this.getDriver();
  },
  methods: {
    getDriver() {
      console.log("/drivers/" + this.$route.params.id);
      this.$misc
        .get("/drivers/" + this.$route.params.id)
        .then((response) => {
          console.log(response.data.driver);
          this.driver = response.data.driver;
          if (response.data.vehicle)
            this.vehicle = response.data.vehicle;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
