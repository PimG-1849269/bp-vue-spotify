<template>
<div>
    <div class="row" align="center">
        <!-- Presets -->
        <div class="col align-self-center">
            <div class="row" align="center">
            <div 
                v-for="(value, preset,index) in presets"
                class="presetcol col align-self-center">

                <button     
                    :ref="'preset'+index"
                    @click="presetClicked(index, value)"
                    type="button" 
                    class="mybtn">
                    {{preset}}
                </button>
            </div>
            </div>
        </div>

        <!-- Tweakable -->
        <div class="col align-self-center"
            v-if="chosenindex != -1">
            <div v-for="(value, feat) in chosen">
                <i class="fa fa-times text-danger del-icon" v-on:click="delFeature(feat)"></i>
                {{ prettyFeatureName(feat) }}: {{ prettyFeatureValue(value, feat) }}
            </div>
            <a class="btn btn-sm btn-secondary" data-toggle="collapse" href="#addFeatureRowPresets" role="button" aria-expanded="false" aria-controls="addFeatureRow">Add / Edit</a>
        </div>

        <!-- Shuffle button -->
        <div class="col-2 align-self-center">
            <a v-on:click="broadcastSelectedFeatures" class="mybtn active">Shuffle</a>
        </div>
    </div>

    <!-- Add option to add other features -->
    <div class="collapse" id="addFeatureRowPresets">
    <div class="border border-secondary rounded addfeature" align="center" >
        <AddFeatureComp
            :features="features"
            :explanations="explanations"
            @added-feature="addFeature"
            @error="throwError">
        </AddFeatureComp>
    </div>
    </div>

    <!-- Show error when something goes wrong -->
    <div v-if="errormsg != ''" class="row error text-uppercase" align="center">
        <div class="col">
            <div class="alert alert-danger" role="alert">
                {{errormsg}}
            </div>
        </div>
    </div>
</div>
</template>

<script>
import pres from "@/assets/presets.json";
import { prettyFeatureValue as pfv, prettyFeatureName as pfn } from "../../prettyFunctions.js";
import AddFeatureComp from "./AddFeatureComp.vue";

export default {
    emits: ["selected-features"],
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
            presets: {},
            numpresets: 0,
            chosen: {},
            chosenindex: -1,
            errormsg: "",
        };
    },
    computed: {},
    mounted() {
        this.loadPresets();
    },
    methods: {
        loadPresets() {
            this.presets = pres;
            this.numpresets = Object.keys(this.presets).length;
            console.debug("Loading presets", this.presets);
        },
        // Update chosen and toggle buttons
        presetClicked(index, value) {
            this.throwError("");
            // If button was activated
            if (this.chosenindex == index) {
                this.chosenindex = -1;
                this.chosen = {};
                this.$refs["preset" + index][0].className = this.$refs["preset" + index][0].className.replace(" active", "");
            }
            else {
                // New preset chosen
                this.chosenindex = index;
                // Use JQUERY.extend to copy by value
                this.chosen = $.extend(true, {}, value);
                // Unable all other presets
                for (var i = 0; i < this.numpresets; i++) {
                    if (i != index) {
                        this.$refs["preset" + i][0].className = this.$refs["preset" + i][0].className.replace(" active", "");
                    }
                    else {
                        this.$refs["preset" + i][0].className += " active";
                    }
                }
            }
        },
        broadcastSelectedFeatures() {
            if (this.chosenindex != -1) {
                console.debug("Presets: Emitting selected features");
                // console.log(this.chosen);
                this.$emit("selected-features", this.chosen);
            }
            else {
                this.throwError("No preset chosen.");
            }
        },
        throwError(err) {
            this.errormsg = err;
        },
        emptyPresets() {
            // No preset chosen
            this.chosenindex = -1;
            this.chosen = {};
            // Unable all presets
            for (var i = 0; i < this.numpresets; i++) {
                this.$refs["preset" + i][0].className = this.$refs["preset" + i][0].className.replace(" active", "");
            }
        },

        addFeature(feat, val) {
            this.chosen[feat] = val;
            this.throwError("");
            this.$forceUpdate();
        },
        delFeature(feat) {
            delete this.chosen[feat];
            if (Object.keys(this.chosen).length == 0) {
                this.emptyPresets();
            }
            this.$forceUpdate();
        },

        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },
    },
    components: { AddFeatureComp }
}
</script>

<style>
.presetcol {
    padding: 1%;
}

.addfeature {
    margin: 1%;
    padding: 1%;
}

.error {
    font-weight: 600;
}
</style>