<template>
  <div class="p-8">
  <h1 style="color:green;">under development</h1>
    <div class="space-y-4">
      <div>
        <h2 class="font-semibold uppercase text-gray-600">Earning records</h2>
      </div>

      <div class="border p-4 rounded-lg space-y-2">
        <div class="flex -mx-4">
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">Today</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">|</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">Yesterday</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">|</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">This week</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">|</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">This month</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">|</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">Last month</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">|</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">This year</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">|</span>
              </label>
            </div>
          </div>
          <div class="w-1/10">
            <div class="p-4 space-y-4">
              <label class="block">
                <span class="px-2 text-blue-700 underline">Last Year</span>
              </label>
            </div>
          </div>
        </div>
        <form @submit.prevent="add" class="space-y-4">
          <div class="flex -mx-4">
            <div class="w-1/3">
              <div class="p-4 space-y-4">
                <label class="block px-2">Date picker start date</label>
              </div>
            </div>

            <div class="w-1/3">
              <div class="p-4 space-y-4">
                <label class="block px-2">Date picker end date</label>
              </div>
            </div>

            <div class="w-1/3">
              <div class="p-4 space-y-4">
                <label class="block px-2">
                  <span class="text-gray-700">Select driver</span>
                  <select class="form-select mt-1 block w-full">
                    <option value>+2513434334 Belete Gurmesa</option>
                    <option value>+2513434334 Girma Tru</option>
                    <option value>+2513434334 Aman Suoe</option>
                    <option value>+2513434334 Belete Ayele</option>
                    <option value>+2513434334 Bio hello</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div class="flex -mx-4">
            <div class="w-1/3">
              <div class="p-4 space-y-4">
                <label class="block px-2">
                  <span class="text-gray-700">Select Passenger</span>
                  <select class="form-select mt-1 block w-full">
                    <option value disabled selected hidden>Select users</option>
                    <option value>+2513434334 Belete Gurmesa</option>
                    <option value>+2513434334 Girma Tru</option>
                    <option value>+2513434334 Aman Suoe</option>
                    <option value>+2513434334 Belete Ayele</option>
                    <option value>+2513434334 Bio hello</option>
                  </select>
                </label>
              </div>
            </div>
            <div class="w-1/3">
              <div class="p-4 space-y-4">
                <label class="block px-2">
                  <span class="text-gray-700">Select Payment Type</span>
                  <select class="form-select mt-1 block w-full">
                    <option value disabled selected hidden>
                      Select payment status
                    </option>
                    <option value>Cash</option>
                    <option value>Santimpay</option>
                  </select>
                </label>
              </div>
            </div>
            <div class="w-1/3">
              <div class="p-4 space-y-4">
                <label class="block px-2">
                  <span class="text-gray-700"
                    >Select Driver Payment System</span
                  >
                  <select class="form-select mt-1 block w-full">
                    <option value disabled selected hidden>
                      Select payment status
                    </option>
                    <option value>Setteled</option>
                    <option value>Unsetteled</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <hr />
        </form>
      </div>
      <table class="table-auto rounded text-sm w-full bg-white">
        <thead class="bg-gray-200">
          <tr>
            <th class="border px-4 py-2">Check</th>
            <th class="border px-4 py-2">Payment status</th>
            <th class="border px-4 py-2">Trip Date</th>
            <th class="border px-4 py-2">Trip Type</th>
            <th class="border px-4 py-2">Passenger Name</th>
            <th class="border px-4 py-2">Driver Name</th>
            <th class="border px-4 py-2">Total Fare (A)</th>
            <th class="border px-4 py-2">Discount (B)</th>
            <th class="border px-4 py-2">Tip (C)</th>
            <th class="border px-4 py-2">Tax D = A*taxPercent</th>
            <th class="border px-4 py-2">Trip Status</th>
            <th class="border px-4 py-2">Gateway Fee E= (A+C)*X</th>
            <th class="border px-4 py-2">Pay to Driver F=((A + C)-E)-D</th>
            <th class="border px-4 py-2">
              Collect from Driver G = (A-E)*commission
            </th>
            <th class="border px-4 py-2">
              Driver Earning H = ((((A+C)-E)-D)-G)
            </th>
            <th class="border px-4 py-2">Payment Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="index in 10" :key="index">
            <td class="border px-4 py-2 text-center">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  class="px-3 py-3 form-checkbox border-solid border-2 border-gray-600"
                />
              </label>
            </td>
            <td class="border px-4 py-2">Unsettled</td>
            <td class="border px-4 py-2">12 June 2020 15:13:53</td>
            <td class="border px-4 py-2">Now</td>
            <td class="border px-4 py-2">Girum belay</td>
            <td class="border px-4 py-2">Abebe besobila</td>
            <td class="border px-4 py-2">40.70</td>
            <td class="border px-4 py-2">0.00</td>
            <td class="border px-4 py-2">0.00</td>
            <td class="border px-4 py-2">3.70</td>
            <td class="border px-4 py-2">Completed</td>
            <td class="border px-4 py-2">3.7</td>
            <td class="border px-4 py-2">33.30</td>
            <td class="border px-4 py-2">10.00</td>
            <td class="border px-4 py-2">37</td>
            <td class="border px-4 py-2">Cash</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center">
        <p class="text-gray-600">
          Showing
          <strong>1</strong> to <strong>10</strong> of
          <strong>254</strong> entries
        </p>
        <div class="flex items-center space-x-4">
          <div>
            Per page:
            <select class="form-select" name id>
              <option value>10</option>
              <option value>25</option>
              <option value>50</option>
              <option value>100</option>
            </select>
          </div>
          <div class="space-x-2 flex">
            <button
              type="button"
              class="flex items-center p-2 text-gray-500 hover:text-gray-800"
            >
              <i class="material-icons">chevron_left</i>
            </button>
            <button type="button" class="p-2 text-gray-500 hover:text-gray-800">
              1
            </button>
            <button type="button" class="p-2 text-gray-500 hover:text-gray-800">
              2
            </button>
            <button type="button" class="p-2 text-gray-500 hover:text-gray-800">
              3
            </button>
            <button type="button" class="p-2 text-gray-500 hover:text-gray-800">
              4
            </button>
            <button type="button" class="p-2 text-gray-500" disabled>
              ...
            </button>
            <button
              type="button"
              class="flex items-center p-2 text-gray-500 hover:text-gray-800"
            >
              <i class="material-icons">chevron_right</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
