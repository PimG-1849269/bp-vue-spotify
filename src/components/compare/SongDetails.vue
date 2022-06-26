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
                        <p class="card-text" :class="selected('danceability')">Danceability: {{this.prettyFeatureValue(features.danceability, "danceability")}}</p>
                        <p class="card-text" :class="selected('energy')">Energy: {{this.prettyFeatureValue(features.energy, "energy")}}</p>
                        <p class="card-text" :class="selected('key')">Key: {{this.prettyFeatureValue(features.key, "key")}}</p>
                        <p class="card-text" :class="selected('loudness')">Loudness: {{this.prettyFeatureValue(features.loudness, "loudness")}}</p>
                    </div>
                    <div class="col">
                        <p class="card-text" :class="selected('mode')">Mode: {{this.prettyFeatureValue(features.mode, "mode")}}</p>
                        <p class="card-text" :class="selected('speechiness')">Speechiness: {{this.prettyFeatureValue(features.speechiness, "speechiness")}}</p>
                        <p class="card-text" :class="selected('acousticness')">Acousticness: {{this.prettyFeatureValue(features.acousticness, "acousticness")}}</p>
                        <p class="card-text" :class="selected('instrumentalness')">Instrumentalness: {{this.prettyFeatureValue(features.instrumentalness, "instrumentalness")}}</p>
                    </div>
                    <div class="col">
                        <p class="card-text" :class="selected('liveness')">Liveness: {{this.prettyFeatureValue(features.liveness, "liveness")}}</p>
                        <p class="card-text" :class="selected('valence')">Valence: {{this.prettyFeatureValue(features.valence, "valence")}}</p>
                        <p class="card-text" :class="selected('tempo')">Tempo: {{this.prettyFeatureValue(features.tempo, "tempo")}}</p>
                        <p class="card-text" :class="selected('duration_ms')">Duration: {{this.prettyFeatureValue(features.duration_ms, "duration_ms")}}</p>
                        <p class="card-text" :class="selected('time_signature')">Time signature: {{this.prettyFeatureValue(features.time_signature, "time_signature")}}</p>
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