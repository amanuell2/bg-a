<template>
  <div class="p-8 space-y-4">
    <h2 class="text-2xl font-semibold text-gray-600 uppercase">
      System Settings
    </h2>

    <form @submit.prevent="update">
      <div class="flex pt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Driver Settings
          </h3>
          <p class="text-gray-600">Set the settings related to drivers</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Request Timeout (in seconds)</span>
              <input
                v-model="settings.requestTimeout"
                class="block w-full form-input"
                placeholder="30"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Default Commission</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="settings.defaultCommission"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Default Road pickup Commission</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="settings.defaultRoadPickupCommission"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Default Rent Commission</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="settings.rentCommission"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Trip Search Radius (in kilometers)</span
              >
              <input
                v-model="settings.searchRadius"
                class="block w-full form-input"
                placeholder="30"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">
                Rent Search Radius (in kilometers)
              </span>
              <input
                v-model="settings.rentSearchRadius"
                class="block w-full form-input"
                placeholder="4"
              />
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">
                Scheduled Trip Search Radius (in kilometers)
              </span>
              <input
                v-model="settings.scheduleSearchRadius"
                class="block w-full form-input"
                placeholder="4"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"> Number of Drivers For Bid </span>
              <input
                v-model="settings.bidDriversPerRequest"
                class="block w-full form-input"
                placeholder="4"
              />
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">
                Medium Worker Average Trip (per day)
              </span>
              <input
                v-model="settings.mediumWorkerAverageTrip"
                class="block w-full form-input"
                placeholder="4"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">
                Hard Worker Average Trip (per day)
              </span>
              <input
                v-model="settings.hardWorkerAverageTrip"
                class="block w-full form-input"
                placeholder="4"
              />
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Trip Settings
          </h3>
          <p class="text-gray-600">Set the settings related to rides/trips</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Cancel Cost</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  ETB
                </span>
                <input
                  v-model="settings.cancelCost"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Discount</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  ETB
                </span>
                <input
                  v-model="settings.discount"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Tax</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="settings.tax"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">SOS Timeout (In Days)</span>
              <input
                v-model="settings.sosDayLimit"
                class="block w-full rounded-l-none form-input"
                placeholder="20"
              />
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block px-2">
              <span class="text-gray-700">Surge Price Application Time:</span>
              <div class="flex gap-2">
                <time-picker
                  placeholder="From"
                  v-model="settings.surgeTimeFrom"
                ></time-picker>
                <time-picker
                  placeholder="Upto"
                  v-model="settings.surgeTimeUpto"
                ></time-picker>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            First Trip Incentive Settings
          </h3>
          <p class="text-gray-600">
            Set the settings related to first time trip incentive
          </p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">enable</span>
              <div class="flex">
                <input
                  v-model="settings.applyFirstTripIncentive"
                  type="checkbox"
                  class="block w-10 h-10"
                />
              </div>
            </label>
            <label
              class="block w-1/2 px-2"
              v-if="settings.applyFirstTripIncentive"
            >
              <span class="text-gray-700">Amount</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  ETB
                </span>
                <input
                  v-model="settings.firstTripIncentiveAmount"
                  class="block w-full rounded-l-none form-input"
                  placeholder="100"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            GPS Settings
          </h3>
          <p class="text-gray-600">Set the settings related to GPS</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">General Gps Accuracy</span>
              <div class="flex">
                <input
                  v-model="settings.generalGpsAccuracy"
                  class="block w-full rounded-l-none form-input"
                  placeholder=""
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Intrip Gps Accuracy</span>
              <div class="flex">
                <input
                  v-model="settings.onTripGpsAccuracy"
                  class="block w-full rounded-l-none form-input"
                  placeholder=""
                />
              </div>
            </label>
          </div>
          <!-- <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Location Update Interval</span>
              <div class="flex">
                <input
                  v-model="settings.locationUpdateInterval"
                  class="block w-full rounded-l-none form-input"
                  placeholder=""
                />
              </div>
            </label>
       
          </div> -->
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Invitation Promo Settings
          </h3>
          <p class="text-gray-600">
            Set the settings related to invitation based promo
          </p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Daily Invitation Quota</span>
              <div class="flex">
                <input
                  v-model="settings.promoInvitationDailyQuota"
                  class="block w-full rounded-l-none form-input"
                  placeholder="10"
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Promo applies for "X" number of trips</span
              >
              <div class="flex">
                <input
                  v-model="settings.promoNumberOfTripsApplicable"
                  class="block w-full rounded-l-none form-input"
                  placeholder="5"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Promo Incentive Rate</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="settings.promoIncentiveRate"
                  class="block w-full rounded-l-none form-input"
                  placeholder="10"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            CashBack/Incentive Settings
          </h3>
          <p class="text-gray-600">Set the settings related to incentive</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Every "x" trip</span>
              <div class="flex">
                <input
                  v-model="newIncentive.every"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Rate</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="newIncentive.rate"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>

          <div class="flex justify-end w-full p-4">
            <button
              class="
                flex
                items-center
                justify-center
                block
                w-24
                h-10
                gap-1
                px-2
                rounded
                shadow
              "
              @click="
                settings.incentiveSettings.push(newIncentive) &&
                  (newIncentive = { every: 0, rate: 0 })
              "
              :class="[
                addIncentiveDisabled
                  ? 'bg-shuufare-200 text-gray-500'
                  : 'bg-shuufare-200  hover:shadow-sm hover:bg-shuufare-300',
              ]"
              :disabled="addIncentiveDisabled"
            >
              <i class="material-icons">add</i>
              Add
            </button>
          </div>
          <div
            class="relative flex items-end p-4 my-4 bg-black border rounded"
            :style="{ height: '7.2rem', '--bg-opacity': 0.03 }"
            v-for="(incentiveSetting, i) in settings.incentiveSettings"
            :key="`incentive-${i}`"
          >
            <button
              class="
                absolute
                top-0
                right-0
                flex
                items-center
                justify-center
                block
                w-10
                h-10
                gap-1
                px-2
                m-2
                rounded-full
                hover:bg-shuufare-200 hover:shadow-sm hover:bg-shuufare-300
              "
              :style="{
                outline: 'none',
              }"
              @click="
                settings.incentiveSettings.splice(
                  settings.incentiveSettings.findIndex(
                    (x) => x._id === incentiveSetting._id
                  ),
                  1
                ) && update()
              "
            >
              <i class="material-icons">close</i>
            </button>
            <label class="block w-1/2 px-2 pointer-events-none">
              <span class="text-gray-700">Every "x" trip</span>
              <div class="flex">
                <input
                  v-model="incentiveSetting.every"
                  class="block w-full rounded-l-none form-input bg-shuufare-50"
                  placeholder="20"
                  readonly
                />
              </div>
            </label>

            <label class="block w-1/2 px-2 pointer-events-none">
              <span class="text-gray-700">Rate</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-300
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="incentiveSetting.rate"
                  class="block w-full rounded-l-none form-input bg-shuufare-50"
                  placeholder="20"
                  readonly
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Incentive Voucher Settings
          </h3>
          <p class="text-gray-600">
            Set the settings related to incentive voucher cashout
          </p>
        </div>
        <div class="w-2/3">
          <div class="flex mt-4">
            <label class="block w-full px-2 my-2">
              <span class="text-gray-700">Local IP:</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.localIpAddress"
                  class="block w-full rounded-l-none form-input"
                  placeholder="local ip used in VPN"
                />
              </div>
            </label>
          </div>
          <div class="flex">
            <label class="block w-full px-2">
              <span class="text-gray-700">Caller ID</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.callerId"
                  class="block w-full rounded-l-none form-input"
                  placeholder="caller Id"
                />
              </div>
            </label>
            <label class="block w-full px-2">
              <span class="text-gray-700">Endpoint</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.endpoint"
                  class="block w-full rounded-l-none form-input"
                  placeholder="Endpoint"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Encrypted</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.encrypted"
                  class="block w-full rounded-l-none form-input"
                  placeholder="encrypted"
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Short Code</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.shortCode"
                  class="block w-full rounded-l-none form-input"
                  placeholder="short code"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Operator ID</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.operatorId"
                  class="block w-full rounded-l-none form-input"
                  placeholder="operator ID"
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Pin</span>
              <div class="flex">
                <input
                  v-model="settings.telebirrAirTimeSettings.pin"
                  class="block w-full rounded-l-none form-input"
                  :placeholder="
                    settings.telebirrAirTimeSettings.pinIsSet
                      ? '<pin hidden>'
                      : '<pin not set>'
                  "
                />
              </div>
            </label>
          </div>

          <div class="flex justify-end mt-6">
            <div class="flex flex-col justify-end w-1/2 gap-4">
              <span
                class="
                  flex
                  justify-center
                  w-full
                  pl-2
                  font-semibold
                  text-gray-700
                "
                >Voucher Types</span
              >
              <div class="flex">
                <label class="block w-1/2 px-2">
                  <span class="text-gray-700">Amount</span>
                  <div class="flex">
                    <input
                      v-model="newVoucherType.amount"
                      class="block w-full rounded-l-none form-input"
                      placeholder="20"
                    />
                  </div>
                </label>

                <label class="block w-1/2 px-2">
                  <span class="text-gray-700">ID</span>
                  <div class="flex">
                    <input
                      v-model="newVoucherType.id"
                      class="block w-full rounded-l-none form-input"
                      placeholder="20"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <div class="flex justify-end w-1/2 p-4">
              <button
                class="
                  flex
                  items-center
                  justify-center
                  block
                  w-24
                  h-10
                  gap-1
                  px-2
                  rounded
                  shadow
                "
                @click="
                  settings.telebirrAirTimeSettings.voucherTypes.push(
                    newVoucherType
                  ) && (newVoucherType = { id: 0, amount: 0 })
                "
                :class="[
                  addVoucherTypeDisabled
                    ? 'bg-shuufare-200 text-gray-500'
                    : 'bg-shuufare-200  hover:shadow-sm hover:bg-shuufare-300',
                ]"
                :disabled="addVoucherTypeDisabled"
              >
                <i class="material-icons">add</i>
                Add
              </button>
            </div>
          </div>
          <div class="flex flex-col items-end justify-end">
            <div
              class="
                relative
                flex
                items-end
                w-1/2
                p-4
                my-4
                bg-black
                border
                rounded
              "
              :style="{ height: '7.2rem', '--bg-opacity': 0.03 }"
              v-for="(voucherType, i) in settings.telebirrAirTimeSettings
                .voucherTypes"
              :key="`voucher-type-${i}`"
            >
              <button
                class="
                  absolute
                  top-0
                  right-0
                  flex
                  items-center
                  justify-center
                  block
                  w-10
                  h-10
                  gap-1
                  px-2
                  m-2
                  rounded-full
                  hover:bg-shuufare-200 hover:shadow-sm hover:bg-shuufare-300
                "
                :style="{
                  outline: 'none',
                }"
                @click="
                  settings.telebirrAirTimeSettings.voucherTypes.splice(i, 1) &&
                    update()
                "
              >
                <i class="material-icons">close</i>
              </button>
              <label class="block w-1/2 px-2 pointer-events-none">
                <span class="text-gray-700">Amount</span>
                <div class="flex">
                  <input
                    v-model="voucherType.amount"
                    class="
                      block
                      w-full
                      rounded-l-none
                      form-input
                      bg-shuufare-50
                    "
                    placeholder="20"
                    readonly
                  />
                </div>
              </label>

              <label class="block w-1/2 px-2 pointer-events-none">
                <span class="text-gray-700">ID</span>
                <div class="flex">
                  <input
                    v-model="voucherType.id"
                    class="
                      block
                      w-full
                      rounded-l-none
                      form-input
                      bg-shuufare-50
                    "
                    placeholder="20"
                    readonly
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            SMS Settings
          </h3>
          <p class="text-gray-600">Set the settings related to SMS messages</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-full px-2">
              <span class="text-gray-700">End point</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  API
                </span>
                <input
                  v-model="settings.smsSettings.endpoint"
                  class="block w-full rounded-l-none form-input"
                  placeholder="http://"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Username</span>
              <div class="flex">
                <input
                  v-model="settings.smsSettings.username"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Password</span>
              <div class="flex">
                <input
                  v-model="settings.smsSettings.password"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">DLR Mask</span>
              <div class="flex">
                <input
                  v-model="settings.smsSettings.dlrMask"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>

            <label class="block w-1/2 px-2">
              <span class="text-gray-700">DLR URL</span>
              <div class="flex">
                <input
                  v-model="settings.smsSettings.dlrURL"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Promo Settings
          </h3>
          <p class="text-gray-600">Set the settings related to promo</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Amount</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  ETB
                </span>
                <input
                  v-model="settings.promoAmount"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Trip count</span>
              <div class="flex">
                <input
                  v-model="settings.promoTripCount"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Rate</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  %
                </span>
                <input
                  v-model="settings.promoRate"
                  class="block w-full rounded-l-none form-input"
                  placeholder="20"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Social Media Settings
          </h3>
          <p class="text-gray-600">Set the settings related social medias</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Facebook Link</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">facebook</i>
                </span>
                <input
                  v-model="settings.facebookLink"
                  class="block w-full rounded-l-none form-input"
                  placeholder="https://facebook.com/my-company"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Twitter Link</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <svg
                    class="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M17.3 6.2v.5c0 5-3.8 10.7-10.7 10.7-2.1 0-4.1-.6-5.8-1.7.3 0 .6.1.9.1 1.8 0 3.4-.6 4.7-1.6-1.7 0-3-1.1-3.5-2.6.2 0 .5.1.7.1.3 0 .7 0 1-.1-1.8-.4-3.1-1.9-3.1-3.8.5.3 1.1.5 1.7.5-1-.7-1.7-1.8-1.7-3.1 0-.7.2-1.3.5-1.9C3.9 5.5 6.7 7 9.9 7.2c-.1-.3-.1-.6-.1-.9 0-2.1 1.7-3.8 3.8-3.8 1.1 0 2.1.5 2.8 1.2.9-.2 1.7-.5 2.4-.9-.3.9-.9 1.6-1.7 2.1.8-.1 1.5-.3 2.2-.6-.6.8-1.2 1.4-2 1.9z"
                    />
                  </svg>
                </span>
                <input
                  v-model="settings.twitterLink"
                  class="block w-full rounded-l-none form-input"
                  placeholder="https://twitter.com/@myCompany"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Google Link</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <svg
                    class="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M2 5.6c0 1.5.5 2.6 1.5 3.2.8.5 1.7.6 2.2.6H6s-.2 1 .6 2h-.1c-1.3 0-5.5.3-5.5 3.7 0 3.5 3.9 3.7 4.6 3.7H5.9c.5 0 1.8-.1 3-.6 1.5-.7 2.3-2.1 2.3-3.9 0-1.8-1.2-2.8-2.1-3.6-.5-.5-1-.9-1-1.3s.3-.7.8-1.1c.7-.6 1.3-1.5 1.3-3.1 0-1.5-.2-2.4-1.4-3.1.1-.1.6-.1.8-.1.6-.1 1.6-.2 1.6-.7v-.1H6.6S2 1.4 2 5.6zm7.4 9c.1 1.4-1.1 2.4-2.9 2.6-1.8.1-3.3-.7-3.4-2.1 0-.7.3-1.3.8-1.9.6-.5 1.4-.9 2.3-.9h.3c1.7 0 2.8 1 2.9 2.3zm-1.2-10c.5 1.6-.2 3.2-1.3 3.6h-.4c-1 0-2-1-2.3-2.4-.2-.7-.2-1.4 0-2.1.2-.6.6-1.1 1.2-1.2.1 0 .3-.1.4-.1 1.2 0 1.9.5 2.4 2.2zM16 8V5h-2v3h-3v2h3v3h2v-3h3V8h-3z"
                    />
                  </svg>
                </span>
                <input
                  v-model="settings.googleLink"
                  class="block w-full rounded-l-none form-input"
                  placeholder="httsp://plus.google.com/my-company"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Company Settings
          </h3>
          <p class="text-gray-600">Set the settings related to the company</p>
        </div>
        <div class="w-2/3">
          <div class="flex">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Contact Number</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">call</i>
                </span>
                <input
                  v-model="settings.contactNumber"
                  class="block w-full rounded-l-none form-input"
                  placeholder="+251 999 999999"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Contact Email</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">email</i>
                </span>
                <input
                  v-model="settings.contactEmail"
                  class="block w-full rounded-l-none form-input"
                  placeholder="company@domain.com"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Credit Allowance</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">attach_money</i>
                </span>
                <input
                  v-model="settings.creditAllowance"
                  class="block w-full rounded-l-none form-input"
                  placeholder="4000"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Map Key</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">vpn_key</i>
                </span>
                <input
                  v-model="settings.mapKey"
                  class="block w-full rounded-l-none form-input"
                  placeholder="4000"
                />
              </div>
            </label>
          </div>
          <div class="flex mt-4">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Logo Image</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">photo</i>
                </span>
                <input
                  v-model="settings.logo"
                  class="block w-full rounded-l-none form-input"
                  placeholder="Image"
                />
              </div>
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Fav Icon</span>
              <div class="flex">
                <span
                  class="
                    flex
                    items-center
                    px-4
                    bg-gray-200
                    border-t border-b border-l
                    rounded-l
                  "
                >
                  <i class="material-icons">photo</i>
                </span>
                <input
                  v-model="settings.favIcon"
                  class="block w-full rounded-l-none form-input"
                  placeholder="Fav Icon"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            App Settings
          </h3>
          <p class="text-gray-600">Set the settings related app version</p>
        </div>
        <div class="w-2/3">
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Latest Driver Android Version</span>
              <input
                v-model="settings.androidDriverVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Least Supported Driver Android Version</span
              >
              <input
                v-model="settings.leastAndroidDriverVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
          </div>
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Latest Driver IOS Version</span>
              <input
                v-model="settings.iosDriverVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Least Supported Driver IOS Version</span
              >
              <input
                v-model="settings.leastIosDriverVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
          </div>
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Driver Appstore link</span>
              <input
                v-model="settings.driverAppstoreLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://www.apple.com/app-store/"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Driver Playstore link</span>
              <input
                v-model="settings.driverPlaystoreLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://play.google.com/store"
              />
            </label>
          </div>
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Driver Privacy Policy link</span>
              <input
                v-model="settings.driverPrivacyPolicyLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://..."
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Driver Terms and coditions link</span>
              <input
                v-model="settings.driverTermsAndConditionLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://..."
              />
            </label>
          </div>
          <hr />
          <div class="flex mt-3 mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Latest Passenger Android Version</span
              >
              <input
                v-model="settings.androidPassengerVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Least Supported Passenger Android Version</span
              >
              <input
                v-model="settings.leastAndroidPassengerVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
          </div>
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Latest Passenger IOS Version</span>
              <input
                v-model="settings.iosPassengerVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Least Supported Passenger IOS Version</span
              >
              <input
                v-model="settings.leastIosPassengerVersion"
                class="block w-full rounded-l-none form-input"
                placeholder="0.0.1"
              />
            </label>
          </div>
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Passenger Appstore link</span>
              <input
                v-model="settings.passengerAppstoreLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://www.apple.com/app-store/"
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Passenger Playstore link</span>
              <input
                v-model="settings.passengerPlaystoreLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://play.google.com/store"
              />
            </label>
          </div>
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700">Passenger Privacy Policy link</span>
              <input
                v-model="settings.passengerPrivacyPolicyLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://..."
              />
            </label>
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Passenger Terms and coditions link</span
              >
              <input
                v-model="settings.passengerTermsAndConditionLink"
                class="block w-full rounded-l-none form-input"
                placeholder="https://..."
              />
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4 border-t">
        <div class="w-1/3">
          <h3 class="text-xl font-semibold text-gray-600 uppercase">
            Device Ban Settings
          </h3>
          <p class="text-gray-600">
            Set the settings related to unsupported devices restriction
          </p>
        </div>
        <div class="w-2/3">
          <div class="flex mb-5">
            <label class="block w-1/2 px-2">
              <span class="text-gray-700"
                >Message for Unknown/Unsupported devices:</span
              >
              <textarea
                v-model="settings.deviceUnknownNote"
                class="block w-full rounded-l-none form-input"
                placeholder=""
              ></textarea>
            </label>
          </div>
        </div>
      </div>
      <div class="flex pt-4 mt-4">
        <div class="w-1/3"></div>
        <div class="w-2/3">
          <button
            class="px-24 py-2 font-bold text-white rounded shadow"
            :disabled="busy"
            :class="
              busy
                ? 'bg-shuufare-300 cursor-not-allowed'
                : 'bg-shuufare-700 hover:bg-shuufare-800 hover:shadow-none'
            "
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import TimePicker from "../../components/TimePicker.vue";

export default {
  data() {
    return {
      settings: {
        telebirrAirTimeSettings: {},
        smsSettings: {},
      },
      busy: false,
      newIncentive: {
        rate: 0,
        every: 0,
      },
      newVoucherType: {
        amount: 0,
        id: 0,
      },
    };
  },
  components: {
    TimePicker,
  },
  created() {
    this.$misc
      .get("/setting")
      .then((response) => {
        this.settings = response.data;
        if (!this.settings.telebirrAirTimeSettings) {
          this.settings.telebirrAirTimeSettings = {}
        }
      })
      .catch((err) => console.log(err));
  },
  computed: {
    addIncentiveDisabled() {
      return [
        !this.newIncentive.rate,
        !this.newIncentive.every,
        isNaN(this.newIncentive.rate),
        isNaN(this.newIncentive.every),
        this.newIncentive.rate > 100,
        this.newIncentive.rate <= 0,
        this.newIncentive.every != parseInt(this.newIncentive.every),
        this.newIncentive.every < 1,
      ].some((x) => x);
    },
    addVoucherTypeDisabled() {
      return [
        !this.newVoucherType.amount,
        !this.newVoucherType.id,
        isNaN(this.newVoucherType.amount),
        this.newVoucherType.amount < 0,
        parseInt(this.newVoucherType.amount) !=
          Number(this.newVoucherType.amount),
      ].some((x) => x);
    },
  },
  methods: {
    update() {
      this.busy = true;
      this.$misc
        .post("/setting", { ...this.settings })
        .then(() => {
          window.flash({ type: "success", body: "Updated Successfully!" });
        })
        .catch((err) => {
          window.flash({ type: "error", body: "Failed to save settings!" });
          console.log(err);
        })
        .finally(() => (this.busy = false));
    },
  },
};
</script>
