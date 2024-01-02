<template>
  <div @click="openDropdown = false">
    <div class="space-y-4">
      <div class="flex justify-between">
        <h2 class="font-semibold text-gray-600 uppercase">Drivers</h2>
        <router-link
          to="/drivers/add"
          class="flex h-10 px-4 pt-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          <svg class="mr-2 text-light-blue-500" width="12" height="20" fill="currentColor">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"
            />
          </svg>
          Add Driver
        </router-link>
      </div>

      <div class="flex justify-between w-full">
        <div class="flex justify-between">
          <div class="relative w-full max-w-sm">
            <div class="pr-3">
              <label class="block">
                <span class="text-gray-700">Search Name</span>
                <div class="absolute inset-y-auto flex items-center px-3 py-2">
                  <i class="text-gray-500 material-icons">search</i>
                </div>
                <input
                  class="w-full py-2 pl-10 pr-4 border rounded"
                  v-model="searchText"
                  placeholder="Search Driver(s) By Name"
                />
              </label>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="pb-1 text-sm text-center text-gray-700">Filter by Date</div>
          <v-date-picker v-model="range" is-range timezone="UTC">
            <template v-slot="{ inputValue, inputEvents }">
              <div class="flex items-center justify-center">
                <input
                  :value="inputValue.start"
                  v-on="inputEvents.start"
                  placeholder="From Date"
                  class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                />
                <svg class="w-10 h-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <input
                  :value="inputValue.end"
                  v-on="inputEvents.end"
                  placeholder="To Date"
                  class="w-32 h-10 px-2 py-1 border rounded focus:outline-none focus:border-indigo-300"
                />
              </div>
            </template>
          </v-date-picker>
        </div>
        <div class="pr-3">
          <label class="block">
            <span class="text-gray-700">Status</span>

            <select class="block h-10 form-select" @change="setApprovedFilter">
              <option :selected="selectedApprovedFilter === 'both'" value="both">All Status</option>
              <option :selected="selectedApprovedFilter === 'approved'" value="approved">Approved</option>
              <option
                :selected="selectedApprovedFilter === 'unapproved'"
                value="unapproved"
              >Unapproved</option>
            </select>
          </label>
        </div>
        <div class="pr-3">
          <label class="block">
            <span class="text-gray-700">Employeement</span>

            <select class="block h-10 form-select" @change="setEmployeementFilter">
              <option :selected="selectedEmployeementFilter === 'all'" value="all">All</option>
              <option :selected="selectedEmployeementFilter === 'employee'" value="employee">Employee</option>
              <option :selected="selectedEmployeementFilter === 'not-employee'" value="not-employee">Not Employee</option>
            </select>
          </label>
        </div>
        <div class="pr-3">
          <label class="block">
            <span class="text-gray-700">Completeness</span>
          </label>
          <select class="form-select" v-model="completed" @change="fetchDrivers">
            <option :selected="completed === 'all'" value="all">All</option>
            <option :selected="completed === 'true'" value="true">complete</option>
            <option :selected="completed === 'false'" value="false">uncomplete</option>
          </select>
        </div>
        <div class="pt-5 pr-3 text-blue-500">
          <export-button
            class="border-blue-500"
            :downloadUrl="reportDownloadUrl"
            :working="loading"
          ></export-button>
          <export-button
            class="border-blue-500"
            :downloadUrl="driverFinanceReportDownloadUrl"
            :working="loading"
            label="driver finance"
            disabled-label="driver finance disabled"
            :disabled="!$store.getters.role.permissions['drivers-finance'] || !$store.getters.role.permissions['drivers-finance'].canAccess"
          ></export-button>
        </div>
      </div>

      <div class="inline-block min-w-full mt-4 rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Name</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >ID</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Is Employee</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Contact Number</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Rating</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Balance</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Vehicle Type</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Status</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Complete</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Plate Number</th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Registered</th>
              <th
                class="px-2 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
              >Paid</th>
              <th class="px-5 py-3 bg-gray-100 border-b-2 border-gray-200"></th>
            </tr>
          </thead>
          <tbody class="relative" v-if="drivers.length">
            <tr
              v-for="(driver, index) in drivers"
              :key="driver._id"
              :class="{ 'bg-yellow-300': driver.isEmployee, 'bg-white': !driver.isEmployee }"
            >
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <router-link :to="`/drivers/${driver._id}`" class="whitespace-no-wrap">
                  <div class="flex items-center space-x-2">
                    <div class="relative">
                      <div class="w-12 h-12 overflow-hidden rounded-full">
                        <!-- <div
                        class="w-12 h-12 overflow-hidden border-4 border-green-500 rounded-full"
                        >-->
                        <img :src="driver.profileImage" :alt="driver.firebaseId" />
                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>{{ driver.firstName + " " + driver.lastName }}</div>
                  </div>
                </router-link>
              </td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <p
                  class="text-gray-900 whitespace-no-wrap"
                >{{ driver.driverId != undefined ? driver.driverId : '-' }}</p>
              </td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ driver.isEmployee ? "yes" : "no" }}</p>
              </td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ driver.phoneNumber }}</p>
              </td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">0.0</p>
              </td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">{{ driver.ballance.toFixed(2) }}</p>
              </td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{
                    driver.vehicle && driver.vehicle.vehicleType
                      ? driver.vehicle.vehicleType.name
                      : "N/A"
                  }}
                </p>
              </td>
              <td
                class="px-5 py-5 text-sm border-b border-gray-200"
              >{{ driver.approved ? "Approved" : "Not Approved" }}</td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                <div v-if="driver.completed" class="w-6 h-6 bg-green-500 rounded-full"></div>
                <div v-else class="w-6 h-6 bg-gray-500 rounded-full"></div>
              </td>
              <td
                class="px-5 py-5 text-sm border-b border-gray-200"
              >{{ driver.vehicle ? driver.vehicle.plateNumber : " N/A " }}</td>
              <td class="px-5 py-5 text-sm border-b border-gray-200">
                {{
                  driver.createdAt.slice(0, 10).split("-").reverse().join("-")
                }}
              </td>
              <td class="px-2 py-5 text-sm border-b border-gray-200">
                <div v-if="driver.hasCompletedPayment" class="w-6 h-6 bg-green-500 rounded-full"></div>
                <div v-else class="w-6 h-6 bg-gray-500 rounded-full"></div>
              </td>
              <td class="px-5 py-5 text-sm text-right bg-white border-b border-gray-200">
                <div
                  @click.stop
                  class="relative inline-block text-left"
                  v-click-outside="hideDropdown"
                >
                  <div>
                    <span class="rounded-md shadow-sm">
                      <button
                        @click="toggleDropdown(index)"
                        type="button"
                        class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                        aria-haspopup="true"
                        :aria-expanded="openDropdown === index"
                        :ref="
                          openDropdown === index
                            ? 'drivers-dropdown-trigger-' + ref
                            : ''
                        "
                      >
                        <i class="material-icons">more_vert</i>
                      </button>
                    </span>
                  </div>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div
                      v-if="openDropdown === index"
                      class="absolute right-0 z-10 w-56 origin-top-right rounded-md shadow-lg"
                      :ref="
                        openDropdown === index ? 'drivers-dropdown-' + ref : ''
                      "
                    >
                      <div
                        class="bg-white rounded-md shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div class="py-1">
                          <router-link
                            :to="`rides?driver=${driver._id}`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            v-show="driver.vehicle"
                          >
                            <i class="material-icons">history</i>
                            <span>Trip History</span>
                          </router-link>
                        </div>
                        <div class="py-1">
                          <router-link
                            :to="`/drivers/availability/${driver._id}`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            v-show="driver.vehicle"
                          >
                            <i class="material-icons">history</i>
                            <span>Availability History</span>
                          </router-link>
                        </div>
                        <div class="py-1" v-if="driver.vehicle && driver.vehicle.position">
                          <router-link
                            :to="`/birds-eye-view?driver=${driver._id}&lat=${driver.vehicle.position.coordinates[1]}&long=${driver.vehicle.position.coordinates[0]}`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            v-show="driver.vehicle"
                          >
                            <i class="material-icons">place</i>
                            <span>Locate Vehicle</span>
                          </router-link>
                        </div>
                        <div class="py-1">
                          <router-link
                            :to="`vehicles/add?driver=${driver._id}`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            v-show="!driver.vehicle"
                          >
                            <i class="material-icons">directions_car</i>
                            <span>Add a Vehicle</span>
                          </router-link>
                          <!-- <a
                            href="#"
                            class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            >Statement</a
                          >-->
                        </div>
                        <div class="py-1">
                          <router-link
                            :to="`wallet-managment?driver=${driver._id}`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            v-show="driver.vehicle"
                          >
                            <i class="material-icons">account_balance_wallet</i>
                            <span>Topup</span>
                          </router-link>
                        </div>
                        <div class="border-t border-gray-100"></div>
                        <div class="py-1">
                          <router-link
                            :to="`drivers/${driver._id}/edit`"
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            <i class="material-icons">edit</i>
                            <span>Edit</span>
                          </router-link>
                          <button
                            @click="toggleApproval(driver._id)"
                            v-show="driver.vehicle"
                            type="button"
                            class="flex items-center w-full px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                          >
                            <i v-if="driver.approved" class="material-icons">close</i>
                            <i v-else class="material-icons">check</i>
                            <span>
                              {{
                                driver.approved ? "Disapprove" : "Approve"
                              }}
                            </span>
                          </button>
                        </div>
                        <div
                          class="py-1"
                          v-if="$store.getters.role.permissions['device-bans'] && $store.getters.role.permissions['device-bans'].canAccess"
                        >
                          <button
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            @click="showSpecificBanModal(driver.deviceID, driver._id)"
                          >
                            <i class="material-icons">block</i>
                            <span>Ban Device (Specific)</span>
                          </button>
                        </div>
                        <div
                          class="py-1"
                          v-if="$store.getters.role.permissions['device-bans'] && $store.getters.role.permissions['device-bans'].canAccess"
                        >
                          <button
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            @click="showModelBanModal(driver.deviceModelID)"
                          >
                            <i class="material-icons">block</i>
                            <span>Ban This Device Model</span>
                          </button>
                        </div>
                        <div
                          class="py-1"
                          v-if="$store.getters.role.permissions['banned-drivers'] && $store.getters.role.permissions['banned-drivers'].canAccess"
                        >
                          <button
                            class="flex items-center px-4 py-2 space-x-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            role="menuitem"
                            @click="showDriverBanModal(driver._id)"
                          >
                            <i class="material-icons">block</i>
                            <span>Ban Driver</span>
                          </button>
                        </div>
                        <!-- <div class="border-t border-gray-300"></div>
                        <div class="py-1">
                          <button
                            @click="openConfirmBox"
                            type="button"
                            class="flex items-center w-full px-4 py-2 space-x-2 text-sm leading-5 text-red-700 hover:bg-red-200 hover:text-red-800 focus:outline-none focus:bg-red-200 focus:text-red-800"
                            role="menuitem"
                          >
                            <i class="material-icons">delete</i>
                            <span>Delete</span>
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
                                      <h3
                                        class="px-6 py-4 font-semibold text-gray-600"
                                      >
                                        Confirm Delete
                                      </h3>
                                    </div>
                                    <div
                                      class="flex items-center px-6 py-6 space-x-4"
                                    >
                                      <i class="text-4xl material-icons">
                                        warning
                                      </i>
                                      <div>
                                        <p>
                                          Are you sure you want to delete this
                                          driver?
                                        </p>
                                        <p>
                                          <em class="text-sm text-gray-600">
                                            This action can not be undone!
                                          </em>
                                        </p>
                                      </div>
                                    </div>
                                    <hr />
                                    <div
                                      class="flex items-end justify-between px-6 py-4"
                                    >
                                      <button
                                        @click="closeConfirmBox"
                                        type="button"
                                        class="px-4 py-2 text-gray-600 hover:text-gray-900"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        @click="deleteDriver(driver._id)"
                                        type="button"
                                        :disabled="deleting"
                                        class="flex items-center px-4 py-2 space-x-2 font-semibold border border-transparent rounded shadow-sm"
                                        :class="
                                          deleting
                                            ? 'bg-red-100 text-red-500 cursor-not-allowed'
                                            : 'bg-red-200 text-red-700 hover:text-red-800 hover:border-red-800'
                                        "
                                      >
                                        <i
                                          v-if="deleting"
                                          class="text-red-700 material-icons spin"
                                        >
                                          sync
                                        </i>
                                        <i v-else class="material-icons">
                                          delete
                                        </i>
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </transition>
                            </portal>
                          </button>
                        </div>-->
                      </div>
                    </div>
                  </transition>
                </div>
              </td>
            </tr>
            <div
              v-if="loading"
              class="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-25"
            >
              <i class="text-6xl material-icons spin">sync</i>
              <span class="invisible block">Loading...</span>
            </div>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="12" class="py-4 font-semibold text-center text-gray-600 bg-white">
                <div v-if="loading" class="inline-block">
                  <i class="text-6xl material-icons spin">sync</i>
                  <span class="invisible block">Loading...</span>
                </div>
                <div v-else class="inline-block">
                  <i class="text-6xl material-icons">warning</i>
                  <span class="block">No latest rides!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-end justify-between" v-if="drivers.length">
        <pagination
          class="flex space-x-2"
          :currentPage="currentPage"
          :total="total"
          @goto="goToPage"
          @setPerPage="setPerPage"
          :perPage="perPage"
          :start="start"
          :end="end"
          :count="paginator.count"
        ></pagination>
      </div>
    </div>

    <div
      v-if="showingDriverBanModal"
      class="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25"
    >
      <div @click.stop class="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
        <div class="bg-gray-100">
          <h3 class="px-6 py-4 font-semibold text-gray-600">Ban Driver</h3>
        </div>
        <div class="flex flex-col items-start px-6 py-8">
          <p>Note:</p>
          <p>
            <em class="text-sm text-gray-600">note will be displayed next time driver uses the app</em>
          </p>
          <textarea v-model="driverBanNote" class="w-full min-w-full my-2 border"></textarea>
        </div>

        <hr />
        <div class="flex items-end justify-between px-6 py-4">
          <button
            @click="showingDriverBanModal = false"
            type="button"
            class="px-4 py-2 text-gray-600 hover:text-gray-900"
          >Cancel</button>
          <button
            @click="banDriver"
            type="button"
            :disabled="loading"
            class="flex items-center px-4 py-2 space-x-2 font-semibold border border-transparent rounded shadow-sm"
            :class="
              loading
                ? 'bg-green-100 text-green-500 cursor-not-allowed'
                : 'bg-green-200 text-green-700 hover:text-green-800 hover:border-green-800'
            "
          >
            <i v-if="loading" class="text-green-700 material-icons spin">sync</i>
            <span>End</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showBanModal"
      class="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25"
    >
      <div @click.stop class="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
        <div class="bg-gray-100">
          <h3 class="px-6 py-4 font-semibold text-gray-600">Ban Driver's Device Model</h3>
        </div>
        <div class="flex flex-col items-start px-6 py-8">
          <p>Note:</p>
          <p>
            <em
              class="text-sm text-gray-600"
            >note will be displayed to all drivers with this device model</em>
          </p>
          <textarea v-model="banNote" class="w-full min-w-full my-2 border"></textarea>
        </div>

        <hr />
        <div class="flex items-end justify-between px-6 py-4">
          <button
            @click="showBanModal = false"
            type="button"
            class="px-4 py-2 text-gray-600 hover:text-gray-900"
          >Cancel</button>
          <button
            @click="banModel"
            type="button"
            :disabled="loading"
            class="flex items-center px-4 py-2 space-x-2 font-semibold border border-transparent rounded shadow-sm"
            :class="
              loading
                ? 'bg-green-100 text-green-500 cursor-not-allowed'
                : 'bg-green-200 text-green-700 hover:text-green-800 hover:border-green-800'
            "
          >
            <i v-if="loading" class="text-green-700 material-icons spin">sync</i>
            <span>End</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showBanModalSpecific"
      class="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25"
    >
      <div @click.stop class="w-full max-w-lg overflow-hidden bg-white rounded-lg shadow-lg">
        <div class="bg-gray-100">
          <h3 class="px-6 py-4 font-semibold text-gray-600">Ban Driver's Device</h3>
        </div>
        <div class="flex flex-col items-start px-6 py-8">
          <p>Note:</p>
          <p>
            <em
              class="text-sm text-gray-600"
            >Note will be displayed to the particular driver's device</em>
          </p>
          <textarea v-model="banNoteSpecific" class="w-full min-w-full my-2 border"></textarea>
        </div>

        <hr />
        <div class="flex items-end justify-between px-6 py-4">
          <button
            @click="showBanModalSpecific = false"
            type="button"
            class="px-4 py-2 text-gray-600 hover:text-gray-900"
          >Cancel</button>
          <button
            @click="banDevice"
            type="button"
            :disabled="loading"
            class="flex items-center px-4 py-2 space-x-2 font-semibold border border-transparent rounded shadow-sm"
            :class="
              loading
                ? 'bg-green-100 text-green-500 cursor-not-allowed'
                : 'bg-green-200 text-green-700 hover:text-green-800 hover:border-green-800'
            "
          >
            <i v-if="loading" class="text-green-700 material-icons spin">sync</i>
            <span>End</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import PaginationMixin from "@/mixins/Pagination";
import ExportButton from "@/components/ExportButton";
import Pagination from "@/components/Pagination";

export default {
  mixins: [PaginationMixin],
  components: {
    ExportButton,
    Pagination,
  },
  data() {
    return {
      drivers: [],
      openDropdown: false,
      loading: true,
      confirmOpen: false,
      deleting: false,
      selectedApprovedFilter: "",
      selectedEmployeementFilter: "",
      searchText: "",
      range: {
        start: null,
        end: null,
      },
      ref: "",
      completed: "all",
      showBanModalSpecific: false,
      showBanModal: false,
      showingDriverBanModal: false,

      banNoteSpecific: "",
      banNote: "",
      deviceId: null,
      driverId: null,
      deviceModelId: null,

      driverToBan: null,
      driverBanNote: null,
    };
  },
  created() {
    // this.getDrivers();
    this.fetchDrivers();
  },
  mounted() {
    // document.body.addEventListener("keyup", this.escapeListener);
    this.ref = Math.random().toString(36).substr(2, 5);
  },
  beforeDestroy() {
    document.body.removeEventListener("keyup", this.escapeListener);
    document.body.removeEventListener("click", this.clickAwayHandler);
  },
  computed: {
    // to trigger fetchDrivers
    dataRefreshTrigger() {
      return [
        this.selectedApprovedFilter,
        this.selectedEmployeementFilter,
        this.currentPage,
        this.range.start,
        this.range.end,
        this.searchText,
      ].join("|");
    },
    reportDownloadUrl() {
      let filter;

      if (this.selectedApprovedFilter === "approved") {
        filter = true;
      } else if (this.selectedApprovedFilter === "unapproved") {
        filter = false;
      } else {
        filter = null;
      }

      return (
        "drivers/export?" +
        Object.entries({
          q: this.searchText,
          ...(this.range || {}),
          approved: filter,
        })
          .map(([key, value]) => [key, value].join("="))
          .join("&")
      );
    },
    driverFinanceReportDownloadUrl() {
      return (
        "drivers-finance/export?" +
        Object.entries({
          ...Object.fromEntries(
            Object.entries({
              ...(this.range ? { from: this.range.start, to: this.range.end } : {} || {}),
            }).filter(([key, val]) => key && val)
          ),
        })
          .map(([key, value]) => [key, value].join("="))
          .join("&")
      );
    },
  },
  watch: {
    dataRefreshTrigger() {
      this.fetchDrivers();
    },
    perPage() {
      this.currentPage === 1 ? this.fetchDrivers() : (this.currentPage = 1);
    },
    openDropdown(newVal) {
      if (newVal !== false) {
        document.body.addEventListener("click", this.clickAwayHandler);
      } else {
        document.body.removeEventListener("click", this.clickAwayHandler);
      }
    },
    searchText() {
      this.currentPage = 1;
    },
  },
  methods: {
    setApprovedFilter(e) {
      this.selectedApprovedFilter = e.target.value;
    },
    setEmployeementFilter(e) {
      this.selectedEmployeementFilter = e.target.value;
    },
    escapeListener(e) {
      if (e.keyCode === 27) {
        this.closeConfirmBox();
      }
    },
    showSpecificBanModal(deviceId, driverId) {
      this.openDropdown = false;
      if (!deviceId) {
        return window.flash({
          type: "error",
          body: "No Device ID found for the driver!",
        });
      } else {
        this.showBanModal = false;
        this.showBanModalSpecific = true;
        this.showingDriverBanModal = false;

        this.banNote = "";
        this.banNoteSpecific = "";
        this.driverBanNote = "";

        this.deviceId = deviceId;
        this.driverId = driverId;
        // alert(driverId)

        // this.banDevice(deviceId, this.banNoteSpecific)
      }
    },
    showModelBanModal(deviceModelId) {
      this.openDropdown = false;
      if (!deviceModelId) {
        return window.flash({
          type: "error",
          body: "No Device Model found for the driver!",
        });
      } else {
        this.showBanModal = true;
        this.showBanModalSpecific = false;
        this.showingDriverBanModal = false;

        this.banNote = "";
        this.banNoteSpecific = "";
        this.driverBanNote = "";

        this.deviceModelId = deviceModelId;


        // this.banModel(deviceModelId, this.banNote)
      }
    },
    showDriverBanModal(driverId) {
      this.openDropdown = false;

      this.driverToBan = driverId;

      this.showBanModal = false;
      this.showBanModalSpecific = false;
      this.showingDriverBanModal = true;
      this.banNote = "";
      this.banNoteSpecific = "";

      this.driverBanNote = "";


      // this.banModel(deviceModelId, this.banNote)
    },
    // getDrivers() {
    //   let filter;

    //   if (this.selectedApprovedFilter === "approved") {
    //     filter = true;
    //   } else if (this.selectedApprovedFilter === "unapproved") {
    //     filter = false;
    //   } else {
    //     filter = null;
    //   }

    //   this.loading = true;
    //   this.$misc
    //     .get(`drivers`, {
    //       params: {
    //         page: this.currentPage,
    //         limit: this.perPage,
    //         approved: filter,
    //         from: this.startDate ? this.startDate : undefined,
    //         to: this.endDate ? this.endDate : undefined,
    //       },
    //     })
    //     .then((response) => {
    //       this.allDrivers = response.data.data;
    //       this.paginator = {
    //         nextPage: response.data.nextPage,
    //         prevPage: response.data.prevPage,
    //         count: response.data.count,
    //       };
    //     })
    //     .catch((err) => console.log(err))
    //     .finally(() => (this.loading = false));
    // },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = false;
      } else {
        this.openDropdown = index;
      }
    },
    hideDropdown() {
      this.openDropdown = false;
    },
    openConfirmBox() {
      this.confirmOpen = true;
    },
    closeConfirmBox() {
      this.confirmOpen = false;
    },
    // deleteDriver(id) {
    //   this.deleting = true;
    //   this.$misc
    //     .delete(`drivers/${id}`)
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err))
    //     .finally(() => {
    //       this.deleting = false;
    //       this.confirmOpen = false;
    //       this.openDropdown = false;
    //       this.getDrivers();
    //     });
    // },
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

      let employeesFilter;
      
      if (this.selectedEmployeementFilter === "employee") {
        employeesFilter = true;
      } else if (this.selectedEmployeementFilter === "not-employee") {
        employeesFilter = false;
      } else {
        employeesFilter = null;
      }


      this.$misc
        .get(`/drivers/admin-search`, {
          params: {
            q: this.searchText,
            from: this.range.start ? this.range.start : undefined,
            to: this.range.end ? this.range.end : undefined,
            approved: filter,
            employeesOnly: employeesFilter,
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
    toggleApproval(id) {
      const currentStatus = this.drivers.find((driver) => driver._id === id)
        .approved;
      this.$misc
        .patch(`/drivers/${id}`, {
          approved: !currentStatus,
        })
        .then(() => {
          window.flash({
            type: "success",
            body: currentStatus ? "Driver disapproved!" : "Driver approved!",
          });
          this.fetchDrivers();
        })
        .catch((err) => {
          window.flash({ type: "error", body: "Failed to approve driver!" });
          console.log(err);
        })
        .finally(() => (this.openDropdown = false));
    },
    clickAwayHandler(e) {
      if (
        (this.$refs["drivers-dropdown-trigger-" + this.ref] &&
          this.$refs["drivers-dropdown-trigger-" + this.ref][0].contains(
            e.target
          )) ||
        this.$refs["drivers-dropdown-" + this.ref] === e.target
      ) {
        return;
      }

      this.openDropdown = false;
    },
    banDriver() {
      this.$misc
        .post(`/driver-bans/ban-driver`, {
          driver: this.driverToBan,
          note: this.driverBanNote,
        })
        .then(() => {
          window.flash({
            type: "success",
            body: "Device Banned successfully!",
          });
          this.banNote = "";
          this.banNoteSpecific = "";
          this.driverBanNote = "";
          this.deviceId = null;
          this.driverId = null;
          this.fetchDrivers()
        }).catch(err => {
          window.flash({
            type: "error",
            body: err.response && err.response.data,
          });
        }).finally(() => {
          this.showBanModal = false;
          this.showBanModalSpecific = false;
          this.showingDriverBanModal = false;

        });
    },
    banDevice() {
      this.$misc
        .post(`/bans/ban-device`, {
          deviceID: this.deviceId,
          driverID: this.driverId,
          note: this.banNoteSpecific,
        })
        .then(() => {
          window.flash({
            type: "success",
            body: "Device Banned successfully!",
          });
          this.banNote = "";
          this.banNoteSpecific = "";
          this.deviceId = null;
          this.driverId = null;
        }).catch(err => {
          window.flash({
            type: "error",
            body: err.response && err.response.data,
          });
        }).finally(() => {
          this.showBanModal = false;
          this.showBanModalSpecific = false;
          this.showingDriverBanModal = false;

        });
    },
    banModel() {
      this.$misc
        .post(`/bans/ban-model`, {
          deviceModelID: this.deviceModelId,
          note: this.banNote,
        })
        .then(() => {
          window.flash({
            type: "success",
            body: "Device Model Banned successfully!",
          });
          this.banNote = "";
          this.banNoteSpecific = "";
          this.driverBanNote = "";

          this.deviceId = null;
          this.driverId = null;
        }).finally(() => {
          this.showBanModal = false;
          this.showBanModalSpecific = false;
          this.showingDriverBanModal = false;
        });
    },
  },
};
</script>
