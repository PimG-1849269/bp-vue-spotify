<template>
<div v-if="relationExists">
    <medium>Difference with {{relation}} song</medium>
    
    <div class="row border feature-row rounded">
        <div class="col">
            <FeatureComp feature="Danceability" :value="calcDiff('danceability')" :class="selected('danceability')"></FeatureComp>
            <FeatureComp feature="Energy" :value="calcDiff('energy')" :class="selected('energy')"></FeatureComp>
            <FeatureComp feature="Key" :value="calcDiff('key')" :class="selected('key')"></FeatureComp>
            <FeatureComp feature="Loudness" :value="calcDiff('loudness')" :class="selected('loudness')"></FeatureComp>
        </div>
        <div class="col">
            <FeatureComp feature="Mode" :value="calcDiff('mode')" :class="selected('mode')"></FeatureComp>
            <FeatureComp feature="Speechiness" :value="calcDiff('speechiness')" :class="selected('speechiness')"></FeatureComp>
            <FeatureComp feature="Acousticness" :value="calcDiff('acousticness')" :class="selected('acousticness')"></FeatureComp>
            <FeatureComp feature="Instrumentalness" :value="calcDiff('instrumentalness')" :class="selected('instrumentalness')"></FeatureComp>
        </div>
        <div class="col">
            <FeatureComp feature="Liveness" :value="calcDiff('liveness')" :class="selected('liveness')"></FeatureComp>
            <FeatureComp feature="Valence" :value="calcDiff('valence')" :class="selected('valence')"></FeatureComp>
            <FeatureComp feature="Tempo" :value="calcDiff('tempo')" :class="selected('tempo')"></FeatureComp>
            <FeatureComp feature="Duration" :value="calcDiff('duration_ms')" :class="selected('duration_ms')"></FeatureComp>
            <FeatureComp feature="Time signature" :value="calcDiff('time_signature')" :class="selected('time_signature')"></FeatureComp>
        </div>
    </div>

    <!-- <div class="row border feature-row" v-else>
        <p class="card-text font-weight-bold">No {{relation}} song available.</p>
    </div> -->
</div>
</template>

<script>
import FeatureComp from "./FeatureComp.vue";
import { prettyFeatureDiff as pfd } from "../../prettyFunctions.js";

export default {
    props: {
        relation: {
            type: String,
            default: ""
        },
        features: {
            type: Object,
        },
        features_to_comp: {
            type: Object,
        },
        selectedfeatures: {
            type: Object,
        }
    },
    computed: {
        relationExists: function() {
            return (typeof this.$props.features_to_comp !== "undefined");
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

        calcDiff(feat) {
            var diff = this.$props.features[feat] - this.$props.features_to_comp[feat];
            return pfd(diff, feat, this.$props.features[feat], this.relation);
        },
    },

    components: {
        FeatureComp,
    }
}
</script>

<style>
</style>