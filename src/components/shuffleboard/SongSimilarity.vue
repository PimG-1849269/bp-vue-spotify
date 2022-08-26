<template>
<div>
   <div class="row" align="center">
        <!-- Songselection -->
        <div class="col align-self-center">
            <div class="dropdown">
                <!-- Button -->
                <button v-if="selectedsongid != -1"
                class="mybtn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                    {{ selectedsong }}
                </button>
                <button v-else
                class="mybtn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                    Song
                </button>
                <!-- Options -->
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" 
                        href="#"
                        v-for="(song, index) in allsongs"
                        v-on:click="selectSong(song.name, song.id);">
                        {{song.name}}
                    </a>
                </div>
            </div>
            <!-- Option to get all features -->
            <div class="form-check">
                <input 
                    v-model="showall"
                    @change="getFeatures()"
                    type="checkbox" class="form-check-input" id="getAllCheck">
                <label class="form-check-label" for="getAllCheck">Get all features</label>
            </div>
        </div>

        <!-- Tweakable -->
        <div class="col align-self-center">
            <div v-for="(value, feat) in selectedfeatures">
                <i class="fa fa-times text-danger del-icon" v-on:click="delFeature(feat)"></i>
                {{ prettyFeatureName(feat) }}: {{ prettyFeatureValue(value, feat) }}
            </div>
            <a v-if="selectedsongid != -1" class="btn btn-sm btn-secondary addbtn" data-toggle="collapse" href="#addFeatureRow" role="button" aria-expanded="false" aria-controls="addFeatureRow">Add / Edit</a>
        </div>

        <!-- Shuffle button -->
        <div class="col-2 align-self-center">
            <a v-on:click="broadcastSelectedFeatures" class="mybtn active">Sort</a>
        </div>
    </div>

    <!-- Add option to add other features -->
    <div class="collapse" id="addFeatureRow">
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
import AddFeatureComp from "./AddFeatureComp.vue";
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
    },

    data() {
        return {
            selectedsong: "",
            selectedsongid: -1,
            selectedfeatures: {},

            errormsg: "",
            showall: false,
        };
    },

    computed: {

    },

    methods: {
        broadcastSelectedFeatures() {
            if (this.selectedsongid != -1) {
                console.debug("SongSimilarity: Emitting selected features");
                // console.log(this.selectedfeatures)
                this.$emit('selected-features', this.selectedfeatures);
            } else {
                this.throwError("No song chosen.");
            }
            
        },

        throwError(err) {
            this.errormsg = err;
        },

        addFeature(feat, val) {
            this.selectedfeatures[feat] = val;
            this.throwError("");
            this.$forceUpdate();
        },

        delFeature(feat) {
            delete this.selectedfeatures[feat];
            if (Object.keys(this.selectedfeatures).length == 0) {
                this.selectSong("", -1);
            }
            this.$forceUpdate();
        },

        selectSong(name, id) {
            this.selectedsong = name;
            this.selectedsongid = id;

            this.throwError("");
            this.getFeatures();
        },

        getFeatures() {
            if (this.selectedsongid != -1) {
                // Search features
                var songfeatures;
                for (var feat in this.$props.allfeatures) {
                    if (this.$props.allfeatures[feat]["id"] == this.selectedsongid) {
                        songfeatures = this.$props.allfeatures[feat];
                    }
                }

                // Detect extreme features
                this.selectedfeatures = {};
                for (var j in songfeatures) {
                    if (this.$props.features.includes(j)) {
                        if (this.showall) {
                            const nonprocents = ["key", "mode", "loudness", "tempo", "time_signature", "duration_ms"];
                            // Just add nonprocentual values
                            if (nonprocents.includes(j)) {
                                this.selectedfeatures[j] = songfeatures[j];
                            } else {
                                this.selectedfeatures[j] = Math.round(songfeatures[j]*100);
                            }
                        } else {
                            // nonrocentual
                            if (j == "key" || j == "mode") {
                                // ignore
                            } else if (j == "loudness") {
                                if (songfeatures[j] >= -7 || songfeatures[j] <= -30) {
                                    this.selectedfeatures[j] = songfeatures[j];
                                }
                            } else if (j == "tempo") {
                                if (songfeatures[j] >= 170 || songfeatures[j] <= 100) {
                                    this.selectedfeatures[j] = songfeatures[j];
                                }
                            } else if (j == "time_signature") {
                                if (songfeatures[j] >= 6 || songfeatures[j] <= 3) {
                                    this.selectedfeatures[j] = songfeatures[j];
                                }
                            } else if (j == "duration_ms") {
                                // https://fortune.com/2019/01/17/shorter-songs-spotify/
                                // 2:00min and 3:30min
                                if (songfeatures[j] >= 210000 || songfeatures[j] <= 120000) {
                                    this.selectedfeatures[j] = songfeatures[j];
                                }
                            // procentual
                            } else if (songfeatures[j] >= 0.80 || songfeatures[j] <= 0.20) {
                                this.selectedfeatures[j] = Math.round(songfeatures[j]*100);
                            }
                        }
                    }
                }
            }
        },

        emptyFeatures() {
            this.selectedfeatures = {};
            this.selectedsong = "";
            this.selectedsongid = -1;
        },
        
        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },
    },
    components: {
        AddFeatureComp,
    }
}
</script>

<style>
.addfeature {
    margin: 1%;
    padding: 1%;
}

.form-check-input {
    display: initial !important;
    width: 15px !important;
    height: 15px !important;
    border-radius: 5px;
}
.form-check-input:checked {
    background-color: #1db954 !important;
    /* clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); */
}
.form-check-input:hover {
    background-color: #2cc863 !important;
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 0, 0, 0.25)
}
</style>