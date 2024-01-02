<template>
  <div class="relative">
    <div @paste="onPaste" ref="anyPlace" class="p-8">
      <h2 class="font-semibold text-gray-600 uppercase pb-2">Add Scheduled Trip</h2>
      <form @submit.prevent>
        <div class="flex -mx-4" v-if="type !== 'corporate'">
          <div class="w-1/3">
            <div class="p-4">
              <label class="block">
                <span class="text-gray-700">Passenger Contact Number</span>
                <div class="flex row">
                  <h3 class="pt-3 pr-3">+251</h3>
                  <div class="w-full">
                    <input
                      required
                      minlength="9"
                      maxlength="9"
                      v-model="phoneNumber"
                      class="block w-full mt-1 form-input"
                      placeholder="912 345678"
                      @keyup="searchRiders(phoneNumber)"
                    />
                    <ul
                      v-if="passengers.length"
                      class="absolute mt-1 overflow-y-auto bg-white border rounded shadow max-h-56"
                    >
                      <li
                        v-for="(result, index) in passengers"
                        :key="`pickadd-${index}`"
                        class="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                        v-bind:class="{
                          'bg-red-100 hover:bg-blue-700 hover:text-red-500 cursor-not-allowed':
                            result.disabled,
                        }"
                        @click="selectRider(result)"
                      >
                        {{ result.firstName + " " + result.lastName }},
                        {{ result.phoneNumber }}
                      </li>
                    </ul>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div class="w-1/3">
            <div class="p-4">
              <label class="block">
                <span class="text-gray-700">Passenger Name</span>
                <input
                  v-model="riderName"
                  class="block w-full mt-1 form-input"
                  placeholder="Melaku Wedajo"
                />
              </label>
            </div>
          </div>
          <div class="w-1/3">
            <div class="p-4">
              <label class="block">
                <span class="text-gray-700">Passenger Email</span>
                <input
                  class="block w-full mt-1 form-input"
                  v-model="email"
                  placeholder="melaku.wedajo@domain.com"
                />
              </label>
            </div>
          </div>
        </div>
        <hr />
        <div class="flex -mx-4">
          <div class="bg-blue" style="min-height: 70vh; width: 26rem; max-with: 26rem">
            <div class="p-4">
              <div class="p-4 space-y-4 border rounded-lg">
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
                  <div class="w-1/2 mr-2">
                    <label class="block">
                      <span class="text-gray-700">Type</span>
                      <select v-model="type" class="block w-full mt-1 form-select">
                        <option value="normal">Normal</option>
                        <option value="bid">Bid</option>
                        <option value="rent">Rent</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </label>
                  </div>

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

                  <div class="w-1/2" v-if="type == 'normal'">
                    <label class="block">
                      <span class="text-gray-700">Schedule</span>
                      <select v-model="scheduled" class="block w-full mt-1 form-select">
                        <option :value="false">Now</option>
                        <option :value="true">Scheduled</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div v-if="type == 'corporate'" class="w-full flex gap-4 mt-4 px-1">
                  <label class="block">
                    <span class="text-gray-700">Corporate</span>
                    <div v-if="loadingCorps">Loading corporates...</div>
                    <div v-else>
                      <select class="block h-10 form-select" v-model="selectedCorporate">
                        <option
                          v-for="corp in corporatesList"
                          :key="corp._id"
                          :value="corp._id"
                        >{{ corp.name }}</option>
                      </select>
                    </div>
                  </label>
                  <label class="block" v-if="selectedCorporate !== null">
                    <span class="text-gray-700">Employee</span>
                    <div v-if="loadingEmployees">Loading employees...</div>
                    <div v-else>
                      <select class="block h-10 form-select" v-model="selectedEmployee">
                        <option
                          v-for="employee in employeesList"
                          :key="employee._id"
                          :value="employee._id"
                        >{{ employee.name }}</option>
                      </select>
                    </div>
                  </label>
                  <!-- <label class="block">
                      <span class="text-gray-700">
                        Ticket
                        <small
                          v-if="ticketId"
                          class="px-2 py-px text-green-800 bg-green-200 border border-green-800 rounded"
                        >Verified</small>
                        <small
                          v-if="ticketError"
                          class="px-2 py-px text-red-800 bg-red-200 border border-red-800 rounded"
                        >Invalid</small>
                      </span>
                      <input
                        :disabled="ticketLoading"
                        class="block w-full mt-1 form-input"
                        type="text"
                        v-model="ticket"
                        maxlength="10"
                        minlength="10"
                        required
                        placeholder="Ticket"
                      />
                  </label>-->
                </div>

                <div v-if="scheduled && type == 'normal'" class="flex gap-2">
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

                <div v-if="type == 'rent'" class="flex">
                  <div class="flex w-full">
                    <div class="w-1/3 mr-1">
                      <label class="block">
                        <span class="text-gray-700">Hour</span>
                        <select v-model="rentHour" class="block w-full mt-1 form-select">
                          <option v-for="i in 24" :key="i" :value="i">{{ i }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="w-1/3 mr-1">
                      <label class="block">
                        <span class="text-gray-700">Day</span>
                        <select v-model="rentDay" class="block w-full mt-1 form-select">
                          <option :value="0">{{ 0 }}</option>
                          <option v-for="i in 31" :key="i" :value="i">{{ i }}</option>
                        </select>
                      </label>
                    </div>
                    <div class="w-1/3">
                      <label class="block">
                        <span class="text-gray-700">Month</span>
                        <select v-model="rentMonth" class="block w-full mt-1 form-select">
                          <option :value="0">{{ 0 }}</option>
                          <option v-for="i in 12" :key="i" :value="i">{{ i }}</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="-mx-4">
                  <div class="px-4">
                    <OriginAddressSearchBox
                      required
                      :initialValue="pickUpAddress"
                      v-model="pickUpAddress"
                      :customPlace="customPickupAddress"
                      v-on:input="estimate"
                      :map="map"
                    />
                  </div>
                  <div class="px-4" v-if="type != 'rent'">
                    <DestinationAddressSearchBox
                      required
                      :initialValue="destinationAddress"
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
                      v-if="type === 'corporate'"
                      @click="dispatchCorporate()"
                      :disabled="!validCorporate"
                      type="submit"
                      class="flex items-center justify-center w-full py-2 font-semibold text-white rounded"
                      :class="
                        !validCorporate
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
                    <button
                      v-else
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
                  <span>{{ (distance / 1000).toFixed(2) }} KM</span>
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
              <!-- <div class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow" ref="map"></div> -->
              <div class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow">
                <!-- <MglMap
                  :accessToken="accessToken"
                  :mapStyle="mapStyle"
                  :center="mapOptions.center"
                  :zoom="mapOptions.zoom"
                >
                  <MglGeojsonLayer
                    :sourceId="geoJsonSource.data.id"
                    :source="geoJsonSource"
                    layerId="somethingSomething"
                    :layer="geoJsonLayer"
                  />
                </MglMap>-->
                <MapBox
                  :route1="route1"
                  :markers="markers"
                  :mapCenter="mapCenter"
                  :mapZoom="mapZoom"
                  popupData="popup"
                  @markerClicked="selectDriverFromMap"
                ></MapBox>
              </div>
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
    <div
      v-if="fetchingTripSearch"
      class="absolute top-0 z-50 flex items-center justify-center w-full h-screen text-white bg-gray-700 bg-opacity-50"
    >loading data... please wait</div>
  </div>
</template>

<script>
import { focus } from "vue-focus";
import OriginAddressSearchBox from "@/components/OriginAddressSearchBox";
import DestinationAddressSearchBox from "@/components/DestinationAddressSearchBox";
import { io } from "socket.io-client";
import { config } from "@/config";
import init from "@/gmaps";
import polyline from "google-polyline";

import MapBox from "../../components/MapBox"

export default {
  directives: {
    focus,
  },
  components: {
    OriginAddressSearchBox,
    DestinationAddressSearchBox,
    MapBox,
    // MglMap,
    // MglGeojsonLayer,

  },
  data() {
    return {
      driverName: "",
      requests: [],
      drivers: [],
      selectedDriver: null,
      estimateFare: 0,
      duration: 0,
      ticketError: false,
      distance: 0,
      passengers: [],
      scheduled: false,
      type: "normal",
      riderId: "",
      fare: 0,
      dispatching: false,
      email: "",
      socket: null,
      phoneNumber: "",
      riderName: "",
      pickUpAddress: {
        name: "",
        coordinate: {},
      },
      destinationAddress: {
        name: "",
        coordinate: {},
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

      loadingCorps: false,
      corporatesList: [],
      selectedCorporate: null,

      loadingEmployees: false,
      employeesList: [],
      selectedEmployee: null,

      corporateEstimation: {},

      directionService: {},

      polyline: "",

      route1: [],


      markers: [],
      mapZoom: null,
      mapCenter: {
      },
    };
  },
  async mounted() {
    this.google = await init();

    this.directionService = new this.google.maps.DirectionsService();
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
    this.google = await init();

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
        coordinate: {}
      };
      this.pickUpAddress = {
        name: "",
        coordinate: {}
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
        coordinate: {}
      };
      this.pickUpAddress = {
        name: "",
        coordinate: {}
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


    this.getVehicleTypes();

    if (this.$route.query.tripSearch) {
      this.fetchTripSearch(this.$route.query.tripSearch).then(tripSearch => {
        const { passenger, vehicleType, pickUpAddress, dropOffAddress } = tripSearch.data;

        this.phoneNumber = passenger.phoneNumber.slice(4);
        this.riderName = passenger.firstName + " " + passenger.lastName;

        this.email = passenger.email || " - "

        this.vehicleType = vehicleType._id

        this.pickUpAddress = pickUpAddress
        if (!this.pickUpAddress.place_id) this.pickUpAddress = {
          name: this.pickUpAddress.name,
          coordinate: {
            lat: this.pickUpAddress.lat,
            long: this.pickUpAddress.long
          }
        }

        this.destinationAddress = dropOffAddress

        if (!this.destinationAddress.place_id) this.destinationAddress = {
          name: this.destinationAddress.name,
          coordinate: {
            lat: this.destinationAddress.lat,
            long: this.destinationAddress.long
          }
        }

        this.estimate()

        // alert(JSON.stringify(pickUpAddress, null, 2));
        // alert(JSON.stringify(dropOffAddress, null, 2));
      })
    }
  },
  computed: {
    // mapOptions() {
    //   return {
    //     center: {
    //       lat: 9.004912,
    //       lng: 38.778282,
    //     },
    //     zoom: 12,
    //   }
    // },
    // geoJsonSource() {
    //   return {
    //     type: 'geojson',
    //     data: {
    //       id: "thisIsMySource",
    //       type: "FeatureCollection",
    //       features: [
    //         {
    //           type: "Feature",
    //           geometry: {
    //             type: "LineString",
    //             coordinates: this.lineString
    //           },
    //           properties: {
    //             id: "value0"
    //           }
    //         }
    //       ]
    //     },
    //   }  
    // },
    baseFare() {
      if (this.type === "corporate") {
        return this.corporateEstimation.baseFare;
      } else {
        const selected = this.vehicleTypes.find(
          (v) => v._id === this.vehicleType
        );
        return selected && selected != undefined
          ? selected.baseFare
          : 0;
      }
    },
    estimatedFare() {
      if (this.type === "corporate") {
        if (this.distance)
          return (
            ((this.distance / 1000) * this.corporateEstimation.pricePerKM) +
            //this.duration * selected.pricePerMin +
            this.corporateEstimation.baseFare
          ).toFixed(2)
        return "-"
        // return this.corporateEstimation.estimatedFare ? this.corporateEstimation.estimatedFare.toFixed(2) : "";
      } else {
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
                ((this.distance / 1000) * selected.pricePerKM) +
                //this.duration * selected.pricePerMin +
                selected.baseFare
              ).toFixed(2)
            : 0;
        }
      }
    },
    validCorporate() {
      return this.selectedEmployee &&
        this.selectedCorporate &&
        this.pickUpAddress &&
        this.destinationAddress &&
        this.vehicleType
    },
    // estimatedArrivalTime() {
    //   if (this.selectedDriver) {
    //     return ((Number(this.distance) / 40) * 60).toFixed(2);
    //   } else return null;
    // },
    durationString() {
      const d = this.duration / 60
      var minute = d % 60;
      var hour = (d - minute) / 60;
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
    phoneNumber() {
      this.validateTicket();
    },
    // customPickupAddress(customCoordinatesAreSet) {
    //   if (customCoordinatesAreSet === true && this.pickUpAddress.coordinate) {
    //     const geocoder = new this.google.maps.Geocoder();
    //     geocoder.geocode(
    //       {
    //         location: {
    //           lat: this.pickUpAddress.coordinate.lat,
    //           lng: this.pickUpAddress.coordinate.long,
    //         },
    //       },
    //       (results, status) => {
    //         if (status === "OK") {
    //           if (results[0]) {
    //             this.pickUpAddress.name = results[0].formatted_address;
    //             this.customPickupAddress = results[0].formatted_address;
    //           } else {
    //             window.alert("No results found");
    //           }
    //         } else {
    //           window.alert("Geocoder failed due to: " + status);
    //         }
    //       }
    //     );
    //   }
    // },
    pickUpAddress(newPickUpAddress) {
      //   this.map = new this.google.maps.Map(this.$refs.map, {
      //   center: {
      //     lat: 9.004912,
      //     lng: 38.778282,
      //   },
      //   zoom: 10,
      // });
      // if (newPickUpAddress && newPickUpAddress.place_id)
      //   this.customPickupAddress = false;

      // for (const marker in this.markers) {
      //   this.markers[marker].setMap(null);
      // }


      // var request = {
      //   placeId: newPickUpAddress.place_id,
      // };

      // const callback = (place, status) => {
      //   if (status == this.google.maps.places.PlacesServiceStatus.OK) {
      //     var marker = new this.google.maps.Marker({
      //       map: this.map,
      //       position: place.geometry.location
      //     });
      //     this.map.setCenter(marker.getPosition());
      //     this.map.setZoom(16)
      //   }
      // }

      // var marker = new this.google.maps.Marker({
      //   map: this.map,
      //   position: { lat: newPickUpAddress.coordinate.lat, lng: newPickUpAddress.coordinate.long },
      //   icon: "http://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686565/pxc38df2vfobmgmmxi95.png",
      // });
      this.mapCenter = [newPickUpAddress.coordinate.lat, newPickUpAddress.coordinate.long]

      this.mapZoom = 14

      // let service = new this.google.maps.places.PlacesService(this.map);
      // service.getDetails(request, callback);

      // this.markers.pickup = marker;

      console.log("+>@>", newPickUpAddress.coordinate.long);
      this.socket.emit("nearbyDrivers", {
        location: newPickUpAddress,
        vehicleType: this.vehicleType,
      });
    },
    destinationAddress(newDestinationAddress) {
      if (newDestinationAddress && newDestinationAddress.name) {
        // this.map.setCenter({
        //   lat: 9.004912,
        //   lng: 38.778282,
        // })

        // var marker = new this.google.maps.Marker({
        //   map: this.map,
        //   position: { lat: newDestinationAddress.coordinate.lat, lng: newDestinationAddress.coordinate.long },
        //   icon: "https://res.cloudinary.com/ika/image/upload/w_30,h_50/v1606686806/cot62kytpswv7lzdextc.png"
        // });
        this.mapCenter = {
          lat: 9.004912,
          lng: 38.778282,
        }
        this.mapZoom = 10
        this.markers = []
        // this.map.setCenter(marker.getPosition());
        // this.map.setZoom(10);

        // if (this.markers.dropOff) {
        //   this.markers.dropOff.setMap(null)
        // }

        // this.markers.dropOff = marker;
      }

    },
    vehicleType(newVal) {
      if (newVal) {
        // for (const marker in this.markers) {
        //   this.markers[marker].setMap(null);
        // }

        this.markers = []
        this.socket.emit("nearbyDrivers", {
          location: this.pickUpAddress,
          vehicleType: newVal,
        });
      }
    },
    nearbyDrivers(newData) {

      this.markers = newData.map(x => {
        return {
          id: x._id,
          coordinates: [x.position.coordinates[0], x.position.coordinates[1]],
          color: x.driver.isEmployee ? "blue" : "green"
        }
      })

      // newData.forEach((element) => {
      //   element.driver = element.driver ? element.driver : {};
      //   if (element.position) {
      //     var icon =
      //       "https://res.cloudinary.com/torpa/image/upload/e_tint:100:green/w_30,h_30/v1598171147/carMarker_vpibvl.png";
      //     if (this.markers[element._id]) {
      //       this.markers[element._id].setPosition({
      //         lat: element.position.coordinates[1],
      //         lng: element.position.coordinates[0],
      //       });
      //       this.markers[element._id].setIcon(icon);
      //     } else {
      //       this.markers[element._id] = new this.google.maps.Marker({
      //         position: {
      //           lat: element.position.coordinates[1],
      //           lng: element.position.coordinates[0],
      //         },
      //         icon,
      //         title: element.driver ? element.driver.fullName : "-",
      //       });

      //       this.markers[element._id].setMap(this.map);
      //       this.markers[element._id].addListener("click", () => {
      //         this.selectDriverFromMap(element._id);
      //       });
      //     }
      //   }
      // });
    },
    type(newValue) {
      if (newValue === 'corporate') {
        this.fetchCorporatesList();
      }
    },
    selectedCorporate(corporate) {
      const c = this.corporatesList.find(x => x._id === corporate)

      if (c && c.pricing) {
        this.corporateEstimation = c.pricing
      }

      this.fetchEmployeesList();
      this.estimate()
    }
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
    fetchCorporatesList() {
      this.loadingCorps = true;
      this.$http
        .get("corporates/list-for-dispatcher")
        .then((response) => {
          this.corporatesList = response.data.data
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loadingCorps = false));
    },
    fetchEmployeesList() {
      this.loadingEmployees = true;
      this.$http
        .get("corporates/employees-list?corporate=" + this.selectedCorporate)
        .then((response) => {
          this.employeesList = response.data.data
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loadingEmployees = false));
    },
    fetchTripSearch(tripSearchId) {
      this.fetchingTripSearch = true;
      var path = `trip-searches/${tripSearchId}`;

      return this.$http
        .get(path)
        .finally(() => (this.fetchingTripSearch = false));
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
      console.log(this.pickUpAddress.coordinate)
      console.log(
        ">>>>>",
        intPhone &&
        intPhone.toString().length == 9 &&
        this.pickUpAddress &&
        this.pickUpAddress.name &&
        this.pickUpAddress.coordinate &&
        this.pickUpAddress.coordinate.lat &&
        this.pickUpAddress.coordinate.long &&
        (this.type == "rent" ||
          (this.destinationAddress && this.destinationAddress.coordinate && this.destinationAddress.name)) &&
        this.vehicleType
      );
      // alert(JSON.stringify(this.pickUpAddress.coordinate))
      // alert(this.type)
      if (
        intPhone &&
        intPhone.toString().length == 9 &&
        this.pickUpAddress &&
        (this.pickUpAddress.name && this.pickUpAddress.coordinate && this.pickUpAddress.coordinate.lat && this.pickUpAddress.coordinate.long) &&
        (this.type == "rent" ||
          (this.destinationAddress && this.destinationAddress.name && this.destinationAddress.coordinate && this.destinationAddress.coordinate.lat && this.destinationAddress.coordinate.long)) &&
        this.vehicleType && (this.type == "bid" ? this.bidAmount >= this.baseFare : true)
      ) {

        // var request = {
        //   origin: new this.google.maps.LatLng(this.pickUpAddress.coordinate.lat, this.pickUpAddress.coordinate.long),
        //   destination: new this.google.maps.LatLng(this.destinationAddress.coordinate.lat, this.destinationAddress.coordinate.long),
        //   travelMode: 'DRIVING'
        // };
        // this.directionService.route(request, (result, status) => {
        //   if (status == 'OK') {
        //     if (result.routes && result.routes.length > 0) {

        //       const polyline = result.routes[0].overview_polyline;
        //       const distance = (result.routes[0].legs || []).reduce((prev, curr) => prev + curr.distance.value, 0)
        //       const duration = (result.routes[0].legs || []).reduce((prev, curr) => prev + curr.duration.value, 0)

        var data = {
          pickUpAddress: this.pickUpAddress,
          dropOffAddress: this.destinationAddress,
          vehicleType: this.vehicleType,
          name: this.riderName,
          type: this.type,
          passengerId: this.riderId,
          email: this.email,
          phone: "+251" + intPhone.toString(),
          route: {
            distance: this.distance,
            duration: this.duration,
            polyline: this.polyline,
          }
        };

        if (this.scheduled && this.type == "normal") {
          var dateTime = new Date(this.date);
          dateTime.setHours(this.hour);
          dateTime.setMinutes(this.minute);
          data["schedule"] = dateTime;
        }
        if (this.selectedDriver && this.selectedDriver.vehicle) {
          data.vehicle = this.selectedDriver.vehicle._id;
          data.driver = this.selectedDriver._id;
        }

        if (this.type == "corporate" && this.ticketId) {
          data["ticket"] = this.ticketId;
        } else if (this.type == "corporate" && !this.ticketId) {
          this.ticketError = true;
          return;
        }

        if (this.type == "bid") {
          data["bidAmount"] = this.bidAmount;
        }

        if (this.type == "rent") {
          // var startTimestamp = new Date();
          // var endTimestamp = new Date();
          // endTimestamp.setHours(endTimestamp.getHours() + this.rentHour);
          // endTimestamp.setDate(endTimestamp.getDate() + this.rentDay);
          // endTimestamp.setMonth(endTimestamp.getMonth() + this.rentMonth);
          // data["startTimestamp"] = startTimestamp;
          // data["endTimestamp"] = endTimestamp;
          data["duration"] =
            this.rentHour + this.rentDay * 24 + this.rentMonth * 24 * 30;
          this.socket.emit("rent", data);
        } else {
          this.socket.emit("search", data);
        }

        this.dispatching = true;
      }
      //   }
      // });
      // }
    },
    dispatchCorporate() {

      if (
        this.selectedEmployee &&
        this.selectedCorporate &&
        this.pickUpAddress &&
        (this.pickUpAddress.name && this.pickUpAddress.coordinate && this.pickUpAddress.coordinate.lat && this.pickUpAddress.coordinate.long) &&
        (this.destinationAddress && this.destinationAddress.name && this.destinationAddress.coordinate && this.destinationAddress.coordinate.lat && this.destinationAddress.coordinate.long) &&
        this.vehicleType
      ) {
        var data = {
          employee: this.selectedEmployee,
          corporate: this.selectedCorporate,
          pickUpAddress: this.pickUpAddress,
          dropOffAddress: this.destinationAddress,
          route: {
            distance: this.distance,
            duration: this.duration,
            polyline: this.polyline,
          },
          vehicleType: this.vehicleType,
          type: this.scheduled ? "corporateScheduled" : "corporate",
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

        this.socket.emit("searchCorporateFromDispatcher", data);

        this.dispatching = true;
      }

    },
    estimate() {
      if (this.vehicleType &&
        this.pickUpAddress.name && this.pickUpAddress.coordinate && this.pickUpAddress.coordinate.lat && this.pickUpAddress.coordinate.long &&
        this.destinationAddress.name && this.destinationAddress.coordinate && this.destinationAddress.coordinate.lat && this.destinationAddress.coordinate.long
      ) {
        // this.socket.emit("estimate", {
        //   vehicleType: this.vehicleType,
        //   pickUpAddress: this.pickUpAddress,
        //   dropOffAddress: this.destinationAddress,
        //   selectedCorporate: this.selectedCorporate,
        // });

        var request = {
          origin: new this.google.maps.LatLng(this.pickUpAddress.coordinate.lat, this.pickUpAddress.coordinate.long),
          destination: new this.google.maps.LatLng(this.destinationAddress.coordinate.lat, this.destinationAddress.coordinate.long),
          travelMode: 'DRIVING'
        };
        this.directionService.route(request, (result, status) => {
          if (status == 'OK') {
            if (result.routes && result.routes.length > 0) {

              // alert(JSON.stringify(result.routes, null, 2));
              // console.log(JSON.stringify(result.routes, null, 2));

              this.polyline = result.routes[0].overview_polyline;
              this.distance = result.routes[0].legs[0].distance.value
              this.duration = result.routes[0].legs[0].duration.value
              // data.routes[0].legs[0].distance.value;

              this.route1 = polyline.decode(this.polyline).map(x => [x[1], x[0]])

              var path = this.route1.map((coord) => {
                return { lat: coord[0], lng: coord[1] };
              });
              console.log(path)

              if (this.markers.polyline) {
                this.markers.polyline.setMap(null)
              }

              this.markers.polyline = new this.google.maps.Polyline({
                path: path,
                geodesic: true,
                map: this.map,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              });
              this.map.setZoom(11);

            }
          }
        })
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
