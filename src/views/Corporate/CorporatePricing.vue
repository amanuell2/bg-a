<template>
    <div>
        <h3 class="text-xl font-semibold text-gray-700">Corporate Pricings</h3>

        <div class="box-border inline-block min-w-full mt-4 overflow-hidden rounded-lg shadow">
            <form @submit.prevent class="w-full max-w-4xl space-y-4">
                <div class="flex -mx-2">
                    <div class="w-full">
                        <label class="block px-2">
                            <span class="text-gray-700">Price per KM</span>
                            <input
                                v-model="pricing.pricePerKM"
                                class="block w-full mt-1 form-input"
                                type="number"
                                placeholder="10"
                            />
                        </label>
                    </div>
                    <div class="w-full">
                        <label class="block px-2">
                            <span class="text-gray-700">Price Per Min</span>
                            <input
                                v-model="pricing.pricePerMin"
                                class="block w-full mt-1 form-input"
                                type="number"
                                placeholder="10"
                            />
                        </label>
                    </div>
                </div>
                <label class="block">
                    <span class="text-gray-700">Base Fare</span>
                    <input
                        v-model="pricing.baseFare"
                        class="block w-full mt-1 form-input"
                        type="number"
                        placeholder="10"
                    />
                </label>
                <button
                    class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                    @click="edit"
                >Save Changes</button>
            </form>
        </div>
    </div>
</template>
<script>
// import moment from "moment";
export default {
    props: ["corporate"],
    data() {
        return {
            corporates: [],
            corporateData: {},
            pricing: {
                pricePerKM: 0,
                pricePerMin: 0,
                baseFare: 0,
            },
            loading: false,
        };
    },
    computed: {
        fareSum() {
            return this.corporateTrips.length
                ? this.corporateTrips
                    .map((trip) => trip.fare)
                    .reduce((fare, current) => fare + current)
                    .toFixed(2)
                : 0;
        },
    },
    watch: {
        corporate() {
            this.getCorporateTrips();
        },
        range: {
            deep: true,
            handler() {
                this.getCorporateTrips();
            },
        },
    },
    created() {
        console.log("this.$route.params.id", this.$route.params.id)
        this.getCorporate(this.$route.params.id).then(({ data }) => {
            // console.log(JSON.stringify(corporate, null, 2))
            this.corporateData = data
            if (data.pricing) {
                this.pricing = data.pricing
            }
        });
    },
    methods: {
        getCorporate(id) {
            return this.$http
                .get("/corporates/" + id)
        },
        edit() {
            if (this.corporateData && this.corporateData._id) {
                window.flash({
                    type: "success",
                    body: "Driver updated successfully!",
                });
                this.$http
                    .patch(`/corporates/pricing/${this.corporateData._id}`, {
                        pricePerKM: Number(this.pricing.pricePerKM),
                        pricePerMin: Number(this.pricing.pricePerMin),
                        baseFare: Number(this.pricing.baseFare),
                    })
                    .then(() => {
                        this.getCorporate(this.corporate._id).then(({ data }) => {
                            // console.log(JSON.stringify(corporate, null, 2))
                            this.corporateData = data
                            if (data.pricing) {
                                this.pricing = data.pricing
                            }

                        });
                    })
                    .catch((err) => {
                        if (err.response && err.response.data && err.response.data.message && err.response.data.message.includes('ValidationError')) {
                            window.flash({
                                type: "error",
                                body: err.response.data.message.split(':').slice(1).join(':').split(',').join('<br/>'),
                            });
                            console.log(err);
                        } else {
                            window.flash({
                                type: "error",
                                body: "Driver couldn't be updated!",
                            });
                            console.log(err);
                        }
                    });
            }

        },
        formatDate(date) {
            // return moment(date).format("MMM D, YYYY HH:mm");
            return date ? date.replace("T", " ").slice(0, 16) : "-";
        },
    },
};
</script>
