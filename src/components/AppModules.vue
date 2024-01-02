<template>
    <table class="min-w-full leading-normal">
        <thead>
            <tr>
                <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >Module</th>
                <th
                    class="flex items-center px-5 w-full h-20 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                >
                    <input type="checkbox" v-model="selectAll" />
                </th>
            </tr>
        </thead>
        <tbody v-if="appModules.length" class="relative">
            <tr v-for="appModule in appModules" :key="appModule.fieldName">
                <label class="contents">
                    <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p class="whitespace-no-wrap">
                            {{
                                appModule.label
                            }}
                        </p>
                    </td>

                    <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <input type="checkbox" v-model="appModule.value" />
                    </td>
                </label>
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
                <td colspan="10" class="py-4 font-semibold text-center text-gray-600 bg-white">
                    <div v-if="loading" class="inline-block">
                        <i class="text-6xl material-icons spin">sync</i>
                        <span class="invisible block">Loading...</span>
                    </div>
                    <div v-else class="inline-block">
                        <i class="text-6xl material-icons">warning</i>
                        <span class="block">No tripRequests!</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            appModules: [
                {
                    label: "Accounts",
                    fieldName: "accounts",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Activity Logs",
                    fieldName: "activity-logs",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Drivers",
                    fieldName: "drivers",
                    value: true,
                    exportUrl: "drivers/export"
                },
                {
                    label: "Driver Leaderboard",
                    fieldName: "driver-leaderboard",
                    value: true,
                    exportUrl: "leaderboard/export"
                },
                {
                    label: "Device Bans",
                    fieldName: "device-bans",
                    value: true,
                    exportUrl: "bans/export"
                },
                // {
                //     label: "Employees",
                //     fieldName: "employees",
                //     value: true,
                //     exportUrl: ""
                // },
                {
                    label: "Incentives",
                    fieldName: "incentives",
                    value: true,
                    exportUrl: "incentives/export"
                },
                {
                    label: "Mock Reports",
                    fieldName: "mock-reports",
                    value: true,
                    exportUrl: "mock-reports/export"
                },
                {
                    label: "Loan History",
                    fieldName: "loan-history",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Rents",
                    fieldName: "rents",
                    value: true,
                    exportUrl: "rents/export"
                },
                {
                    label: "Rewards",
                    fieldName: "rewards",
                    value: true,
                    exportUrl: "rewards/export"
                },
                {
                    label: "Reward Inventory",
                    fieldName: "reward-inventory",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Trips",
                    fieldName: "trips",
                    value: true,
                    exportUrl: "trips/export"
                },
                {
                    label: "SOS History",
                    fieldName: "sos-history",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Trip Requests",
                    fieldName: "trip-requests",
                    value: true,
                    exportUrl: "trip-requests/export"
                },
                {
                    label: "Trip Searches",
                    fieldName: "trip-searches",
                    value: true,
                    exportUrl: "trip-searches/export"
                },
                {
                    label: "Vehicles",
                    fieldName: "vehicles",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Vehicle Types",
                    fieldName: "vehicle-types",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Push Notifications",
                    fieldName: "push-notifications",
                    value: true,
                    exportUrl: ""
                },
                {
                    label: "Wallet History",
                    fieldName: "wallet-history",
                    value: true,
                    exportUrl: "wallet-histories/export"
                },
            ].filter(x => x.exportUrl),
            selectAll: true,
        }
    },
    mounted() {
        this.$emit("input", this.appModules)
    },
    watch: {
        selectAll(newValue) {
            this.appModules.forEach(x => x.value = newValue);
        },
        appModules: {
            deep: true,
            handler(newValue) {
                this.$emit('input', newValue)
            }
        }
    }
}
</script>