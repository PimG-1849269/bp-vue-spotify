<template>
    <div class="card songdetails bg-dark rounded">
        <div class="card-body">
            <div class="row">

            <div class="col">
            <apexchart 
                type="radar"
                :series="spiderchartseries"
                :options="spiderchartoptions" 
                ></apexchart>
            </div>
            
            <div class="col">
            <div class="accordion" id="accordionExample">
                <div class="card bg-dark">
                    <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-block text-left text-white" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Features of this song
                        </button>
                    </h2>
                    </div>

                    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="features">
                            <!-- <p>Features</p> -->
                            <div class="row border feature-row rounded">
                                <div class="col">
                                    <div class="row card-text" :class="selected('danceability')">
                                        <div class="col-6">Danceability: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.danceability, "danceability")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('energy')">
                                        <div class="col-6">Energy: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.energy, "energy")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('key')">
                                        <div class="col-6">Key: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.key, "key")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('loudness')">
                                        <div class="col-6">Loudness: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.loudness, "loudness")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('mode')">
                                        <div class="col-6">Mode: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.mode, "mode")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('speechiness')">
                                        <div class="col-6">Speechiness: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.speechiness, "speechiness")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('acousticness')">
                                        <div class="col-6">Acousticness: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.acousticness, "acousticness")}}</div></div></div>
                                    </div>
                                    </div>
                                    <div class="col">
                                    <div class="row card-text" :class="selected('instrumentalness')">
                                        <div class="col-6">Instrumentalness: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.instrumentalness, "instrumentalness")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('liveness')">
                                        <div class="col-6">Liveness: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.liveness, "liveness")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('valence')">
                                        <div class="col-6">Valence: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.valence, "valence")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('tempo')">
                                        <div class="col-6">Tempo: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.tempo, "tempo")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('duration_ms')">
                                        <div class="col-6">Duration: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.duration_ms, "duration_ms")}}</div></div></div>
                                    </div>
                                    <div class="row card-text" :class="selected('time_signature')">
                                        <div class="col-6">Time signature: </div>
                                        <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.time_signature, "time_signature")}}</div></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="card bg-dark" v-if="firstExists">
                    <div class="card-header" id="headingTwo">
                    <h2 class="mb-0">
                        <button class="btn btn-block text-left collapsed text-white" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Compare features with first song
                        </button>
                    </h2>
                    </div>
                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div class="card-body">
                        <Compare 
                            relation="first" 
                            :features="features" 
                            :features_to_comp="first"
                            :selectedfeatures="selectedfeatures">
                        </Compare>
                    </div>
                    </div>
                </div>
                <div class="card bg-dark" v-if="previousExists">
                    <div class="card-header" id="headingThree">
                    <h2 class="mb-0">
                        <button class="btn btn-block text-left collapsed text-white" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Compare features with previous song
                        </button>
                    </h2>
                    </div>
                    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                    <div class="card-body">
                        <Compare 
                            relation="previous" 
                            :features="features" 
                            :features_to_comp="previous"
                            :selectedfeatures="selectedfeatures">
                        </Compare>
                    </div>
                    </div>
                </div>
                <div class="card bg-dark" v-if="nextExists">
                    <div class="card-header" id="headingFour">
                    <h2 class="mb-0">
                        <button class="btn btn-block text-left collapsed text-white" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                        Compare features with next song
                        </button>
                    </h2>
                    </div>
                    <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                    <div class="card-body">
                        <Compare
                            relation="next" 
                            :features="features" 
                            :features_to_comp="next"
                            :selectedfeatures="selectedfeatures">
                        </Compare>
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
import Compare from "./Compare.vue";
import { prettyFeatureValue as pfv, prettyNormalizedValue as pnv } from "../../prettyFunctions.js";
import { white } from "color-name";

export default {
    props: {
        features: {
            type: Object,
            default: function () { return { "danceability": 0, "energy": 0, "key": 0, "loudness": 0, "mode": 0, "speechiness": 0, "acousticness": 0, "instrumentalness": 0, "liveness": 0, "valence": 0, "tempo": 0, "type": "audio_features", "id": "id", "uri": "spotify:track:id", "track_href": "https://api.spotify.com/v1/tracks/id", "analysis_url": "https://api.spotify.com/v1/audio-analysis/id", "duration_ms": 0, "time_signature": 0 }; }
        },
        first: {
            type: Object,
        },
        previous: {
            type: Object,
        },
        next: {
            type: Object,
        },
        selectedfeatures: {
            type: Object
        }
    },
    data() {
        return {
        };
    },
    computed: {
        firstExists: function () {
            return (typeof this.$props.first !== "undefined");
        },
        previousExists: function () {
            return (typeof this.$props.previous !== "undefined");
        },
        nextExists: function () {
            return (typeof this.$props.next !== "undefined");
        },

        spiderchartseries: function () {
            var series = [];

            if (typeof this.$props.features !== "undefined") {
                series.push({
                    name: "This song",
                    data: this.getDataSeries("this")
                })
            } if (typeof this.$props.first !== "undefined") {
                series.push({
                    name: "First song",
                    data: this.getDataSeries("first")
                })
            } if (typeof this.$props.previous !== "undefined") {
                series.push({
                    name: "Previous song",
                    data: this.getDataSeries("previous")
                })
            } if (typeof this.$props.next !== "undefined") {
                series.push({
                    name: "Next song",
                    data: this.getDataSeries("next")
                })
            }

            return series;
        },
        spiderchartoptions: function () {
            return {
                xaxis: {
                    categories: [
                        "Danceability",
                        "Energy",
                        "Acousticness",
                        "Instrumentalness",
                        "Liveness",
                        "Valence",
                        "Key",
                        "Loudness",
                        "Speechiness",
                        "Mode",
                        "Tempo",
                        "Time signature",
                        "Duration"
                    ],
                }, 
                yaxis: {
                    show: false,
                    min: 0,
                    max: 1,
                },
                legend: {
                    labels: {colors: white}
                },
                stroke: {
                width: 2
                },
                fill: {
                opacity: 0.1
                },
                markers: {
                size: 0
                },
            }
        },
    },
    methods: {
        selected(feat) {
            if (Object.keys(this.$props.selectedfeatures).includes(feat)) {
                return "font-weight-bold text-info border border-info rounded";
            } else {
                return "";
            }
        },

        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },

        getDataSeries(which) {
            var data = null;
            var series = [];
            if (which == "this") {
                data = this.$props.features;
            } else if (which == "first" && typeof this.$props.first !== "undefined") {
                data = this.$props.first;
            } else if (which == "previous" && typeof this.$props.previous !== "undefined") {
                data = this.$props.previous;
            } else if (which == "next" && typeof this.$props.next !== "undefined") {
                data = this.$props.next;
            } else {
                // console.debug("SongDetails: Something went wrong getting data series of ", which);
                return [];
            }

            // Create series
            series.push(pnv(data.danceability, "danceability"));
            series.push(pnv(data.energy, "energy"));
            series.push(pnv(data.acousticness, "acousticness"));
            series.push(pnv(data.instrumentalness, "instrumentalness"));
            series.push(pnv(data.liveness, "liveness"));
            series.push(pnv(data.valence, "valence"));
            series.push(pnv(data.key, "key"));
            series.push(pnv(data.loudness, "loudness"));
            series.push(pnv(data.speechiness, "speechiness"));
            series.push(pnv(data.mode, "mode"));
            series.push(pnv(data.tempo, "tempo"));
            series.push(pnv(data.time_signature, "time_signature"));
            series.push(pnv(data.duration_ms, "duration_ms"));

            return series;
        }
    },
    components: { Compare }
}
</script>

<style>
.songdetails {
    margin-top: 2%;
}

.feature-row {
    padding: 3%;
    margin-bottom: 5%;
}

</style>