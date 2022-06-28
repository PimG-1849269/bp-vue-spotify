<template>
<div>
    <div class="row" align="center">
    
    <div class="col-6 align-self-center">
    <AddFeatureComp
        :features="features"
        :explanations="explanations"
        @added-feature="addFeature"
        @error="throwError">
    </AddFeatureComp>
    </div>

    <!-- List of added features -->
    <div class="col align-self-center">
        <div v-for="(value, feat) in addedfeatures">
            <i class="fa fa-times text-danger del-icon" v-on:click="delFeature(feat)"></i>
            {{ prettyFeatureName(feat) }}: {{ prettyFeatureValue(value, feat) }}
        </div>
    </div>

    <!-- Shuffle button -->
    <div class="col align-self-center">
        <a v-on:click="broadcastSelectedFeatures" class="mybtn active">Shuffle</a>
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
import AddFeatureComp from "./AddFeatureComp.vue";
import { prettyFeatureValue as pfv, prettyFeatureName as pfn } from "../../prettyFunctions.js";

export default {
    emits: ['selected-features'],
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
            addedfeatures: {},
            selectedfeature: null,
            selectedvalue: Number.NEGATIVE_INFINITY,

            errormsg: "",
        }
    },
    computed: {
    },

    methods: {
        addFeature(feat, val) {
            this.addedfeatures[feat] = val;
            this.throwError("");
            this.$forceUpdate();
        },

        delFeature(feat) {
            delete this.addedfeatures[feat];
            this.$forceUpdate();
        },

        broadcastSelectedFeatures() {
            if (Object.keys(this.addedfeatures).length > 0) {
                console.debug("FeatSel: Emitting selected features");
                this.$emit('selected-features', this.addedfeatures);
            } else {
                this.throwError("No feature selected.")
            }
        },

        throwError(err) {
            this.errormsg = err;
        },

        emptyFeatures() {
            this.addedfeatures = {};
            this.selectedfeature = null;
            this.selectedvalue = Number.NEGATIVE_INFINITY;
        },

        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },
    },

    components: {
        AddFeatureComp
    }
}
</script>

<style>
.del-icon:hover {
    cursor: pointer;
}

.addbtn:hover {
    color: var(--white) !important; 
}

.slider-blue {
  --slider-connect-bg: #3B82F6;
  --slider-tooltip-bg: #3B82F6;
  --slider-handle-ring-color: #3B82F630;
}

.error {
    margin-top: 2%;
    margin-bottom: -2%;
}
</style>