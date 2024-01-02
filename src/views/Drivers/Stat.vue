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
            <p class="text-xl text-gray-900">{{ driver.firstName }} {{ driver.lastName }}</p>
            <p class="text-sm text-gray-600">Name</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">{{ driver.email || "N/A" }}</p>
            <p class="text-sm text-gray-600">Email</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">{{ driver.phoneNumber || "N/A" }}</p>
            <p class="text-sm text-gray-600">Contact Number</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">{{ driver.city || "N/A" }}</p>
            <p class="text-sm text-gray-600">City</p>
          </div>
          <div>
            <p class="text-xl text-gray-900">{{ vehicle.plateNumber || "N/A" }}</p>
            <p class="text-sm text-gray-600">Plate Number</p>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8 my-12 bg-white rounded-lg shadow-md">
      <h2 class="h-16 font-semibold text-gray-600 uppercase">Availability</h2>
      <span class="inline-grid grid-cols-7 w-full gap-4">
        <span
          v-for="dow in dows"
          class="flex justify-center px-4 py-1 capitalize"
          :key="dow.label"
          :class="{ 'border border-green-400 bg-green-300 text-green-700': dow.isToday, 'bg-gray-200 text-gray-500': dow.isFuture, ' bg-gray-200': !dow.isToday && !dow.isFuture }"
        >{{ dow.label }}</span>
      </span>
      <span class="inline-grid grid-cols-7 w-full gap-4">
        <span
          v-for="dow in dows"
          class="flex justify-center p-4 border"
          :key="dow.label"
          :class="{ 'bg-gray-100 text-gray-400': dow.isFuture }"
        >
        {{ dow.isFuture ? '-' : (stats[dow.name] ? secondsToHms(stats[dow.name].onlineHours) : '-') }}</span>
      </span>
    </div>
  </div>
</template>

<script>
const dows = [
  { label: "sun", name: "sunday" },
  { label: "mon", name: "monday" },
  { label: "tue", name: "tuesday" },
  { label: "wed", name: "wednesday" },
  { label: "thu", name: "thursday" },
  { label: "fri", name: "friday" },
  { label: "sat", name: "saturday" },
]
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
      // dows: dows.map((x, i) => ({
      //   label: x,
      //   isFuture: i > new Date().getDay(), 

      //   isToday: i === new Date().getDay()
      // }))
      dows: dows.map((_, i) => {
        // const dow = dows[(i + 1 +dows.length + new Date().getDay()) % dows.length]
        const dow = dows[i]
        return {
          ...dow,
          // isToday: i === 6
          isToday: i === new Date().getDay(),
          isFuture: i > new Date().getDay()
        }
      }),
      stats: {
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
      }
      // dows: [...dows.slice(0, new Date().getDay()), ...dows.slice(new Date().getDay())]
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
      this.$misc
        .get("/drivers/stats/" + this.$route.params.id)
        .then((response) => {
          this.stats = response.data;
        })
        .catch((err) => console.log(err));
    },
    secondsToHms(d) {
      if (d == 0) {
        return '0'
      }
      d = Number(d);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
      return hDisplay + mDisplay + sDisplay;
    }
  },
};
</script>
