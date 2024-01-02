
<template>
  <div class="box-border w-full h-full p-8 overflow-hidden">
    <div class="flex gap-4 w-full p-4 border mb-10">
      <div class="flex justify-between">
        <div class="relative w-full max-w-sm">
          <div class="pr-3">
            <label class="block">
              <LocationSearchBox v-model="locationSearch" />
            </label>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="relative w-full max-w-sm">
          <div class="relative ml-5">
            <label class="block">
              <span class="text-gray-700">Driver</span>
              <input
                v-model="searchText"
                @keyup="searchDriver"
                placeholder="Search Driver(s) By Name"
                class="block w-full mt-1 form-input"
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
              <div v-if="driverSearchResults.length" class="absolute inset-x-0 z-50 mt-1">
                <div class="py-2 overflow-y-auto bg-white rounded-md shadow max-h-64">
                  <ul>
                    <li
                      v-for="(result, index) in driverSearchResults"
                      :key="result._id"
                      @click="selectDriver(index)"
                      class="flex items-center px-4 py-2 space-x-2 border-t cursor-pointer hover:bg-gray-200"
                    >
                      <img
                        class="object-cover w-12 h-12 rounded-full"
                        :src="result.profileImage"
                        :alt="`${result.firstName} ${result.lastName}`"
                      />
                      <div>
                        <p>{{ `${result.firstName} ${result.lastName}` }}</p>
                        <p class="text-sm font-semibold text-gray-600">{{ result.phoneNumber }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="inline-flex gap-10">
      <div class="flex items-center justify-center flex-col gap-2">
        <div class="w-24">Heat Map</div>
        <div
          class="relative inline-block w-16 mr-2 align-middle transition duration-200 ease-in select-none"
        >
          <input
            type="checkbox"
            name="toggle"
            id="toggle-payment"
            v-model="showHeatMap"
            class="absolute block w-8 h-8 bg-white border-4 rounded-full appearance-none cursor-pointer toggle-checkbox"
          />
          <label
            for="toggle-payment"
            class="block h-8 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"
          ></label>
        </div>
      </div>
      <div class="flex items-center w-full px-8 py-4 space-x-4 bg-white rounded shadow">
        <div>
          <i class="text-6xl text-green-600 material-icons">loop</i>
        </div>
        <div class="font-semibold">
          <p class="text-gray-600">Active Trips:</p>
          <p class="text-4xl">{{ stats.totalRunningTrips }}</p>
        </div>
      </div>
      <div
        class="flex items-center w-full px-8 py-4 space-x-4 cursor-pointer bg-white rounded shadow"
        :class="{ 'border border-blue-500': filters.online }"
        @click="filters.online = !filters.online"
      >
        <div>
          <i class="text-6xl text-green-600 material-icons">local_taxi</i>
        </div>
        <div class="font-semibold">
          <p class="text-gray-600">Total Online Fleets</p>
          <p class="text-4xl">{{ stats.totalActiveFleets }}</p>
        </div>
      </div>
      <div
        class="flex items-center w-full px-8 py-4 cursor-pointer space-x-4 bg-white rounded shadow"
        :class="{ 'border border-blue-500': filters.offline }"
        @click="filters.offline = !filters.offline"
      >
        <div>
          <i class="text-6xl text-red-500 material-icons">local_taxi</i>
        </div>
        <div class="font-semibold">
          <p class="text-gray-600">Total Offline Fleets</p>
          <p class="text-4xl">{{ stats.activeButOfflineVehicles }}</p>
        </div>
      </div>
      <div
        class="flex items-center w-full px-8 cursor-pointer py-4 space-x-4 bg-white rounded shadow"
        :class="{ 'border border-blue-500': filters.inActiveTrip }"
        @click="filters.inActiveTrip = !filters.inActiveTrip"
      >
        <div>
          <i class="text-6xl text-blue-500 material-icons">local_taxi</i>
        </div>
        <div class="font-semibold">
          <p class="text-gray-600">Vehicles in Active Trip</p>
          <p class="text-4xl">{{ stats.inActiveTrip }}</p>
        </div>
      </div>
    </div>
    <div class="box-border w-full h-full p-8 overflow-hidden">
      <MapBoxWithMarkers
        :markers="markers"
        :mapCenter="mapCenter"
        :mapZoom="mapZoom"
        :popupData="infoWindowData"
        @markerClicked="markerClicked"
      ></MapBoxWithMarkers>
      <!-- <div class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow" ref="map"></div> -->
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import LocationSearchBox from "@/components/LocationSearchBox";
import init from "@/gmaps";

import MapBoxWithMarkers from "@/components/MapBoxWithMarkers";

export default {
  data() {
    return {
      drivers: [],
      google: null,
      // markers: {},
      infowindows: {},
      map: null,
      interval: null,
      stats: {},
      loadingCurrentDriverInfo: false,
      currentDriverInfo: {},
      currentVehicleInfo: {},
      locationSearch: null,
      driverSearchResults: [],
      searchText: "",
      driverId: null,
      filters: {
        online: true,
        offline: false,
        inActiveTrip: true,
      },
      locationData: [],
      showHeatMap: false,
      heatmap: {},
      markers: [],
      mapZoom: null,
      mapCenter: {
      },
    };
  },
  async mounted() {
    this.google = await init();

    // if (this.$route.query.lat && this.$route.query.long && !isNaN(this.$route.query.lat) && !isNaN(this.$route.query.long)) {
    //   this.map = new this.google.maps.Map(this.$refs.map, {
    //     center: {
    //       lat: Number(this.$route.query.lat),
    //       lng: Number(this.$route.query.long),
    //     },
    //     zoom: 21,
    //     streetViewControl: false,
    //     mapTypeControl: false,

    //   });
    // } else {
    //   this.map = new this.google.maps.Map(this.$refs.map, {
    //     center: {
    //       lat: 9.004912,
    //       lng: 38.778282,
    //     },
    //     zoom: 13,
    //     streetViewControl: false,
    //   });
    // }

    if (this.$route.query.driver) {
      this.driverId = this.$route.query.driver;
      this.$misc
        .get("drivers/" + this.$route.query.driver)
        .then(({ data }) => {
          if (data.vehicle && data.vehicle.position) {
            const [long, lat] = data.vehicle.position.coordinates
            this.mapCenter = {
              lat: Number(lat),
              lng: Number(long)
            }
            this.mapZoom = 21
          }
          const { firstName, lastName, phoneNumber } = data.driver
          this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
          this.selectedDriverObj = data.driver
        });
    }
  },
  components: {
    LocationSearchBox,
    MapBoxWithMarkers,
  },
  created() {
    this.getDrivers();
    this.getStats();
    this.interval = setInterval(() => {
      this.getDrivers();
      this.getStats();
    }, 20000);
    this.getLocationData()
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    infoWindowData() {
      return this.loadingCurrentDriverInfo ? "loading data... please wait..." : "<p>Full Name: " +
        this.currentDriverInfo.firstName + ' ' + this.currentDriverInfo.lastName +
        "</p>" +
        "<p>Vehicle ID: " +
        this.currentVehicleInfo._id +
        "</p>" +
        "<p>Vehicle Model: " +
        (this.currentDriverInfo.modelName
          ? this.currentDriverInfo.modelName
          : "-") +
        "</p>" +
        "<p>Color: " +
        this.currentVehicleInfo.color +
        "</p>" +
        "<p>Approved: " +
        this.currentDriverInfo.approved +
        "</p>" +
        "<p class='pb-2'>Rating: " +
        this.currentDriverInfo.rating +
        "</p>" +
        '<a href="/drivers/' +
        this.currentDriverInfo._id +
        '" target="_balnk" class="w-20 h-20 p-1 px-4 text-lg text-white rounded-md shadow-lg bg-shuufare-600 hover:bg-shuufare-400">locate driver</a>'
    }
  },
  watch: {
    locationData(data) {
      const heatmapData = data.map((d) => new this.google.maps.LatLng(d.lat, d.long));

      if (this.heatmap && this.heatmap.setMap) {
        this.heatmap.setMap(null);
      }

      this.heatmap = new this.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 40
      });


      // var overlay = new this.google.maps.OverlayView();

      // // Add the container when the overlay is added to the map.
      // overlay.onAdd = function() {
      //   var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
      //     .attr("class", "nodes");

      //   overlay.draw = function() {
      //     /* var projection = this.getProjection(),
      //       padding = 10;

      //     var marker = layer.selectAll("svg")
      //       .data(data)
      //       .each(transform)
      //       .enter().append("svg")
      //       .each(transform)
      //       .attr("class", "marker")
      //       .on("mouseover", function(d) {
      //         tooltip.transition()
      //           .duration(200)
      //           .style("opacity", 1);
      //         tooltip.html(d.node_id)
      //           .style("left", (d3.event.pageX) + "px")
      //           .style("top", (d3.event.pageY) + "px");
      //       })
      //       .on("mouseout", function(d) {
      //         tooltip.transition()
      //           .duration(500)
      //           .style("opacity", 0);
      //       });


      //     marker.append("circle")
      //       .attr("r", 7)
      //       .attr("cx", padding)
      //       .attr("cy", padding)
      //       .style("fill", function(d) {
      //         if (d.temp1) {
      //           return colorScale(d.temp1);
      //         } else
      //           return "none";
      //       });


      //     marker.append("text")
      //       .attr("x", padding + 7)
      //       .attr("y", padding)
      //       .attr("dy", ".31em")
      //       .text(function(d) {
      //         return d.temp1;
      //       });
      // */
      //     function transform(d) {
      //       d = new google.maps.LatLng(d.lat, d.lng);
      //       d = projection.fromLatLngToDivPixel(d);
      //       return d3.select(this)
      //         .style("left", (d.x - padding) + "px")
      //         .style("top", (d.y - padding) + "px");
      //     }
      //   };
      // };

      if (this.showHeatMap && this.heatmap && this.heatmap.setMap)
        this.heatmap.setMap(this.map);
    },
    showHeatMap(show) {
      if (this.heatmap && this.heatmap.setMap) {

        if (show) {
          this.heatmap.setMap(this.map)
        } else {
          this.heatmap.setMap(null)
        }
      }
    },
    $route: {
      handler() {
        // if (this.$route.query.driver) {
        //   this.driverId = this.$route.query.driver;
        //   this.$misc
        //     .get("drivers/" + this.$route.query.driver)
        //     .then(({ data }) => {
        //       const { firstName, lastName, phoneNumber } = data.driver
        //       this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
        //       this.selectedDriverObj = data.driver
        //     });
        // }
        // if (this.$route.query.lat && this.$route.query.long && !isNaN(this.$route.query.lat) && !isNaN(this.$route.query.long)) {
        //   this.mapCenter = {
        //     lat: Number(this.$route.query.lat),
        //     lng: Number(this.$route.query.long),
        //   }
        //   this.mapZoom = 21
        // } else {
        //   this.mapCenter = {
        //     lat: 9.004912,
        //     lng: 38.778282,
        //   }
        //   this.mapZoom = 13
        // }
        if (this.$route.query.driver) {
          this.driverId = this.$route.query.driver;
          this.$misc
            .get("drivers/" + this.$route.query.driver)
            .then(({ data }) => {
              if (data.vehicle && data.vehicle.position) {
                const [long, lat] = data.vehicle.position.coordinates

                this.mapCenter = {
                  lat: Number(lat),
                  lng: Number(long)
                }
                this.mapZoom = 21
              }
              const { firstName, lastName, phoneNumber } = data.driver
              this.selectedDriver = `${firstName} ${lastName} - ${phoneNumber}`;
              this.selectedDriverObj = data.driver
            });
        }
      },
      deep: true,
    },
    filters: {
      handler() {
        this.updateMarkers(this.drivers);
      },
      deep: true
    },
    fetchDrivers() {
      this.fetchDrivers()
    },
    driverId() {
      let url = this.$route.path + '?'
      if (this.driverId)
        url += `&driver=${this.driverId}`
      if (!this.$route.driver || this.$route.driver != this.driverId)
        this.$router.push(url)
    },
    locationSearch(newValue) {
      if (newValue && newValue.coordinate) {
        let url = this.$route.path
        this.$router.push(url)
        // if (this.driverId)
        //   url += `&driver=${this.driverId}`
        // if (this.locationSearch) {
        //   if (this.locationSearch.lat)
        //     url += `&lat=${this.locationSearch.lat}`
        //   if (this.locationSearch.long)
        //     url += `&long=${this.locationSearch.long}`
        // }

        this.mapCenter = {
          lat: newValue.coordinate.lat,
          lng: newValue.coordinate.long,
        }
        this.mapZoom = 17
      }
      // this.$router.push(url)
    }
  },
  methods: {
    markerClicked(id) {
      const d = this.drivers.find(x => x._id === id)

      this.loadingCurrentDriverInfo = true
      this.fetchDriverInfo(d, d.driver._id).then((result) => {
        this.loadingCurrentDriverInfo = false
        this.currentVehicleInfo = result.vehicle
        this.currentDriverInfo = result.driver
      })

    },
    delay(delayInms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(10);
        }, delayInms);
      });
    },
    getStats() {
      this.$misc
        .get("dashboard")
        .then((response) => (this.stats = response.data))
        .catch((err) => console.log(err));
    },
    getLocationData() {
      this.$http
        .get("trip-searches/location-data")
        .then((response) => (this.locationData = response.data))
        .catch((err) => console.log(err));
    },
    searchDriver(e) {
      if (e.target.value.trim() === "") {
        this.selectedDriverObj = null;
        this.selectedDriver = '';
        this.driverId = null;
        this.driverSearchResults = [];
        const query = { ...this.$route.query, driver: null };
        this.$router.push({ query });
      } else {
        const name = e.target.value.trim();

        if (name) {
          this.driverSearchResults = [];
          this.$misc
            .get("drivers/search?vehicle=true&limit=5&q=" + name)
            .then(({ data }) => {
              this.driverSearchResults = data;
            })
            .catch((err) => console.log(err))
            .finally(() => (this.loading = false));
        } else {
          this.driverSearchResults = [];
        }
      }
    },
    selectDriver(index) {
      let driver = this.driverSearchResults[index];
      this.selectedDriverObj = driver;
      this.selectedDriver = `${driver.firstName} ${driver.lastName} - ${driver.phoneNumber}`;
      this.driverId = driver._id;
      this.driverSearchResults = [];
      const query = { ...this.$route.query, driver: this.driverId };
      this.$router.push({ query });
    },
    async getDrivers() {
      this.$misc
        .get("/godview")
        .then((response) => {
          this.drivers = response.data;
          this.updateMarkers(this.drivers);
        })
        .catch((err) => console.log(err));
    },
    fetchDrivers: _.debounce(function () {
      this.loading = true;

      let filter;

      if (this.selectedApprovedFilter === "approved") {
        filter = true;
      } else if (this.selectedApprovedFilter === "unapproved") {
        filter = false;
      } else {
        filter = null;
      }
      this.$misc
        .get(`/drivers/admin-search`, {
          params: {
            q: this.searchText,
            from: this.range.start ? this.range.start : undefined,
            to: this.range.end ? this.range.end : undefined,
            approved: filter,
            completed:
              this.completed && ["true", "false"].includes(this.completed)
                ? this.completed
                : "all",
            page: this.currentPage,
            limit: this.perPage,
          },
        })
        .then((response) => {
          this.drivers = response.data.data;
          this.paginator = {
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage,
            count: response.data.count,
          };
        })
        .catch((err) => console.log(err))
        .finally(() => setTimeout(() => (this.loading = false), 300));
    }, 500),
    async fetchDriverInfo(element, driverId) {
      const response = await this.$misc
        .get(`/drivers/${driverId}`)

      // console.log("@#$@#$@##@")
      // console.log(response.data)


      return response.data
    },
    updateMarkers(data) {
      // for (const [, v] of Object.entries(this.markers)) {
      //   v.setMap(null)
      // }
      this.markers = data.filter(x => {
        if (x.online && this.filters.online) {
          return true
        }
        else if ((!x.online && !x.inActiveTrip) && this.filters.offline) {
          return true
        }
        else if (x.inActiveTrip && this.filters.inActiveTrip) {
          return true
        } else {
          return false
        }
      }).map((element) => {
        element.driver = element.driver ? element.driver : {}
        const pinData = {}

        pinData.id = element._id

        if (element.position) {
          var color = "red"

          if (element.inActiveTrip === true) {
            color = "blue"
          }
          if (element.online === true) {
            color = "green";
          }

          pinData.coordinates = [element.position.coordinates[0], element.position.coordinates[1]]
          pinData.color = color
          pinData.title = element.driver
            ? element.driver.fullName
            : "-"

          // const infowindow = new this.google.maps.InfoWindow({
          //   content: "loading...",
          // });
          // this.markers[element._id].setMap(this.map);
          // this.markers[element._id].addListener("click", () => {
          //   this.loadingCurrentDriverInfo = true
          //   this.fetchDriverInfo(element, element.driver._id).then((result) => {
          //     infowindow.open(this.map, this.markers[element._id]);
          //     this.loadingCurrentDriverInfo = false
          //     this.currentVehicleInfo = result.vehicle
          //     this.currentDriverInfo = result.driver
          //     infowindow.setContent(this.infoWindowData);

          //   })
          // });
          // }
        }
        return pinData
      });
    },
  },
};
</script>
<style scoped>
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