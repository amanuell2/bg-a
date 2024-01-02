<template>
  <div>
    <div class="space-y-4">
      <div class="flex items-end justify-between w-full pb-2">
        <h2 class="font-semibold text-gray-600">
          <span class="uppercase">Trip</span> -
          {{ this.trip ? this.trip._id : "" }}
        </h2>
        <div class="flex items-center h-full">
          <button
            class="w-20 h-10 mt-5 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
            @click="openConfirmBox"
            v-if="trip && trip.status == 'Started'"
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
                        End trip
                      </h3>
                    </div>
                    <div class="flex items-center px-6 py-6 space-x-4">
                      <i class="text-4xl material-icons">warning</i>
                      <div>
                        <p>Are you sure you want to end this trip?</p>
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
                            Estimated distance -
                            {{ estimatedDistance.toFixed(2) }}
                          </p>
                          <p>
                            Estimated duration -
                            {{ estimatedDuration.toFixed(2) }}
                          </p>
                          <p>
                            Estimated price - {{ estimatedFare.toFixed(2) }}
                          </p>
                        </div>
                        <div>
                          <p>Distance - {{ tripDistance.toFixed(2) }}</p>
                          <p>Duration - {{ tripDuration.toFixed(2) }}</p>
                          <p>Price - {{ tripFare.toFixed(2) }}</p>
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
            v-else-if="trip && trip.status == 'Completed'"
            @click="sendEmail"
            class="w-20 h-10 mt-5 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
          >
            Resend email
          </button>
          <button
            @click="cancelTrip"
            v-else-if="trip && trip.status != 'Canceled'"
            class="w-20 h-10 mt-5 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
          >
            Cancel
          </button>
        </div>
      </div>
      <hr />
      <div class="inline-block min-w-full mt-4 -lg" v-if="!loading">
        <div class="flex py-2 my-2" v-if="trip != null">
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Driver</h2>
            <div v-if="trip.driver">
              <p>{{ trip.driver.firstName + " " + trip.driver.lastName }}</p>
              <p>{{ trip.driver.phoneNumber }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Passenger</h2>
            <div v-if="trip.passenger">
              <p>
                {{ trip.passenger.firstName + " " + trip.passenger.lastName }}
              </p>
              <p>{{ trip.passenger.phoneNumber }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Dispatcher</h2>
            <div v-if="trip.dispatcher">
              <p>
                {{ trip.dispatcher.firstName + " " + trip.dispatcher.lastName }}
              </p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">vehicle type</h2>
            <div v-if="trip.vehicleType">
              <p>{{ trip.vehicleType.name }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">vehicle</h2>
            <div v-if="trip.vehicle">
              <p>{{ trip.vehicle.color + " " + trip.vehicle.modelName }}</p>
              <p>{{ trip.vehicle.plateNumber }}</p>
            </div>
          </div>
          <div class="w-1/5">
            <h2 class="font-semibold text-gray-600 uppercase">
              Pickup / End Time
            </h2>
            <div>
              <p class="text-gray-900 whitespace-no-wrap">
                {{
                  trip.pickupTimestamp ? formatDate(trip.pickupTimestamp) : "-"
                }}
              </p>
              <p class="text-gray-900 whitespace-no-wrap">
                {{
                  trip.endTimestamp
                    ? formatDate(trip.endTimestamp)
                    : trip.status === "Canceled"
                    ? "Canceled trip"
                    : "-"
                }}
              </p>
            </div>
          </div>
        </div>
        <hr />
        <div class="flex py-2 my-2" v-if="trip != null">
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Corporate</h2>
            <div>
              <p>{{ trip.corporate ? trip.corporate : false }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Distance</h2>
            <div>
              <p>{{ trip && trip.totalDistance ? trip.totalDistance.toFixed(2) + '  KM' : '-' }}</p>
              <p>
                (estimated
                {{
                  trip.route && trip.route.distance
                    ? (trip.route.distance / 1000).toFixed(2) + " KM"
                    : "-"
                }})
              </p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Ticket</h2>
            <div>
              <p>{{ trip.ticket ? trip.ticket.key : "" }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Status</h2>
            <div>
              <p>{{ trip.status }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Type</h2>
            <div>
              <p>{{ trip.type }}</p>
            </div>
          </div>
          <div class="w-1/6">
            <h2 class="font-semibold text-gray-600 uppercase">Active</h2>
            <div>
              <p>{{ trip.active }}</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="flex">
        <div class="w-1/4 mr-4" v-if="trip != null">
          <div>
            <div class="items-center justify-between py-2 border-b">
              <h2 class="font-semibold text-gray-600 uppercase">From</h2>
              <div>
                <p>{{ trip.pickUpAddress ? trip.pickUpAddress.name : "-" }}</p>
              </div>
            </div>
            <div class="items-center justify-between py-2 border-b">
              <h2 class="font-semibold text-gray-600 uppercase">To</h2>
              <div>
                <p>{{ trip.dropOffAddress ? trip.dropOffAddress.name : "-" }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Cancel cost</span>
              <span> {{ trip.cancelCost ? trip.cancelCost.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Commission</span>
              <span>{{ trip.companyCut ? trip.companyCut.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Estimated fare</span>
              <span>{{ estimatedFare ? estimatedFare.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Fare</span>
              <span>{{ trip.fare ? trip.fare.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Tax</span>
              <span>{{ trip.tax ? trip.tax.toFixed(2): "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Discount</span>
              <span>{{ trip.discount ? trip.discount.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Paid to driver</span>
              <span>{{ trip.payedToDriver ? trip.payedToDriver.toFixed(2) : "-" }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b">
              <span>Net</span>
              <span>{{ trip.net ? trip.net.toFixed(2): "-" }}</span>
            </div>
          </div>
        </div>
        <div class="w-full">
          <div
            class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow"
            ref="map"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import init from "@/gmaps";

export default {
  data() {
    return {
      trip: null,
      loading: true,
      google: null,
      markers: [],
      totalDistance: 0,
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
      return this.trip && this.trip.route && this.trip.route.distance
        ? this.trip.route.distance / 1000
        : 0;
    },
    estimatedDuration() {
      return this.trip && this.trip.route && this.trip.route.duration
        ? this.trip.route.duration / 60
        : 0;
    },
    tripDuration() {
      var tsts = new Date(this.trip.pickupTimestamp);
      // var date = new Date(new Date().getTime() - this.serverTimeDifference);
      var date = new Date(
        this.trip?.endTimestamp
          ? this.trip.endTimestamp
          : new Date().getTime() - this.serverTimeDifference
      );
      return (date.getTime() - tsts.getTime()) / 1000 / 60;
    },
    tripDistance() {
      return this.totalTripDistance();
    },
    tripFare() {
      var distance = this.tripDistance;
      var duration = this.tripDuration;
      if (distance && this.trip && this.trip.vehicleType && duration) {
        return (
          distance * this.trip.vehicleType.pricePerKM +
          duration * this.trip.vehicleType.pricePerMin +
          this.trip.vehicleType.baseFare
        );
      } else {
        return 0;
      }
    },
    estimatedFare() {
      var distance = this.estimatedDistance;
      var duration = this.estimatedDuration;
      if (distance && this.trip && this.trip.vehicleType && duration) {
        return (
          distance * this.trip.vehicleType.pricePerKM +
          duration * this.trip.vehicleType.pricePerMin +
          this.trip.vehicleType.baseFare
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
        .get(`trips/${this.id}/send-email`)
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
        .post(`trips/${this.id}/cancel`)
        .then((response) => {
          console.log({ response });
          this.trip = response.data;
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
      if (this.trip && this.trip.path && this.trip.path.length) {
        for (let i = 0; i < this.trip.path.length; i++) {
          if (i + 1 < this.trip.path.length) {
            distance += this.calculateDistance(
              this.trip.path[i],
              this.trip.path[i + 1]
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
        .get(`trips/${this.id}/resend-email`)
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
            body: `trip distance should be number`,
          });
          
        }
        var distance = parseFloat(this.totalDistance.toString());

        this.loading = true;
        this.$http
          .post(`trips/${this.id}/end`, { totalDistance: distance })
          .then((response) => {
            console.log({ response });
            this.trip = response.data;
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
      var path = `trips/${this.id}?limit=populate=["driver","passenger","vehicleType","dispatcher"]&start=${this.startDate}&end=${this.endDate}`;
      this.$misc
        .get(path)
        .then((response) => {
          this.trip = response.data;
          console.log(this.trip);

          if (this.trip.path && this.trip.path.length > 1) {
            new this.google.maps.Marker({
              position: {
                lat: this.trip.path[0][1],
                lng: this.trip.path[0][0],
              },
              icon:
                "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686565/pxc38df2vfobmgmmxi95.png",
              map: this.map,
            });

            new this.google.maps.Marker({
              position: {
                lat: this.trip.path[this.trip.path.length - 1][1],
                lng: this.trip.path[this.trip.path.length - 1][0],
              },
              icon:
                "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686806/cot62kytpswv7lzdextc.png",
              map: this.map,
            });
          }

          new this.google.maps.Marker({
            position: {
              lat: this.trip.pickUpAddress.coordinate.lat,
              lng: this.trip.pickUpAddress.coordinate.long,
            },
            icon:
              "http://res.cloudinary.com/ika/image/upload/w_15,h_25/v1606686565/pxc38df2vfobmgmmxi95.png",
            map: this.map,
          });

          new this.google.maps.Marker({
            position: {
              lat: this.trip.dropOffAddress.coordinate.lat,
              lng: this.trip.dropOffAddress.coordinate.long,
            },
            icon:
              "http://res.cloudinary.com/ika/image/upload/w_15,h_25/v1606686806/cot62kytpswv7lzdextc.png",
            map: this.map,
          });

          var route = this.trip.route.coordinates.map((coord) => {
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

          var path = this.trip.path.map((coord) => {
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
            .get(`trips/${this.id}/sos`)
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
