<template>
  <div class="relative">
    <div @paste="onPaste" ref="anyPlace" class="p-2">
      <h2 class="font-semibold text-gray-600 uppercase">Add Scheduled Trip</h2>
      <form @submit.prevent>
        <div class="flex -mx-4">
          <div class="bg-blue" style="min-height: 70vh; width: 26rem; max-with: 26rem">
            <div class="p-4">
              <div class="p-4 space-y-4 border rounded-lg">
                <div class="w-full">
                  <label class="block">
                    <span class="text-gray-700">Employee</span>
                    <input
                      class="block w-full mt-1 form-input"
                      type="text"
                      v-model="employeeName"
                      placeholder="Search for employees..."
                      v-on:keyup="searchEmployee(employeeName)"
                    />
                    <ul
                      v-if="employees.length"
                      class="absolute mt-1 overflow-y-auto bg-white border rounded shadow max-h-56"
                    >
                      <li
                        v-for="(result, index) in employees"
                        :key="`pickadd-${index}`"
                        class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                        v-bind:class="{
                          'bg-red-100 hover:bg-blue-700 hover:text-red-500 cursor-not-allowed':
                            result.disabled,
                        }"
                        @click="selectEmployee(result)"
                      >
                        {{ result.name }},
                        {{ result.phone }}
                      </li>
                    </ul>
                  </label>
                </div>
                <div>
                  <label class="block">
                    <span class="text-gray-700">Vehicle Type</span>
                    <select @change="setVehicleType" class="block w-full mt-1 form-select">
                      <option value disabled selected hidden>Select a vehicle type...</option>
                      <option
                        v-for="type in vehicleTypes"
                        :key="type._id"
                        :value="type._id"
                        :selected="vehicleType === type._id"
                      >{{ type.name }}</option>
                    </select>
                  </label>
                </div>

                <div class="flex">
                  <div v-if="type == 'bid'" class="w-1/2">
                    <label class="block">
                      <span class="text-gray-700">Amount</span>
                      <input
                        class="block w-full mt-1 form-input"
                        type="number"
                        v-model="bidAmount"
                        required
                        placeholder="Amount"
                        :min="baseFare"
                      />
                    </label>
                  </div>

                  <div class="w-1/2">
                    <label class="block">
                      <span class="text-gray-700">Schedule</span>
                      <select v-model="scheduled" class="block w-full mt-1 form-select">
                        <option :value="false">Now</option>
                        <option :value="true">Scheduled</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div v-if="scheduled" class="flex gap-2">
                  <div class="w-1/2">
                    <label class="block">
                      <p class="mb-1 text-gray-700">Pickup Date</p>
                      <v-date-picker v-model="date" class="w-full">
                        <template v-slot="{ inputValue, inputEvents }">
                          <input
                            class="w-full px-2 py-2 bg-white border rounded"
                            :value="inputValue"
                            v-on="inputEvents"
                          />
                        </template>
                      </v-date-picker>
                    </label>
                  </div>
                  <div class="flex w-1/2 gap-2">
                    <div class="w-1/2">
                      <label class="block">
                        <span class="text-gray-700">Hour</span>
                        <select v-model="hour" class="block w-full mt-1 form-select">
                          <option v-for="i in 24" :key="i" :value="i">{{ i }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="w-1/2">
                      <label class="block">
                        <span class="text-gray-700">Minute</span>
                        <select v-model="minute" class="block w-full mt-1 form-select">
                          <option
                            v-for="i in 12"
                            :key="i"
                            :value="(i - 1) * 5"
                          >{{ ((i - 1) * 5).toString().padStart(2, "0") }}</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="-mx-4">
                  <div class="px-4 mb-4">
                    <OriginAddressSearchBox
                      required
                      v-model="pickupAddress"
                      :customPlace="customPickupAddress"
                      v-on:input="estimate"
                    />
                  </div>
                  <div class="px-4" v-if="type != 'rent'">
                    <DestinationAddressSearchBox
                      required
                      v-model="destinationAddress"
                      v-on:input="estimate"
                    />
                  </div>
                </div>

                <div class="w-full">
                  <label class="block">
                    <span class="text-gray-700">Assign Driver</span>
                    <input
                      class="block w-full mt-1 form-input"
                      type="text"
                      v-model="driverName"
                      placeholder="Search for drivers..."
                      v-on:keyup="searchDriver(driverName)"
                    />
                    <ul
                      v-if="drivers.length"
                      class="absolute mt-1 overflow-y-auto bg-white border rounded shadow max-h-56"
                    >
                      <li
                        v-for="(result, index) in drivers"
                        :key="`pickadd-${index}`"
                        class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                        v-bind:class="{
                          'bg-red-100 hover:bg-blue-700 hover:text-red-500 cursor-not-allowed':
                            result.disabled,
                        }"
                        @click="selectDriver(result)"
                      >
                        {{ result.firstName + " " + result.lastName }},
                        {{ result.phoneNumber }}
                      </li>
                    </ul>
                  </label>
                </div>
                <div>
                  <label class="block">
                    <button
                      @click="add()"
                      :disabled="dispatching"
                      type="submit"
                      class="flex items-center justify-center w-full py-2 font-semibold text-white rounded"
                      :class="
                        dispatching
                          ? 'bg-blue-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-700'
                      "
                    >
                      <span v-if="dispatching" class="flex items-center space-x-2">
                        <i class="material-icons spin">sync</i>
                        <span>Dispatching</span>
                      </span>
                      <span v-else>Dispatch</span>
                    </button>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-grow">
            <div class="p-4" v-if="type === 'rent'">
              <div>
                <h3 class="mb-4 font-semibold">Rent Esitmate</h3>
                <div class="flex items-center justify-between py-2 border-t border-b">
                  <span>Base Fare</span>
                  <span>ETB {{ baseFare }}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b">
                  <span>Estimated Fare Total</span>
                  <span>ETB {{ estimatedFare }}</span>
                </div>
                <div
                  class="flex items-center justify-between py-2 border-b"
                  v-if="estimatedArrivalTime"
                >
                  <span>Estimated Driver Arrival Time</span>
                  <span>{{ estimatedArrivalTime }} mins.</span>
                </div>
              </div>
            </div>
            <div class="p-4" v-else>
              <div>
                <h3 class="mb-4 font-semibold">Trip Esitmate</h3>
                <div class="flex items-center justify-between py-2 border-t border-b">
                  <span>Base Fare</span>
                  <span>ETB {{ baseFare }}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b">
                  <span>Distance</span>
                  <span>{{ distance.toFixed(2) }} KM</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b">
                  <span>ETA</span>
                  <span>{{ durationString }} Hrs</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b">
                  <span>Estimated Fare Total</span>
                  <span>ETB {{ estimatedFare }}</span>
                </div>
                <div
                  class="flex items-center justify-between py-2 border-b"
                  v-if="estimatedArrivalTime"
                >
                  <span>Estimated Driver Arrival Time</span>
                  <span>{{ estimatedArrivalTime }} mins.</span>
                </div>
              </div>
            </div>
            <div class="h-64" style="min-height: 45vh">
              <div class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow" ref="map"></div>
            </div>
          </div>
          <div v-if="type === 'rent'">
            <div class="flex flex-col gap-2 bg-white" v-if="rentSearch">
              <div
                class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
                style="width: 26rem; max-width: 26rem"
                v-if="rentSearch.status === 'SINGLE_DRIVER'"
              >
                Specific Driver Rent Request
                <!-- <button
                class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                @click.prevent="cancel()"
              >
                Cancel
                </button>-->
              </div>
              <div
                class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
                style="width: 26rem; max-width: 26rem"
                v-else-if="rentSearch.status === 'IN_PROGRESS'"
              >
                searching for rents...
                <button
                  class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                  @click.prevent="cancelRent()"
                >Cancel</button>
              </div>
              <div
                class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
                style="width: 26rem; max-width: 26rem"
                v-else-if="rentSearch.status === 'NO_DRIVERS_FOUND'"
              >
                <div class="flex items-center justify-center p-4">NO DRIVERS FOUND</div>
                <button
                  class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                  @click.prevent="retryRent()"
                >Retry</button>
              </div>
              <div
                class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
                style="width: 26rem; max-width: 26rem"
                v-else-if="rentSearch.status === 'CANCELLED'"
              >
                <div
                  class="flex items-center justify-center p-4"
                >search has been cancelled by {{ rentSearch.cancelledBy }}</div>
                <button
                  class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                  @click.prevent="retryRent()"
                >Retry</button>
              </div>
              <div
                class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
                style="width: 26rem; max-width: 26rem"
                v-else-if="rentSearch.status === 'COMPLETED'"
              >
                <div class="flex items-center justify-center p-4">rent search has completed</div>
              </div>
              <div class="overflow-y-scroll bg-white" style="width: 26rem; max-width: 26rem">
                <!-- <div class="p-3 m-2 border">
              <small>
                <strong>elnatal debebe</strong>
                <strong>+251911148312</strong>
              </small>
              <br />
              <small>
                <strong>From</strong> - Shiromeda Bus Station, Haile Melekot Street, Addis Ababa, Ethiopia Bole International Airport, Addis Ababa, Ethiopia
              </small>
              <br />
              <small>
                <strong>To</strong> - Bole International Airport, Addis Ababa, Ethiopia
              </small>
              <br />
              <small>
                <strong>Status</strong> - Requested
              </small>
                </div>-->
                <div v-for="(request, index) in rentRequests" :key="index">
                  <div class="p-3 m-2 border" v-if="request && request._id">
                    <small>
                      <strong>Passenger -</strong>
                      <span>
                        {{
                          request.passenger
                            ? request.passenger.firstName +
                            " " +
                            request.passenger.lastName
                            : "-"
                        }}
                      </span>
                      ,
                      <span>
                        {{
                          request.passenger ? request.passenger.phoneNumber : "-"
                        }}
                      </span>
                    </small>
                    <br />
                    <small>
                      <strong>Driver -</strong>
                      <span>
                        {{
                          request.driver
                            ? request.driver.firstName +
                            " " +
                            request.driver.lastName
                            : "-"
                        }}
                      </span>
                      ,
                      <span>
                        {{
                          request.driver ? request.driver.phoneNumber : "-"
                        }}
                      </span>
                    </small>
                    <br />
                    <small>
                      <strong>From</strong>
                      -
                      {{
                        request.pickUpAddress ? request.pickUpAddress.name : "-"
                      }}
                    </small>
                    <br />
                    <small>
                      <strong>Vehicle type</strong>
                      -
                      {{ request.vehicleType.name }}
                    </small>
                    <br />
                    <small>
                      <strong>Status</strong>
                      - {{ request.status }}
                      {{
                        request.status === "CANCELLED"
                          ? request.cancelledBy
                            ? "(" + request.cancelledBy + ")"
                            : ""
                          : ""
                      }}
                    </small>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 bg-white" v-else-if="tripSearch">
            <div
              class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
              style="width: 26rem; max-width: 26rem"
              v-if="tripSearch.status === 'SINGLE_DRIVER'"
            >
              Specific Driver Request
              <!-- <button
                class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                @click.prevent="cancel()"
              >
                Cancel
              </button>-->
            </div>
            <div
              class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
              style="width: 26rem; max-width: 26rem"
              v-if="tripSearch.status === 'IN_PROGRESS'"
            >
              searching for trips...
              <button
                class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                @click.prevent="cancel()"
              >Cancel</button>
            </div>
            <div
              class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
              style="width: 26rem; max-width: 26rem"
              v-else-if="tripSearch.status === 'NO_DRIVERS_FOUND'"
            >
              <div class="flex items-center justify-center p-4">NO DRIVERS FOUND</div>
              <button
                class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                @click.prevent="retry()"
              >Retry</button>
            </div>
            <div
              class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
              style="width: 26rem; max-width: 26rem"
              v-else-if="tripSearch.status === 'CANCELLED'"
            >
              <div
                class="flex items-center justify-center p-4"
              >search has been cancelled by {{ tripSearch.cancelledBy }}</div>
              <button
                class="w-20 h-10 text-white rounded shadow-md bg-shuufare-600 hover:bg-shuufare-400"
                @click.prevent="retry()"
              >Retry</button>
            </div>
            <div
              class="flex items-center justify-between h-20 p-4 bg-white shadow-lg"
              style="width: 26rem; max-width: 26rem"
              v-else-if="tripSearch.status === 'COMPLETED'"
            >
              <div class="flex items-center justify-center p-4">trip search has completed</div>
            </div>
            <div class="overflow-y-scroll bg-white" style="width: 26rem; max-width: 26rem">
              <!-- <div class="p-3 m-2 border">
            <small>
              <strong>elnatal debebe</strong>
              <strong>+251911148312</strong>
            </small>
            <br />
            <small>
              <strong>From</strong> - Shiromeda Bus Station, Haile Melekot Street, Addis Ababa, Ethiopia Bole International Airport, Addis Ababa, Ethiopia
            </small>
            <br />
            <small>
              <strong>To</strong> - Bole International Airport, Addis Ababa, Ethiopia
            </small>
            <br />
            <small>
              <strong>Status</strong> - Requested
            </small>
              </div>-->
              <div v-for="(request, index) in requests" :key="index">
                <div class="p-3 m-2 border" v-if="request && request._id">
                  <small>
                    <strong>Passenger -</strong>
                    <span>
                      {{
                        request.passenger
                          ? request.passenger.firstName +
                          " " +
                          request.passenger.lastName
                          : "-"
                      }}
                    </span>
                    ,
                    <span>
                      {{
                        request.passenger ? request.passenger.phoneNumber : "-"
                      }}
                    </span>
                  </small>
                  <br />
                  <small>
                    <strong>Driver -</strong>
                    <span>
                      {{
                        request.driver
                          ? request.driver.firstName +
                          " " +
                          request.driver.lastName
                          : "-"
                      }}
                    </span>
                    ,
                    <span>
                      {{
                        request.driver ? request.driver.phoneNumber : "-"
                      }}
                    </span>
                  </small>
                  <br />
                  <small>
                    <strong>From</strong>
                    -
                    {{
                      request.pickUpAddress ? request.pickUpAddress.name : "-"
                    }}
                  </small>
                  <br />
                  <small>
                    <strong>To</strong>
                    -
                    {{
                      request.dropOffAddress ? request.dropOffAddress.name : ""
                    }}
                  </small>
                  <br />
                  <small>
                    <strong>Vehicle type</strong>
                    -
                    {{ request.vehicleType.name }}
                  </small>
                  <br />
                  <small>
                    <strong>Trip type</strong>
                    - {{ request.type }}
                  </small>
                  <br />
                  <small>
                    <strong>Status</strong>
                    - {{ request.status }}
                    {{
                      request.status === "CANCELLED"
                        ? request.cancelledBy
                          ? "(" + request.cancelledBy + ")"
                          : ""
                        : ""
                    }}
                  </small>
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div
      v-if="connecting"
      class="absolute top-0 z-50 flex items-center justify-center w-full h-screen text-white bg-gray-700 bg-opacity-50"
    >connecting</div>
  </div>
</template>

<script>
import { focus } from "vue-focus";
import OriginAddressSearchBox from "@/components/OriginAddressSearchBox";
import DestinationAddressSearchBox from "@/components/DestinationAddressSearchBox";
import { io } from "socket.io-client";
import { config } from "@/config";
import init from "@/gmaps";

export default {
  directives: {
    focus,
  },
  components: {
    OriginAddressSearchBox,
    DestinationAddressSearchBox,
  },
  data() {
    return {
      driverName: "",
      requests: [],
      drivers: [],
      employees: [],
      selectedDriver: null,
      selectedEmployee: null,
      estimateFare: 0,
      duration: 0,
      ticketError: false,
      distance: 0,
      passengers: [],
      scheduled: false,
      type: "corporate",
      riderId: "",
      fare: 0,
      dispatching: false,
      email: "",
      socket: null,
      phoneNumber: "",
      riderName: "",
      pickupAddress: {
        name: "",
        place_id: "",
      },
      destinationAddress: {
        name: "",
        place_id: "",
      },
      vehicleType: "",
      date: new Date(),
      hour: 1,
      minute: 0,
      rentHour: 1,
      rentDay: 0,
      rentMonth: 0,
      route: [],
      ticket: "",
      ticketId: "",
      ticketLoading: false,
      bidAmount: 0,
      focused: {
        0: true,
        1: false,
        2: false,
      },
      mapsService: null,
      google: null,
      vehicleTypes: [],
      markers: {},
      map: null,
      fromMarker: null,
      toMarker: null,
      path: null,
      nearbyDrivers: [],
      searching: false,
      no_drivers_found: false,
      tripSearchId: null,
      tripSearch: null,

      searchingRent: false,
      rentSearchId: null,
      rentSearch: null,
      estimatedArrivalTime: "",
      rentRequests: [],

      customPickupAddress: false,
      connecting: true,
    };
  },
  created() {
    // alert(config.dispatcherBaseURL)
    this.socket = io(`${config.baseURL}/dispatcher-socket`, {
      transports: ["websocket"],
      withCredentials: true,
      upgrade: false,
      // rememberUpgrade: true,
      // reconnectionDelayMax: 1000,
      auth: {
        token: this.$store.getters.token,
      },
    });

    this.socket.on("connect", () => {
      this.connecting = false;
      this.socket.emit("init", { id: this.id });
    });

    // Register the event listeners
    this.socket.on("request", (request) => {
      console.log(request);
    });

    this.socket.on("err", (error) => {
      window.flash({ type: "error", body: error });
    });

    this.socket.on("tripSearch", (tripSearch) => {
      this.tripSearch = tripSearch;
      this.tripSearchId = tripSearch._id;
      // window.flash({ type: "error", body: error });
    });

    this.socket.on("rentSearch", (rentSearch) => {
      this.rentSearch = rentSearch;
      this.rentSearchId = rentSearch._id;
      // window.flash({ type: "error", body: error });
    });

    this.socket.on("noAvailableDriver", () => {
      console.log("No drivers are avialable!");
      window.flash({ type: "error", body: "No drivers are avialable!" });
      this.dispatching = false;
    });

    this.socket.on("requestCanceled", () => {
      console.log("The request has been cancelled!");
      this.dispatching = false;
    });

    this.socket.on("rentRequests", (requests) => {
      console.log({ requests });
      this.rentRequests = requests;
    });

    this.socket.on("requests", (requests) => {
      this.requests = requests;
    });

    this.socket.on("noDriversFound", () => {
      this.searching = false;
      this.no_drivers_found = true;
      window.flash({
        type: "error",
        body: "No nearby drivers found!",
      });
    });

    this.socket.on("trip", (data) => {
      console.log("The request has been accepted!");
      window.flash({ type: "success", body: "Trip is accepted!" });

      console.log(data);
    });

    this.socket.on("nearbyDrivers", (data) => {
      try {
        this.nearbyDrivers = JSON.parse(data);
      } catch (error) {
        this.nearbyDrivers = [];
      }
    });

    this.socket.on("searching", () => {
      window.flash({
        type: "success",
        body: "The trip has been dispatched!",
      });
      window.events.$emit("dispatched");
      this.searching = true;
      this.dispatching = false;
      this.phoneNumber = "";
      this.riderName = "";
      this.email = "";
      this.riderId = "";
      // this.tripSearchId = data.tripSearchId
      this.destinationAddress = {
        name: "",
        place_id: "",
      };
      this.pickupAddress = {
        name: "",
        place_id: "",
      };
      this.drivers = [];
      this.driverName = "";
      this.selectedDriver = null;
      this.fare = 0;
      this.duration = 0;
      this.distance = 0;
      this.ticket = "";
      this.ticketId = "";
      this.ticketLoading = false;
      this.ticketError = false;
      this.date = new Date();
    });

    this.socket.on("searchingRent", () => {
      window.flash({
        type: "success",
        body: "The rent search has been dispatched!",
      });
      window.events.$emit("dispatched");
      this.searching = true;
      this.dispatching = false;
      this.phoneNumber = "";
      this.riderName = "";
      this.email = "";
      this.riderId = "";
      // this.tripSearchId = data.tripSearchId
      this.destinationAddress = {
        name: "",
        place_id: "",
      };
      this.pickupAddress = {
        name: "",
        place_id: "",
      };
      this.drivers = [];
      this.driverName = "";
      this.selectedDriver = null;
      this.fare = 0;
      this.duration = 0;
      this.distance = 0;
      this.ticket = "";
      this.ticketId = "";
      this.ticketLoading = false;
      this.ticketError = false;
      this.date = new Date();
    });

    this.socket.on("estimate-response", (data) => {
      // expected response
      // base fare - from vehicle type
      // distance - from the response
      // eta - from the response
      // fare total - calculation
      // tax - ???
      // total - calculation
      this.duration = data.duration;
      this.distance = data.distance;
      this.fare = data.fare;
      this.route = data.route;
      this.estimateFare = data;

      if (this.route) {
        if (this.fromMarker) {
          this.fromMarker.setMap(null);
        }

        if (this.toMarker) {
          this.toMarker.setMap(null);
        }

        if (this.path) {
          this.path.setMap(null);
        }

        this.fromMarker = new this.google.maps.Marker({
          position: {
            lat: this.route[0][1],
            lng: this.route[0][0],
          },
          draggable: true,
          icon:
            "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686565/pxc38df2vfobmgmmxi95.png",
        });

        this.fromMarker.setMap(this.map);

        this.google.maps.event.addListener(
          this.fromMarker,
          "dragend",
          (event) => {
            console.log(event);
            var lat, long;

            lat = event.latLng.lat();
            long = event.latLng.lng();

            this.pickupAddress = {
              name: "-",
              place_id: undefined,
              coordinate: {
                lat,
                long,
              },
            };

            this.customPickupAddress = true;
            // this.destinationAddress = {
            //   lat: this.toMarker.getPosition().lat(),
            //   long: this.toMarker.getPosition().lng(),
            // };
            this.estimate();
          }
        );

        this.toMarker = new this.google.maps.Marker({
          position: {
            lat: this.route[this.route.length - 1][1],
            lng: this.route[this.route.length - 1][0],
          },
          icon:
            "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686806/cot62kytpswv7lzdextc.png",
        });

        this.toMarker.setMap(this.map);

        var route = this.route.map((coord) => {
          return { lat: coord[1], lng: coord[0] };
        });

        this.path = new this.google.maps.Polyline({
          path: route,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        this.path.setMap(this.map);
      }
    });
    this.getVehicleTypes();
  },
  async mounted() {
    this.google = await init();

    this.map = new this.google.maps.Map(this.$refs.map, {
      center: {
        lat: 9.004912,
        lng: 38.778282,
      },
      zoom: 10,
      streetViewControl: false,
      mapTypeControl: false,
    });
  },
  computed: {
    baseFare() {
      const selected = this.vehicleTypes.find(
        (v) => v._id === this.vehicleType
      );
      return selected && selected != undefined
        ? selected.baseFare
        : 0;
    },
    estimatedFare() {
      const selected = this.vehicleTypes.find(
        (v) => v._id === this.vehicleType
      );

      if (this.type === "rent") {
        return (
          this.rentMonth * (selected.rentPerDay * 30) +
          this.rentDay * selected.rentPerDay +
          this.rentHour * selected.rentPerHour
        ).toFixed(2);
      } else {
        return selected && selected != undefined
          ? this.type == "bid"
            ? this.bidAmount
            : (
              (this.distance * selected.pricePerKM) +
              //this.duration * selected.pricePerMin +
              selected.baseFare
            ).toFixed(2)
          : 0;
      }
    },
    // estimatedArrivalTime() {
    //   if (this.selectedDriver) {
    //     return ((Number(this.distance) / 40) * 60).toFixed(2);
    //   } else return null;
    // },
    durationString() {
      var minute = this.duration % 60;
      var hour = (this.duration - minute) / 60;
      return hour + ":" + Math.round(minute).toString().padStart(2, "0");
    },
    id() {
      return this.$store.state.auth.account._id;
    },
  },
  watch: {
    ticket() {
      this.validateTicket();
    },
    scheduled(newValue) {
      if (newValue) {
        this.type = "scheduled-corporate"
      } else {
        this.type = "corporate"
      }
    },
    phoneNumber() {
      this.validateTicket();
    },
    customPickupAddress(customCoordinatesAreSet) {
      if (customCoordinatesAreSet === true && this.pickupAddress.coordinate) {
        const geocoder = new this.google.maps.Geocoder();
        geocoder.geocode(
          {
            location: {
              lat: this.pickupAddress.coordinate.lat,
              lng: this.pickupAddress.coordinate.long,
            },
          },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                this.pickupAddress.name = results[0].formatted_address;
                this.customPickupAddress = results[0].formatted_address;
              } else {
                window.alert("No results found");
              }
            } else {
              window.alert("Geocoder failed due to: " + status);
            }
          }
        );
      }
    },
    pickupAddress(newPickUpAddress) {
      //   this.map = new this.google.maps.Map(this.$refs.map, {
      //   center: {
      //     lat: 9.004912,
      //     lng: 38.778282,
      //   },
      //   zoom: 10,
      // });
      if (newPickUpAddress && newPickUpAddress.place_id)
        this.customPickupAddress = false;

      for (const marker in this.markers) {
        this.markers[marker].setMap(null);
      }
      this.markers = {};
      console.log("+>@>", newPickUpAddress);
      this.socket.emit("nearbyDrivers", {
        location: newPickUpAddress,
        vehicleType: this.vehicleType,
      });
    },
    vehicleType(newVal) {
      if (newVal) {
        for (const marker in this.markers) {
          this.markers[marker].setMap(null);
        }
        this.markers = {};

        this.socket.emit("nearbyDrivers", {
          location: this.pickupAddress,
          vehicleType: newVal,
        });
      }
    },
    nearbyDrivers(newData) {
      newData.forEach((element) => {
        element.driver = element.driver ? element.driver : {};
        if (element.position) {
          var icon =
            "https://res.cloudinary.com/torpa/image/upload/e_tint:100:green/w_30,h_30/v1598171147/carMarker_vpibvl.png";
          if (this.markers[element._id]) {
            this.markers[element._id].setPosition({
              lat: element.position.coordinates[1],
              lng: element.position.coordinates[0],
            });
            this.markers[element._id].setIcon(icon);
          } else {
            this.markers[element._id] = new this.google.maps.Marker({
              position: {
                lat: element.position.coordinates[1],
                lng: element.position.coordinates[0],
              },
              icon,
              title: element.driver ? element.driver.fullName : "-",
            });

            this.markers[element._id].setMap(this.map);
            this.markers[element._id].addListener("click", () => {
              this.selectDriverFromMap(element._id);
            });
          }
        }
      });
    },
  },
  methods: {
    setVehicleType(e) {
      if (e.target.value.trim() == "") {
        this.vehicleType = "";
        this.duration = 0;
        this.distance = 0;
        this.fare = 0;
        return;
      }

      this.duration = 0;
      this.distance = 0;
      this.fare = 0;
      this.vehicleType = e.target.value;
      this.estimate();
    },
    getVehicleTypes() {
      this.loading = true;
      this.$misc
        .get("vehicleTypes")
        .then((response) => {
          this.vehicleTypes = response.data.data;
          var vt = this.vehicleTypes.find((type) => type.name === "Any");
          if (vt) {
            this.vehicleType = vt._id;
          } else if (this.vehicleTypes.length) {
            this.vehicleType = this.vehicleTypes[0]._id;
          }
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },
    changeFocus(current, next) {
      this.focused[current] = false;
      this.focused[next] = true;
    },
    onPaste(evt) {
      this.phoneNumber = evt.clipboardData.getData("text");
    },
    retry() {
      this.socket.emit("retry", { tripSearchId: this.tripSearch._id });
    },
    cancel() {
      this.socket.emit("cancel", { tripSearchId: this.tripSearch._id });
    },
    retryRent() {
      this.socket.emit("retryRent", { rentSearchId: this.rentSearch._id });
    },
    cancelRent() {
      this.socket.emit("cancelRent", { rentSearchId: this.rentSearch._id });
    },
    add() {
      var intPhone = parseInt(this.phoneNumber);
      console.log(
        ">>>>>",
        intPhone &&
        intPhone.toString().length == 9 &&
        this.pickupAddress &&
        this.pickupAddress.place_id &&
        (this.type == "rent" ||
          (this.destinationAddress && this.destinationAddress.place_id)) &&
        this.vehicleType
      );
      // alert(JSON.stringify(this.pickupAddress.coordinate))
      if (
        this.selectedEmployee &&
        this.pickupAddress &&
        (this.pickupAddress.place_id || this.pickupAddress.coordinate) &&
        (this.type == "rent" ||
          (this.destinationAddress && this.destinationAddress.place_id)) &&
        this.vehicleType && (this.type == "bid" ? this.bidAmount >= this.baseFare : true)
      ) {
        var data = {
          employee: this.selectedEmployee._id,
          pickUpAddress: this.pickupAddress,
          dropOffAddress: this.destinationAddress,
          vehicleType: this.vehicleType,
          name: this.riderName,
          // type: this.type,
          type: this.scheduled ? "corporateScheduled" : "corporate",
          // passengerId: this.riderId,
          email: this.email,
          // phone: "+251" + intPhone.toString(),
        };

        if (this.scheduled) {
          var dateTime = new Date(this.date);
          dateTime.setHours(this.hour);
          dateTime.setMinutes(this.minute);
          data["schedule"] = dateTime;
        }
        if (this.selectedDriver && this.selectedDriver.vehicle) {
          data.vehicle = this.selectedDriver.vehicle._id;
          data.driver = this.selectedDriver._id;
        }

        // if (this.type == "corporate" && this.ticketId) {
        //   data["ticket"] = this.ticketId;
        // } else if (this.type == "corporate" && !this.ticketId) {
        //   this.ticketError = true;
        //   return;
        // }

        this.socket.emit("searchCorporate", data);

        this.dispatching = true;
      }
    },
    estimate() {
      if (this.vehicleType && this.pickupAddress && this.destinationAddress) {
        this.socket.emit("estimate", {
          vehicleType: this.vehicleType,
          pickUpAddress: this.pickupAddress,
          dropOffAddress: this.destinationAddress,
        });
      }
    },
    validateTicket() {
      this.ticketError = false;
      this.ticketId = "";
      if (this.ticket.length == 10 && this.phoneNumber) {
        this.ticketLoading = true;
        this.$misc
          .get(`tickets/validate/${this.ticket}/+251${this.phoneNumber}`)
          .then((response) => {
            if (response && response.data) {
              this.ticketId = response.data;
              this.ticketLoading = false;
              this.ticketError = false;
            }
          })
          .catch((err) => {
            this.ticketError = true;
            console.log(err);
          })
          .finally(() => {
            this.ticketLoading = false;
          });
      }
    },
    searchDriver(name) {
      if (name) {
        this.$misc
          .get("drivers/search?vehicle=true&limit=5&q=" + name)
          .then((drivers) => {
            this.drivers = drivers.data.map((driver) => {
              if (driver.vehicle != null && driver.vehicle.online == true) {
                driver.disabled = false;
              } else {
                driver.disabled = true;
              }
              return driver;
            });
          })
          .catch((err) => console.log(err))
          .finally(() => (this.loading = false));
      } else {
        this.drivers = [];
      }
    },
    searchEmployee(name) {
      if (name) {
        this.$http
          .get(
            `corporates/${this.$store.getters.corporateRole.corporate}/employees?page=1${name ? "&q=" + name : ""
            }&limit=100&active=true`
          )
          .then((response) => {
            this.employees = response.data.data;
          })
          .catch((err) => console.log(err))
          .finally(() => (this.loading = false));

        // this.$misc
        //   .get("drivers/search?vehicle=true&limit=5&q=" + name)
        //   .then((employees) => {
        //     this.employees = employees.data
        //   })
        //   .catch((err) => console.log(err))
        //   .finally(() => (this.loading = false));
      } else {
        this.employees = [];
      }
    },
    searchRiders(phone) {
      this.riderName = "";
      this.riderId = "";
      this.email = "";
      if (phone) {
        this.$misc
          .get("users/search?limit=5&q=" + phone)
          .then((passengers) => {
            this.passengers = passengers.data;
            var passenger = this.passengers.find(
              (passenger) => passenger.phoneNumber == "+251" + phone
            );
            if (passenger) {
              this.selectRider(passenger);
            }
          })
          .catch((err) => console.log(err))
          .finally(() => (this.loading = false));
      } else {
        this.passengers = [];
      }
    },
    selectDriver(driver) {
      if (!driver.disabled) {
        this.selectedDriver = driver;
        this.driverName =
          driver.firstName + " " + driver.lastName + " - " + driver.phoneNumber;
        this.drivers = [];
      }
    },
    selectEmployee(employee) {
      if (!employee.disabled) {
        this.selectedEmployee = employee;
        this.employeeName =
          employee.name + " - " + employee.phone;
        this.employees = [];
      }
    },
    selectRider(passenger) {
      if (passenger) {
        this.riderId = passenger._id;
        this.riderName = passenger.firstName + " " + passenger.lastName;
        this.email = passenger.email;
        var pn = passenger.phoneNumber.replace("+251", "");
        if (pn.length == 9 && pn[0] == "9") {
          this.phoneNumber = pn;
        } else if (pn.length == 10 && pn[0] == "0") {
          this.phoneNumber = pn.replace("0", "");
        }
        this.passengers = [];
      }
    },
    selectDriverFromMap(id) {
      const driverSelected = this.nearbyDrivers.find((x) => x._id === id);

      if (driverSelected) this.selectDriver(driverSelected.driver);
      this.selectedDriver.vehicle = { _id: driverSelected._id };

      this.estimatedArrivalTime = (
        4 +
        (Number(driverSelected.distance) / 15) * 60
      ).toFixed(2);
    },
  },
};
</script>
