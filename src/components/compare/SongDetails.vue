<template>
    <div class="card songdetails bg-dark rounded">
        <div class="card-body">

            <Compare 
                relation="first" 
                :features="features" 
                :features_to_comp="first"
                :selectedfeatures="selectedfeatures">
            </Compare>

            <Compare 
                relation="previous" 
                :features="features" 
                :features_to_comp="previous"
                :selectedfeatures="selectedfeatures">
            </Compare>

            <div class="features">
                <p>Features</p>
                <div class="row border feature-row rounded">
                    <div class="col">
                        <div class="row card-text" :class="selected('danceability')">
                            <div class="col-4">Danceability: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.danceability, "danceability")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('energy')">
                            <div class="col-4">Energy: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.energy, "energy")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('key')">
                            <div class="col-4">Key: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.key, "key")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('loudness')">
                            <div class="col-4">Loudness: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.loudness, "loudness")}}</div></div></div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row card-text" :class="selected('mode')">
                            <div class="col-4">Mode: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.mode, "mode")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('speechiness')">
                            <div class="col-4">Speechiness: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.speechiness, "speechiness")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('acousticness')">
                            <div class="col-4">Acousticness: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.acousticness, "acousticness")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('instrumentalness')">
                            <div class="col-4">Instrumentalness: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.instrumentalness, "instrumentalness")}}</div></div></div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row card-text" :class="selected('liveness')">
                            <div class="col-4">Liveness: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.liveness, "liveness")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('valence')">
                            <div class="col-4">Valence: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.valence, "valence")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('tempo')">
                            <div class="col-4">Tempo: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.tempo, "tempo")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('duration_ms')">
                            <div class="col-4">Duration: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.duration_ms, "duration_ms")}}</div></div></div>
                        </div>
                        <div class="row card-text" :class="selected('time_signature')">
                            <div class="col-4">Time signature: </div>
                            <div class="col"><div class="row"><div class="col">{{prettyFeatureValue(features.time_signature, "time_signature")}}</div></div></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Compare
                relation="next" 
                :features="features" 
                :features_to_comp="next"
                :selectedfeatures="selectedfeatures">
            </Compare>
        </div>
    </div>
</template>

<script>
import Compare from "./Compare.vue";
import { prettyFeatureValue as pfv } from "../../prettyFunctions.js";

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
        previousExists: function () {
            return (typeof this.$props.previous !== "undefined");
        },
        nextExists: function () {
            return (typeof this.$props.next !== "undefined");
        },
    },
    mounted() {
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