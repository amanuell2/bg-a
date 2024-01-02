<template>
    <div class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow">
        <MglMap
            :accessToken="accessToken"
            :mapStyle="mapStyle"
            :center="mapOptions.center"
            :zoom="mapOptions.zoom"
        >
            <MglMarker
                v-for="(p, key) in markers"
                :key="key"
                :coordinates="p.coordinates"
                :color="p.color"
                @click="markerClicked(p.id)"
            >
                <template slot="marker">
                    <CarMarker :color="p.color"/>
                </template>
                <MglPopup>
                    <div v-html="popupData"></div>
                </MglPopup>
            </MglMarker>
        </MglMap>
    </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglPopup } from "vue-mapbox";

import CarMarker from "../components/CarMarker.vue"

const ACCESS_TOKEN = "pk.eyJ1IjoiYWplYnVzaGlsaWZ0IiwiYSI6ImNsY2lyMHBjODBidzUzb210ajFpZDhoZnUifQ.0vl0bDeP9tIpf5vmo49asw";
const MAP_STYLE = "mapbox://styles/mapbox/streets-v11";

export default {
    props: [
        "markers",
        "mapZoom",
        "mapCenter",
        "popupData",
    ],
    components: {
        MglMap,
        MglMarker,
        MglPopup,
        CarMarker,
    },
    data() {
        return {
            accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
            mapStyle: MAP_STYLE, // your map style
            mapbox: null,
            geoJsonLayer1: {
                type: "line",
                paint: {
                    'line-color': 'red',
                    'line-width': 2
                }
            },
        }
    },
    mounted() {
        this.mapbox = Mapbox;
        // alert("mount")
    },
    computed: {
        mapOptions() {
            const zoom = this.mapZoom ? this.mapZoom : 12;
            const lat = this.mapCenter && this.mapCenter.lat ? this.mapCenter.lat : 9.004912;
            const lng = this.mapCenter && this.mapCenter.lng ? this.mapCenter.lng : 38.778282;
            return {
                center: {
                    lat,
                    lng,
                },
                zoom,
            }
        },
    },
    watch: {
        mapOptions(newValue) {
            console.log(JSON.stringify(newValue, null, 2));
        }
    },
    methods: {
        markerClicked(id) {
            this.$emit('markerClicked', id)
        }
    }
    
}
</script>