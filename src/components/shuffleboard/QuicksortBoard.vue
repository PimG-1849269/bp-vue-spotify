<template>
    <div class="shuffleboard rounded text-white bg-dark">

        <div class="row" align="center">
            <!-- Nav for features -->
            <div class="col align-self-center">
                <DragDrop
                    ref="dragdrop"
                    @selected-features="broadcastSelectedFeatures"
                    :features="features"
                    :explanations="explanations">
                </DragDrop>
            </div>

            <!-- Clear -->
            <div v-if="Object.keys(selectedfeatures).length > 0" class="col-2 align-self-center">
                <a v-on:click="clearSelectedFeatures" class="btn btn-outline-danger text-danger">Clear</a>
            </div>
        </div>

        <!-- "Currently filtering on" -->
        <div v-if="Object.keys(selectedfeatures).length > 0" class="row info" align="center">
            <div class="col">
                <div class="alert alert-info" role="alert">
                    <b>Currently filtering on:</b> {{prettySelected}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DragDrop from "./DragDrop.vue";
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
        selectedfeatures: {
            type: Object,
            default: {},
        }
    },

    data() {
        return {
        }
    },

    computed: {
        prettySelected() {
            var pretty = ""
            for (var i in this.$props.selectedfeatures) {
                pretty += pfn(i) + ": " + pfv(this.$props.selectedfeatures[i], i) + ", ";
            }
            return pretty;
        }
    },

    methods: {
        broadcastSelectedFeatures(selfeat) {
            console.debug("QuicksortBoard: Emitting selected features", selfeat);
            this.$emit('selected-features', selfeat);
        },

        clearSelectedFeatures() {
            console.debug("Deleting selected features");
            this.$emit('selected-features', {});
            this.$refs.dragdrop.emptyFeatures();
        },

        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },
    }, 
    components: {
    DragDrop
}
}
</script>

<style>
.shuffleboard {
    margin-bottom: 5%;
    padding: 2%;
}

.tab-content {
    padding-top: 3%
}

.info {
    margin: 1%;
    margin-bottom: -2%;
}

.generalinfo {
    margin-bottom: 2%;
    color: white;
}


/* OVERWRITE CSS TO LOOK LIKE SPOTIFY LAYOUT */
.mybtn  {
	min-width: 130px;
	padding: 9px 37px;
	/* background: #1db954; */
    border: 2px solid #1db954;
	border-radius: 50px;
	font-size: 12px;
	font-weight: 600;
	color: #fff;
	line-height: 1;
	letter-spacing: 1px;
	text-transform: uppercase;
	cursor: pointer;
	outline: none;
}
.mybtn.active {
    background: #1db954;
}
.mybtn:hover {
    background: #2cc863;
}

.nav-item {
    color: #1db954 !important;
    font-weight: 600;
}
.nav-item.active {
    color: white !important;
    background-color: #1db954 !important;
}
.nav-tabs{
    border-color: #1db954 !important;
}
.nav-link.active{
    border-color: #1db954 !important;
}

.myalert {
    border: 2px solid #959595;
    background-color: #959595;
}

</style>