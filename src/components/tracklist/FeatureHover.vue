<template>
    <div class="featurehover border border-secondary rounded bg-dark">
        <div v-if="!firstSong" class="text-white font-weight-bold">Compared to previous song:</div>
        <div
            v-for="(value, feat) in featurestoshow">

            <div v-if="firstSong">
                <div>
                    {{prettyFeatureName(feat)}}:
                    {{prettyFeatureValue(feat)}}
                </div>
            </div>

            <div v-else>
                <div class="row">
                    <div class="col-5">{{prettyFeatureName(feat)}}: </div>
                    <div class="col">
                        <div class="row">
                        <div class="col-2" v-if="iconNeeded(feat)">
                            <IconDiff :val="prettyFeatureDiff(feat)"></IconDiff>
                        </div>
                        <div class="col">
                            {{prettyFeatureDiff(feat)}}
                        </div>
                        </div>
                    </div>

                    <!-- {{prettyFeatureName(feat)}}:
                    <IconDiff v-if="iconNeeded(feat)"
                        :val="prettyFeatureDiff(feat)"></IconDiff>
                    {{prettyFeatureDiff(feat)}} -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconDiff from "../compare/IconDiff.vue";
import { prettyFeatureValue as pfv, prettyFeatureDiff as pfd, prettyFeatureName as pfn } from "../../prettyFunctions.js";

export default {
    props: {
        featurestoshow: {
            type: Object
        },
        features: {
            type: Object,
        },
        previous: {
            type: Object
        }
    },
    computed: {
        firstSong: function() {
            if (this.$props.previous == null){
                return true;
            } else {
                return false;
            }
        },
    },

    methods: {
        diffValue(feat) {
            return (this.$props.features[feat] - this.$props.previous[feat]);
        },

        prettyFeatureValue(feat) {
            return pfv(this.$props.features[feat], feat);
        },

        prettyFeatureDiff(feat) {
            return pfd(this.diffValue(feat), feat, this.$props.features[feat], "previous");
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },

        iconNeeded(feat) {
            if (feat == "key" || feat == "mode" || feat == "time_signature") {
                return false;
            } else {
                return true;
            }
        },
    },

    components: {
        IconDiff
    }
}
</script>

<style>
.featurehover {
    /* To hover */
    display:block;
    position:fixed;
    overflow:hidden;
    z-index: 200;
    
    /* Layout */
    padding: 1%;
    }
</style>