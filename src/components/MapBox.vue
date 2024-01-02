<template>
    <div class="w-full h-full overflow-hidden bg-teal-600 rounded-lg shadow">
        <MglMap
            :accessToken="accessToken"
            :mapStyle="mapStyle"
            :center="mapOptions.center"
            :zoom="mapOptions.zoom"
        >
            <MglGeojsonLayer
                v-if="computedLineString1"
                :sourceId="geoJsonSource1.data.id"
                :source="geoJsonSource1"
                layerId="route1"
                :layer="geoJsonLayer1"
            />
            <MglGeojsonLayer
                v-if="computedLineString2"
                :sourceId="geoJsonSource2.data.id"
                :source="geoJsonSource2"
                layerId="route2"
                :layer="geoJsonLayer2"
            />

            <MglMarker
                v-for="(p, key) in pinpoints"
                :key="key"
                :coordinates="p.coordinates"
                :color="p.color"
            >
                <!-- <MglPopup>
                    VCard>
                    <div>{{ l.country }}</div>
                    <div>{{ l.latest.confirmed }}</div>
                    </VCard>
                </MglPopup>-->
            </MglMarker>
            <MglMarker
                v-for="(p, key) in markers"
                :key="key"
                :coordinates="p.coordinates"
                @click="markerClicked(p.id)"
            >
                <template slot="marker">
                    <CarMarker :color="p.color"/>
                </template>
                <MglPopup>
                </MglPopup>
            </MglMarker>
        </MglMap>
    </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglGeojsonLayer, MglMarker, MglPopup } from "vue-mapbox";
import CarMarker from "../components/CarMarker.vue"

const route1Color = "green"
const route2Color = "red"

const startMarkerColor = "green"
const destinationMarkerColor = "red"


const ACCESS_TOKEN = "pk.eyJ1IjoiYWplYnVzaGlsaWZ0IiwiYSI6ImNsY2lyMHBjODBidzUzb210ajFpZDhoZnUifQ.0vl0bDeP9tIpf5vmo49asw";
const MAP_STYLE = "mapbox://styles/mapbox/streets-v11";

export default {
    props: [
        "route1",
        "route2",

        "markers",
        "mapZoom",
        "mapCenter",
        "popupData",
    ],
    components: {
        MglMap,
        MglGeojsonLayer,
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
                    'line-color': route1Color,
                    'line-width': 2
                }
            },
            geoJsonLayer2: {
                type: "line",
                paint: {
                    'line-color': route2Color,
                    'line-width': 2
                }
            },
        }
    },
    mounted() {
        this.mapbox = Mapbox;
    },
    computed: {
        computedLineString1() {
            return this.route1
        },
        computedLineString2() {
            return this.route2
        },
        pinpoints() {
            return [

                ...(this.route1 && this.route1.length > 0 ?
                    [
                        { coordinates: [this.route1[0][0], this.route1[0][1]], color: startMarkerColor },
                        { coordinates: [this.route1[this.route1.length - 1][0], this.route1[this.route1.length - 1][1]], color: destinationMarkerColor }
                    ] : []),

                ...(this.route2 && this.route2.length > 0 ?
                    [
                        { coordinates: [this.route2[0][0], this.route2[0][1]], color: startMarkerColor },
                        { coordinates: [this.route2[this.route2.length - 1][0], this.route2[this.route2.length - 1][1]], color: destinationMarkerColor }
                    ] : []),

                // this.route2 && this.route2.length > 0 ? {coordinates: [ this.route2[0][0], this.route2[0][1] ]} : null,
                // this.route2 && this.route2.length > 0 ? {coordinates: [ this.route2[this.route2.length - 1][0], this.route2[this.route2.length - 1][1] ]} : null,

            ]
        },
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
        geoJsonSource1() {
            return {
                type: 'geojson',
                data: {
                    id: "route1",
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: this.computedLineString1
                            },
                            properties: {
                                id: "value0"
                            }
                        }
                    ]
                },
            }
        },
        geoJsonSource2() {
            return {
                type: 'geojson',
                data: {
                    id: "route2",
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: this.computedLineString2
                            },
                            properties: {
                                id: "value0"
                            }
                        }
                    ]
                },
            }
        }
    },
    methods: {
        markerClicked(id) {
            this.$emit('markerClicked', id)
        }
    }
}
</script>