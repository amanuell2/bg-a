<template>
  <div>
    <div class="space-y-4">
      <div class="flex items-end justify-between w-full pb-2">
        <h2 class="font-semibold text-gray-600">
          <span class="uppercase">Rent</span> -
          {{ this.rent ? this.rent._id : "" }}
        </h2>
        <!-- <div class="flex items-center h-full">
          <button
            class="w-20 h-10 mt-5 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
            @click="openConfirmBox"
            v-if="rent && rent.status == 'STARTED'"
          >
            End
            <portal to="modals">
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-if="confirmOpen"
                  @click="closeConfirmBox"
                  class="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25"
                >
                  <div
                    @click.stop
                    class="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg"
                  >
                    <div class="bg-gray-100">
                      <h3 class="px-6 py-4 font-semibold text-gray-600">
                        End rent
                      </h3>
                    </div>
                    <div class="flex items-center px-6 py-6 space-x-4">
                      <i class="text-4xl material-icons">warning</i>
                      <div>
                        <p>Are you sure you want to end this rent?</p>
                        <p>
                          <em class="text-sm text-gray-600"
                            >This action can not be undone!</em
                          >
                        </p>
                      </div>
                    </div>
                    <div class="px-4">
                      <hr />
                      <div class="flex justify-between">
                        <div>
                          <p>
                            Estimated duration -
                            {{ estimatedDuration.toFixed(2) }}
                          </p>
                          <p>
                            Estimated price - {{ estimatedFare.toFixed(2) }}
                          </p>
                        </div>
                        <div>
                          <p>Distance - {{ rentDistance.toFixed(2) }}</p>
                          <p>Duration - {{ rentDuration.toFixed(2) }}</p>
                          <p>Price - {{ rentFare.toFixed(2) }}</p>
                        </div>
                      </div>
                      <div class="flex">
                        <span class="my-2 mr-2">Distance</span>
                        <input
                          type="text"
                          name="totalDistance"
                          id="totalDistance"
                          class="block w-full my-1 form-input"
                          v-model="totalDistance"
                        />
                      </div>
                    </div>
                    <hr />
                    <div class="flex items-end justify-between px-6 py-4">
                      <button
                        @click="closeConfirmBox"
                        type="button"
                        class="px-4 py-2 text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        @click="endTrip()"
                        type="button"
                        :disabled="loading"
                        class="flex items-center px-4 py-2 space-x-2 font-semibold border border-transparent rounded shadow-sm"
                        :class="
                          loading
                            ? 'bg-green-100 text-green-500 cursor-not-allowed'
                            : 'bg-green-200 text-green-700 hover:text-green-800 hover:border-green-800'
                        "
                      >
                        <i
                          v-if="loading"
                          class="text-green-700 material-icons spin"
                          >sync</i
                        >
                        <span>End</span>
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </portal>
          </button>
          <button
            v-else-if="rent && rent.status == 'COMPLETED'"
            @click="sendEmail"
            class="w-20 h-10 mt-5 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
          >
            Resend email
          </button>
          <button
            @click="cancelTrip"
            v-else-if="rent && rent.status != 'CANCELLED'"
            class="w-20 h-10 mt-5 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
          >
            Cancel
          </button>
        </div> -->
      </div>
      <hr />
      <div class="inline-block min-w-full mt-4 -lg" v-if="!loading">
        <div class="flex py-2 my-2" v-if="rent != null">
          <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">Driver</h2>
            <div v-if="rent.driver">
              <p>{{ rent.driver.firstName + " " + rent.driver.lastName }}</p>
              <p>{{ rent.driver.phoneNumber }}</p>
            </div>
          </div>
          <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">Passenger</h2>
            <div v-if="rent.passenger">
              <p>
                {{ rent.passenger.firstName + " " + rent.passenger.lastName }}
              </p>
              <p>{{ rent.passenger.phoneNumber }}</p>
            </div>
          </div>
          <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">Dispatcher</h2>
            <div v-if="rent.dispatcher">
              <p>
                {{ rent.dispatcher.firstName + " " + rent.dispatcher.lastName }}
              </p>
            </div>
            <div v-else>
              -
            </div>
          </div>
          <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">vehicle type</h2>
            <div v-if="rent.vehicleType">
              <p>{{ rent.vehicleType.name }}</p>
            </div>
          </div>
          <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">vehicle</h2>
            <div v-if="rent.vehicle">
              <p>{{ rent.vehicle.color + " " + rent.vehicle.modelName }}</p>
              <p>{{ rent.vehicle.plateNumber }}</p>
            </div>
          </div>
        </div>
        <hr />
        <div class="flex py-2 my-2" v-if="rent != null">
          <!-- <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Corporate</h2>
            <div>
              <p>{{ rent.corporate ? rent.corporate : false }}</p>
            </div>
          </div> -->
          <!-- <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Duration</h2>
            <div>
              <p>{{ rent && rent.duration ? rent.duration.toFixed(2) + '  KM' : '-' }}</p>
            </div>
          </div> -->
          <!-- <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Ticket</h2>
            <div>
              <p>{{ rent.ticket ? rent.ticket.key : "" }}</p>
            </div>
          </div> -->
                    <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">
              Pickup / End Time
            </h2>
            <div>
              <p class="text-gray-900 whitespace-no-wrap">
                {{
                  rent.startTimestamp ? formatDate(rent.startTimestamp) : "-"
                }}
              </p>
              <p class="text-gray-900 whitespace-no-wrap">
                {{
                  rent.endTimestamp
                    ? formatDate(rent.endTimestamp)
                    : rent.status === "CANCELLED"
                    ? "Cancelled rent"
                    : "-"
                }}
              </p>
            </div>
          </div>
          <div class="w-1/4">
            <h2 class="font-semibold text-gray-600 uppercase">Ended/Cancelled By</h2>
            <div v-if="rent.dispatcherWhoEnded">
              <p>
                {{ rent.dispatcherWhoEnded.firstName + " " + rent.dispatcherWhoEnded.lastName }}
              </p>
            </div>
            <div v-else-if="rent.cancelledBy">
              {{ rent.cancelledBy }}
            </div>
            <div v-else>
              -
            </div>
          </div>

          <div class="w-1/4">
            <h2 class="font-semibold text-gray-600 uppercase">Status</h2>
            <div>
              <p>{{ rent.status }}</p>
            </div>
          </div>
          <!-- <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Type</h2>
            <div>
              <p>{{ rent.type }}</p>
            </div>
          </div> -->
          <div class="w-1/4">
            <h2 class="font-semibold text-gray-600 uppercase">Active</h2>
            <div>
              <p>{{ rent.active }}</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="flex">
        <div class="w-3/4 mr-6" v-if="rent != null">
          <div>
            <div class="items-center justify-between py-2 border-b">
              <h2 class="font-semibold text-gray-600 uppercase">From</h2>
              <div>
                <p>{{ rent.pickUpAddress ? rent.pickUpAddress.name : "-" }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Cancel cost</span>
              <span> {{ rent.cancelCost ? rent.cancelCost.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Commission</span>
              <span>{{ rent.companyCut ? rent.companyCut.toFixed(2) : "-" }}</span>
            </div>
            <!-- <div class="flex items-center justify-between py-2 border-b">
              <span>Estimated Duration</span>
              <span>{{ estimatedFare ? estimatedFare.toFixed(2) : "-" }}</span>
            </div> -->
            <div class="flex items-center justify-between py-2 border-b">
              <span>Estimated fare</span>
              <span>{{ estimatedFare ? estimatedFare.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Fare</span>
              <span>{{ rent.fare ? rent.fare.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Tax</span>
              <span>{{ rent.tax ? rent.tax.toFixed(2): "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Discount</span>
              <span>{{ rent.discount ? rent.discount.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Paid to driver</span>
              <span>{{ rent.payedToDriver ? rent.payedToDriver.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Net</span>
              <span>{{ rent.net ? rent.net.toFixed(2): "-" }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center w-full gap-4 mx-6 border">
          <div class="p-6">
            <div class="text-2xl">
              Duration Specified
            </div>
            <div class="text-5xl">{{specifiedDuration}}</div>
          </div>
          <div class="p-6">
            <div class="text-2xl">
              Actual Duration
            </div>
            <div class="text-5xl">{{actualDuration}}</div>
          </div>

        </div>
        <!-- <div class="w-full">
          <div
            class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow"
            ref="map"
          ></div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import init from "@/gmaps";


export default {
  data() {
    return {
      rent: null,
      loading: true,
      google: null,
      markers: [],
      totalDistance: null,
      serverTimeDifference: 0,
      confirmOpen: false,
      map: null,
    };
  },
  watch: {},
  created() {
    this.getServerTime();
    this.getRide();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    estimatedDistance() {
      return this.rent && this.rent.route && this.rent.route.distance
        ? this.rent.route.distance / 1000
        : 0;
    },
    estimatedDuration() {
      return this.rent && this.rent.route && this.rent.route.duration
        ? this.rent.route.duration / 60
        : 0;
    },
    rentDuration() {
      var tsts = new Date(this.rent.pickupTimestamp);
      // var date = new Date(new Date().getTime() - this.serverTimeDifference);
      var date = new Date(
        this.rent?.endTimestamp
          ? this.rent.endTimestamp
          : new Date().getTime() - this.serverTimeDifference
      );
      return (date.getTime() - tsts.getTime()) / 1000 / 60;
    },
    rentDistance() {
      return this.totalTripDistance();
    },
    rentFare() {
      var distance = this.rentDistance;
      var duration = this.rentDuration;
      if (distance && this.rent && this.rent.vehicleType && duration) {
        return (
          distance * this.rent.vehicleType.pricePerKM +
          duration * this.rent.vehicleType.pricePerMin +
          this.rent.vehicleType.baseFare
        );
      } else {
        return 0;
      }
    },
    specifiedDuration() {
        const durationExpected = moment.duration(this.rent.duration, 'hours')
        
        return `${durationExpected.months()} months, ${durationExpected.days()} days, ${durationExpected.hours()} hrs.`
    },
    actualDuration() {
        const difference = moment.duration(Math.abs(moment(this.rent.startTimestamp).diff(moment(this.rent.endTimestamp)) / 1000), 'seconds')
        
        return `${difference.months()} months, ${difference.days()} days, ${difference.hours()} hrs.`
    },
    estimatedFare() {
      var distance = this.estimatedDistance;
      var duration = this.estimatedDuration;
      if (distance && this.rent && this.rent.vehicleType && duration) {
        return (
          distance * this.rent.vehicleType.pricePerKM +
          duration * this.rent.vehicleType.pricePerMin +
          this.rent.vehicleType.baseFare
        );
      } else {
        return 0;
      }
    },
  },
  async mounted() {
    this.google = await init();

    this.map = new this.google.maps.Map(this.$refs.map, {
      center: {
        lat: 9.004912,
        lng: 38.778282,
      },
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,

    });
  },
  methods: {
    calculateDistance(from, to) {
      if (from.length == 2 && to.length == 2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (Math.PI / 180) * (to[1] - from[1]); // (Math.PI / 180) *  below
        var dLon = (Math.PI / 180) * (to[0] - from[0]);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((Math.PI / 180) * from[1]) *
            Math.cos((Math.PI / 180) * to[1]) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
      } else {
        return 0;
      }
    },
    getServerTime() {
      this.$misc.get("/date").then((response) => {
        var date = new Date(response.data);
        this.serverTimeDifference = new Date().getTime() - date.getTime();
      });
    },
    openConfirmBox() {
      this.confirmOpen = true;
    },
    closeConfirmBox() {
      this.confirmOpen = false;
    },
    sendEmail() {
      this.loading = true;
      this.$misc
        .get(`rents/${this.id}/send-email`)
        .then((response) => {
          console.log({ response });
          this.loading = false;
        })
        .catch((error) => console.log({ error }))
        .finally(() => (this.loading = false));
    },
    cancelTrip() {
      this.loading = true;
      this.$http
        .post(`rents/${this.id}/cancel`)
        .then((response) => {
          console.log({ response });
          this.rent = response.data;
          this.loading = false;
        })
        .catch((error) => console.log({ error }))
        .finally(() => (this.loading = false));
    },
    formatDate(date) {
      return date ? date.replace("T", " ").slice(0, 16) : "-";

      // return moment(date).format("MMM D, YYYY HH:mm");
    },
    totalTripDistance() {
      var distance = 0;
      if (this.rent && this.rent.path && this.rent.path.length) {
        for (let i = 0; i < this.rent.path.length; i++) {
          if (i + 1 < this.rent.path.length) {
            distance += this.calculateDistance(
              this.rent.path[i],
              this.rent.path[i + 1]
            );
          }
        }
        this.totalDistance = distance.toFixed(2);
        return distance;
      } else {
        return distance;
      }
    },
    resendEmail() {
      this.loading = true;
      this.$misc
        .get(`rents/${this.id}/resend-email`)
        .then((response) => {
          console.log({ response });
          this.getRide();
        })
        .catch((error) => console.log({ error }))
        .finally(() => (this.loading = false));
    },
    endTrip() {
      try {
        if (isNaN(this.totalDistance)) {
          return window.flash({
            type: "error",
            body: `rent distance should be number`,
          });
          
        }
        
        var distance = parseFloat(this.totalDistance.toString());

        this.loading = true;
        this.$http
          .post(`rents/${this.id}/end`, { totalDistance: distance })
          .then((response) => {
            console.log({ response });
            this.getRide()
            this.rent = response.data;
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
             window.flash({
               type: "error",
            body: error.response.data,
          });
            console.log({ error })
          })
          .finally(() => (this.loading = false));
      } catch (error) {
        console.log({ error });
      }
    },
    getRide() {
      this.loading = true;
      var path = `rents/${this.id}?limit=populate=["driver","passenger","vehicleType","dispatcher"]&start=${this.startDate}&end=${this.endDate}`;
      this.$misc
        .get(path)
        .then((response) => {
          this.rent = response.data;
          console.log(this.rent);
          this.totalTripDistance()

          this.route1 = this.rent.route.coordinates.map(x=>[x[1], x[0]])
          this.route2 = this.rent.path

          if (this.rent.path && this.rent.path.length > 1) {
            new this.google.maps.Marker({
              position: {
                lat: this.rent.path[0][1],
                lng: this.rent.path[0][0],
              },
              icon:
                "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686565/pxc38df2vfobmgmmxi95.png",
              map: this.map,
            });

            new this.google.maps.Marker({
              position: {
                lat: this.rent.path[this.rent.path.length - 1][1],
                lng: this.rent.path[this.rent.path.length - 1][0],
              },
              icon:
                "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686806/cot62kytpswv7lzdextc.png",
              map: this.map,
            });
          }

          new this.google.maps.Marker({
            position: {
              lat: this.rent.pickUpAddress.lat,
              lng: this.rent.pickUpAddress.long,
            },
            icon:
              "http://res.cloudinary.com/ika/image/upload/w_15,h_25/v1606686565/pxc38df2vfobmgmmxi95.png",
            map: this.map,
          });

          new this.google.maps.Marker({
            position: {
              lat: this.rent.dropOffAddress.lat,
              lng: this.rent.dropOffAddress.long,
            },
            icon:
              "http://res.cloudinary.com/ika/image/upload/w_15,h_25/v1606686806/cot62kytpswv7lzdextc.png",
            map: this.map,
          });

          var route = this.rent.route.coordinates.map((coord) => {
            return { lat: coord[1], lng: coord[0] };
          });

          new this.google.maps.Polyline({
            path: route,
            geodesic: true,
            map: this.map,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

          var path = this.rent.path.map((coord) => {
            return { lat: coord[1], lng: coord[0] };
          });

          new this.google.maps.Polyline({
            path: path,
            geodesic: true,
            map: this.map,
            strokeColor: "#00FF00",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });

          this.$http
            .get(`rents/${this.id}/sos`)
            .then((sos) => {
              if (sos.data && sos.data.length) {
                var icon =
                  "https://res.cloudinary.com/torpa/image/upload/w_20,h_20/v1598222724/important-icon-png-26_xte9of.png";
                sos.data.forEach((element) => {
                  new this.google.maps.Marker({
                    position: {
                      lat: element.position.coordinates[1],
                      lng: element.position.coordinates[0],
                    },
                    icon,
                    map: this.map,
                  });
                });
              }
            })
            .catch((error) => {
              console.log({ error });
            });

        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
  },
};
</script>
