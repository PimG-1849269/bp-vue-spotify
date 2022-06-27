<template>
<div class="addfeaturecomp row">
<!-- IMPORTANT: MUST BE PUT IN A ROW! -->
    <!-- Dropdown of features -->
    <div class="col align-self-center">
        <div class="dropdown">
            <!-- Button -->
            <button v-if="selectedfeature != null"
            class="mybtn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                {{ prettyFeatureName(selectedfeature, true) }}
            </button>
            <button v-else
            class="mybtn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                Feature
            </button>
            <!-- Options -->
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" 
                    href="#"
                    v-for="(feat, index) in features"
                    v-on:click="selectedfeature = feat; selectedvalue = Number.NEGATIVE_INFINITY;"
                    :title="explanations[feat]">
                    {{prettyFeatureName(feat)}}
                </a>
            </div>
        </div>
    </div>

    <!-- Slider -->
    <div class="col align-self-center">
        <p>{{prettyFeatureValue(selectedvalue, selectedfeature)}}</p>

        <Slider
            class="slider-blue"
            v-model="selectedvalue"
            showTooltip="drag"
            :step="stepSlider"
            :min="minSlider"
            :max="maxSlider"
            :format="formatSlider">
        </Slider>
    </div>

    <!-- Add button -->
    <div class="col align-self-center text-primary">
        <a v-on:click="addFeature" class="mybtn">Add</a>
    </div>
</div>
</template>

<script>
// Slider from https://github.com/vueform/slider#using-with-vue-3
import "@vueform/slider/themes/default.css";
import Slider from "@vueform/slider";
import { prettyFeatureValue as pfv, prettyFeatureName as pfn} from "../../prettyFunctions.js";

export default {
    emits: ['added-feature', 'error'],
    props: {
        features: {
            type: Array,
        },
        explanations: {
            type: Object,
        },
    },
    data() {
        return {
            selectedfeature: null,
            selectedvalue: Number.NEGATIVE_INFINITY,
        }
    },
    computed: {
        stepSlider() {
            if (this.selectedfeature == "tempo") {
                return 5;
            } else if (this.selectedfeature == "duration_ms") {
                return 30000;
            } else {
                return 1;
            }
        },
        minSlider() {
            if (this.selectedfeature == "loudness") {
                return -60;
            } else if (this.selectedfeature == "tempo") {
                return 20;
            } else if (this.selectedfeature == "time_signature"){
                return 3;
            } else {
                return 0;
            }
        },
        maxSlider() {
            if (this.selectedfeature == "key") {
                return 11;
            } else if (this.selectedfeature == "loudness") {
                return 0;
            } else if (this.selectedfeature == "mode") {
                return 1;
            } else if (this.selectedfeature == "tempo") {
                return 250;
            } else if (this.selectedfeature == "time_signature"){
                return 7;
            } else if (this.selectedfeature == "duration_ms"){
                return 600000;
            } else {
                return 100;
            }
        },
        formatSlider() {
            if (this.selectedfeature == "key") {
                return function(value){
                    const notes = ["C", "C#,Db", "D", "D#,Eb", "E", "F", "F#,Gb", "G", "G#,Ab", "A", "A#,Bb","B"];
                    return notes[parseInt(value)];};
            } else if (this.selectedfeature == "loudness") {
                return function(value) {return value+"dB";};
            } else if (this.selectedfeature == "mode") {
                return function(value) {
                    if (value == 0) {
                        return "Minor";
                    } else {
                        return "Major";
                    }
                }

            } else if (this.selectedfeature == "tempo") {
                return function(value) {return value+"bpm";};

            } else if (this.selectedfeature == "time_signature"){
                return function(value){return value+"/4";};
            } else if (this.selectedfeature == "duration_ms"){
                // Could not pass msToMin...
                return function(value){
                    var minutes = Math.floor(value / 60000);
                    var seconds = ((value % 60000) / 1000).toFixed(0);
                    return (seconds == 60 ?
                        (minutes + 1) + ":00" :
                        minutes + ":" + (seconds < 10 ? "0" : "") + seconds)+"min";};
            } else {
                return function(value){return value+"%";};
            }
        },
    },

    methods: {
        addFeature() {
            if (this.selectedfeature != null && this.selectedvalue != Number.NEGATIVE_INFINITY) {
                var add = {};
                add[this.selectedfeature] = this.selectedvalue;
                this.$emit('added-feature', this.selectedfeature, this.selectedvalue);
            } else {
                this.$emit('error', "Both feature and value need to be set.");
            }
        },

        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },  
    },

    components: {
        Slider,
    }
}
</script>

<style>
.addfeaturecomp .mybtn {
    color: white !important;
}
</style>