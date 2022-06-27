<template>
    <div class="shuffleboard rounded text-white bg-dark">
        <!-- General info about shuffleboard -->
        <div class="row alert myalert generalinfo justify-content-center" align="center">
            Using this board, you can alter the order of the playlist. By choosing features you find important and exclaiming if they need to be as high, or as low, as possible; a new order will be sought to satisfy your needs. 
            <!-- <br/> -->
            Features that are not specified, will not be taken in consideration when searching for a new order.

            <a class="mybtn active" align="center" data-toggle="modal" data-target="#featureexplanation" data-backdrop="false">Explanation of features</a>
        </div>

        <div class="row" align="center">
            <!-- Nav for features -->
            <div class="col align-self-center"><nav>
                <!-- Tab labels -->
                <div class="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-preset-tab" data-toggle="tab" href="#nav-preset" role="tab" aria-controls="nav-preset" aria-selected="true">Presets</a>
                    <a class="nav-item nav-link" id="nav-custom-tab" data-toggle="tab" href="#nav-custom" role="tab" aria-controls="nav-custom" aria-selected="false">Custom</a>
                    <a class="nav-item nav-link" id="nav-songsimilarity-tab" data-toggle="tab" href="#nav-songsimilarity" role="tab" aria-controls="nav-songsimilarity" aria-selected="false">Song similarity</a>
                    <a class="nav-item nav-link" id="nav-dragdrop-tab" data-toggle="tab" href="#nav-dragdrop" role="tab" aria-controls="nav-dragdrop" aria-selected="false">Drag&drop</a>
                </div>
                <!-- Tab content -->
                <div class="tab-content" id="nav-tabContent">
                    <!-- Presets tab -->
                    <div class="tab-pane fade show active" id="nav-preset" role="tabpanel" aria-labelledby="nav-preset-tab">
                        <Presets
                            ref="presets"
                            @selected-features="broadcastSelectedFeatures"
                            :features="features"
                            :explanations="explanations">
                        </Presets>
                    </div>
                    <!-- Custom feature tab -->
                    <div class="tab-pane fade" id="nav-custom" role="tabpanel" aria-labelledby="nav-custom-tab">
                        <FeatureSelection
                            ref="featureselection"
                            :features="features"
                            :explanations="explanations"
                            @selected-features="broadcastSelectedFeatures">
                        </FeatureSelection>
                    </div>
                    <!-- Similar to song -->
                    <div class="tab-pane fade" id="nav-songsimilarity" role="tabpanel" aria-labelledby="nav-songsimilarity-tab">
                        <SongSimilarity
                            ref="songsimilarity"
                            @selected-features="broadcastSelectedFeatures"
                            :allsongs="allsongs"
                            :allfeatures="allfeatures"
                            :features="features"
                            :explanations="explanations">
                        </SongSimilarity>
                    </div>
                    <!-- Drag&drop car mode -->
                    <div class="tab-pane fade" id="nav-dragdrop" role="tabpanel" aria-labelledby="nav-dragdrop-tab">
                        <DragDrop
                            ref="dragdrop"
                            @selected-features="broadcastSelectedFeatures"
                            :features="features"
                            :explanations="explanations">
                        </DragDrop>
                    </div>
                </div>
            </nav></div>

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
import Presets from "./Presets.vue";
import FeatureSelection from "./FeatureSelection.vue";
import SongSimilarity from "./SongSimilarity.vue";
import DragDrop from "./DragDrop.vue";
import { prettyFeatureValue as pfv, prettyFeatureName as pfn } from "../../prettyFunctions.js";

export default {
    emits: ['selected-features'],
    props: {
        allsongs: {
            type: Array,
        },
        allfeatures: {
            type: Array,
        },
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
            // danceability: 0.5,
            // energy: 0.5,
            // speechiness: 0.5,
            // acousticness: 0.5,
            // instrumentalness: 0.5,
            // liveness: 0.5,
            // valence: 0.5,

            // key: 0,
            // loudness: -30,
            // mode: 0,
            // tempo: 50,
            // timesign: 5,
            // duration: 2000,
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
            console.debug("Shuffleboard: Emitting selected features", selfeat);
            this.$emit('selected-features', selfeat);
        },

        clearSelectedFeatures() {
            console.debug("Deleting selected features");
            this.$emit('selected-features', {});

            // EMPTY PRESETS + EMPTY CUSTOM FEATURES
            this.$refs.presets.emptyPresets();
            this.$refs.featureselection.emptyFeatures();
            this.$refs.songsimilarity.emptyFeatures();
            this.$refs.dragdrop.emptyFeatures();
        },

        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },
    }, 
    components: {
    Presets,
    FeatureSelection,
    SongSimilarity,
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