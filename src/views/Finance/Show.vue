<template>
  <div>
     <back-button class="flex items-center h-12 gap-2">
      <i class="material-icons">
        arrow_back
      </i>
      Go Back
    </back-button>
    <div class="space-y-10">
      <div class="flex justify-between"></div>
      <div class="inline-block min-w-full -lg">
        <div
          class="p-4 px-8 pb-10 mx-auto space-y-4 bg-white rounded-md shadow-xl"
          style="width: 26rem"
          v-if="!loading && trip != null"
        >
          <div class="w-full py-5 text-center">
            <h2 class="font-semibold text-gray-600">
              <span class="uppercase">Trip Finance Detail</span>
            </h2>
          </div>

          <div class="space-y-4 divide-y">
            <div class="w-full">
              <h2 class="font-semibold text-gray-600 uppercase">Reason</h2>
              <div>
                <p class="pt-4 font-medium">
                  {{ trip.type.toUpperCase() }} TRIP
                </p>
                <p class="text-sm text-gray-600">
                  {{ trip.pickUpAddress.name }} ->
                  {{ trip.dropOffAddress.name }}
                </p>
              </div>
            </div>
            <div class="flex justify-between w-full">
              <h2 class="font-semibold text-gray-600 uppercase">
                <span>Fare</span>
              </h2>
              <div>
                <span>{{ trip.fare.toFixed(2) }} ETB</span>
              </div>
            </div>
            <div class="flex justify-between w-full">
              <h2 class="font-semibold text-gray-600 uppercase">
                <span>Passenger Discount</span>
              </h2>
              <div>
                <span
                  >{{ trip.discount ? "-" : ""
                  }}{{ trip.discount.toFixed(2) }} ETB</span
                >
              </div>
            </div>
            <div class="flex justify-between w-full">
              <h2 class="font-semibold text-gray-600 uppercase">
                <span>Final Fare</span>
              </h2>
              <div>
                <span
                  >{{
                    (
                      Number(trip.fare.toFixed(2)) -
                      Number(trip.discount.toFixed(2))
                    ).toFixed(2)
                  }}
                  ETB</span
                >
              </div>
            </div>
            <div class="flex justify-between w-full">
              <h2 class="font-semibold text-gray-600 uppercase">
                <span>Commission</span>
              </h2>
              <div>
                <span>{{ trip.companyCut.toFixed(2) }} ETB</span>
              </div>
            </div>
            <!-- <div class="w-full">
              <h2 class="font-semibold text-gray-600 uppercase">
                <span>Cancel cost</span>
              </h2>
              <div>
                <span> {{ trip.cancelCost.toFixed(2) }}</span>
              </div>
            </div> -->
            <div class="flex justify-between w-full">
              <h2 class="font-semibold text-gray-600 uppercase">
                <span>Hard-working Discount</span>
              </h2>
              <div>
                <span>0.00 ETB</span>
              </div>
            </div>
            <div class="w-full">
              <div class="flex justify-between pt-2">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <div>Final Commission</div>
                </h2>
                <div class="justify-end text-right">
                  <div>
                    <div>{{ trip.net.toFixed(2) }} ETB</div>
                    <div>+ VAT {{ trip.tax.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="flex justify-between pt-2">
                <h2 class="font-semibold text-gray-600 uppercase">
                  <div>Total</div>
                </h2>
                <div class="justify-end text-right">
                  {{ trip.companyCut.toFixed(2) }} ETB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackButton from '../../components/BackButton.vue';

export default {
  data() {
    return {
      trip: null,
      loading: true,
      totalDistance: 0,
      serverTimeDifference: 0,
      confirmOpen: false,
      map: null,
    };
  },
  components: {
    BackButton
  },
  watch: {},
  created() {
    this.getServerTime();
    this.getRide();
    this.$misc
      .get("/setting")
      .then((response) => {
        // this.settings = response.data
        console.log(response);
      })
      .catch((err) => console.log(err));
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
  async mounted() {},
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
      this.$misc
        .post(`trips/${this.id}/cancel`)
        .then((response) => {
          console.log({ response });
          this.trip = response.data;
          this.loading = false;
        })
        .catch((error) => console.log({ error }))
        .finally(() => (this.loading = false));
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
        var distance = parseFloat(this.totalDistance.toString());

        this.loading = true;
        this.$misc
          .post(`trips/${this.id}/end`, { totalDistance: distance })
          .then((response) => {
            console.log({ response });
            this.trip = response.data;
            this.loading = false;
          })
          .catch((error) => console.log({ error }))
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
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
  },
};
</script>
