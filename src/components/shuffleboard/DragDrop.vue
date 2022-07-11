<template>
<div class="dragdrop">
   <div class="row" align="center">
        <!-- Drag & drop comp -->
        <div class="col align-self-center">
            <!-- <div class="row" align="center"> -->
                <!-- All features -->
                <div class="col align-self-center">
                    <!-- Dropzone 0: all features -->
                    <div class='drop-zone'
                    @drop="onDrop($event, 'deselect')" 
                    @dragover.prevent
                    @dragenter.prevent>
                        <div class='drag-el rounded'
                        v-for='feat in notChosen'
                        draggable="true"
                        @dragstart="startDrag($event, [feat, 'deselect']);">
                            {{ prettyFeatureName(feat) }}
                        </div>
                    </div>
                </div>

                <!-- Dropzones -->
                <div class="row" align="center">
                    <!-- Dropzone 1: low values -->
                    <div class="m-3 col align-self-center border border-secondary rounded">
                        <p>Low value</p>
                        <div class='drop-zone'
                        @drop="onDrop($event, 'low')" 
                        @dragover.prevent 
                        @dragenter.prevent>
                            <div class='drag-el rounded'
                            v-for='feat in lowfeat'
                            draggable="true"
                            @dragstart="startDrag($event, [feat, 'low'])">
                                {{ prettyFeatureName(feat) }}
                            </div>
                        </div>
                       
                    </div>

                    <!-- Dropzone 2: high values -->
                    <div class="m-3 col align-self-center border border-secondary rounded">
                        <p>High value</p>
                        <div class='drop-zone'
                        @drop="onDrop($event, 'high')" 
                        @dragover.prevent 
                        @dragenter.prevent>
                            <div class='drag-el rounded'
                            v-for='feat in highfeat'
                            draggable="true"
                            @dragstart="startDrag($event, [feat, 'high'])">
                                {{ prettyFeatureName(feat) }}
                            </div>
                        </div> 
                    </div>

                <!-- </div> -->
            </div>            
        </div>

        <!-- Tweakable -->
        <div class="col align-self-center">
            <div v-for="(value, feat) in selectedfeatures">
                <i class="fa fa-times text-danger del-icon" v-on:click="delFeature(feat)"></i>
                {{ prettyFeatureName(feat) }}: {{ prettyFeatureValue(value, feat) }}
            </div>
        </div>

        <!-- Shuffle button -->
        <div class="col-2 align-self-center">
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
            selectedfeatures: {},
            notChosen: [],
            highfeat: [],
            lowfeat: [],

            errormsg: "",
            showall: false,
        };
    },

    computed: {
        // notChosen () {
        //     return this.$props.features.filter(feat => ((!(feat in this.selectedfeatures)) && feat != "key" && feat != "mode"));
        // },
        // highValues () {
        //     return this.$props.features.filter(feat => feat in this.highfeat);
        // },
        // lowValues () {
        //     return this.$props.features.filter(feat => feat in this.lowfeat);
        // }
  	},

    mounted() {
        this.emptyFeatures();
    },

    methods: {
        startDrag (evt, featfrom) {
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('featfrom', featfrom);
            // console.debug("Dragging:", featfrom);
  		},
  		onDrop (evt, zone) {
  			const featfrom = evt.dataTransfer.getData('featfrom').split(',');
            const feat = featfrom[0];
            const from = featfrom[1];
            
            // Add feat to right zone
  			if (zone == "high" && !(this.highfeat.includes(feat))) {
                // Add feat to zone high
                this.highfeat.push(feat);

                // Add feat to selectedfeat with high value
                this.addToSelected(feat, "high");

                // Remove zone from prev zone
                if (from == "low") {
                    this.lowfeat.splice(this.lowfeat.indexOf(feat),1);
                } else {
                    this.notChosen.splice(this.notChosen.indexOf(feat),1);
                }

            } else if (zone == "low" && !(this.lowfeat.includes(feat))) {
                // Add feat to zone high
                this.lowfeat.push(feat);

                // Add feat to selectedfeat with high value
                this.addToSelected(feat, "low");

                // Remove zone from prev zone
                if (from == "high") {
                    this.highfeat.splice(this.highfeat.indexOf(feat),1);
                } else {
                    this.notChosen.splice(this.notChosen.indexOf(feat),1);
                }

            } else if (zone == "deselect"){
                // If was selected, remove
                if (feat in this.selectedfeatures) {
                    this.delFeature(feat);
                    this.notChosen.push(feat);
                }
            }
  		},

        broadcastSelectedFeatures() {
            if (Object.keys(this.selectedfeatures).length > 0) {
                console.debug("DragDrop: Emitting selected features");
                this.$emit('selected-features', this.selectedfeatures);
            } else {
                this.throwError("No feature selected.")
            }
        },

        throwError(err) {
            this.errormsg = err;
        },

        // Extrema same as SongSimilarity
        addToSelected(feat, zone) {
            if (feat == "loudness") {
                if (zone == "high") {
                    this.selectedfeatures[feat] = -30
                } else if (zone == "low") {
                    this.selectedfeatures[feat] = -7
                }
            } else if (feat == "tempo") {
                if (zone == "high") {
                    this.selectedfeatures[feat] = 170
                } else if (zone == "low") {
                    this.selectedfeatures[feat] = 100
                }
            } else if (feat == "time_signature") {
                if (zone == "high") {
                    this.selectedfeatures[feat] = 6
                } else if (zone == "low") {
                    this.selectedfeatures[feat] = 3
                }
            } else if (feat == "duration_ms") {
                // https://fortune.com/2019/01/17/shorter-songs-spotify/
                // 2:00min and 3:30min
                if (zone == "high") {
                    this.selectedfeatures[feat] = 210000
                } else if (zone == "low") {
                    this.selectedfeatures[feat] = 120000
                }
            } else { // Procentual
                if (zone == "high") {
                    this.selectedfeatures[feat] = 80
                } else if (zone == "low") {
                    this.selectedfeatures[feat] = 20
                }
            }
        },

        addFeature(feat, val) {
            this.selectedfeatures[feat] = val;
            this.throwError("");
        },

        delFeature(feat) {
            delete this.selectedfeatures[feat];
            this.notChosen.push(feat);

            // Delete from high or lowvalues
            if (this.highfeat.includes(feat)) {
                this.highfeat.splice(this.highfeat.indexOf(feat),1);
            } else if (this.lowfeat.includes(feat)) {
                this.lowfeat.splice(this.lowfeat.indexOf(feat),1);
            }

            this.$forceUpdate();
        },

        emptyFeatures() {
            this.selectedfeatures = {};
            this.highfeat = [];
            this.lowfeat = [];
            // Use JQUERY.extend instead of "= selected" to make copy;
            // JS works with pass by reference, so otherwise this would automatically update the list without pressing shuffle-button
            this.notChosen = $.extend(true,[],this.$props.features);
            this.notChosen.splice(this.notChosen.indexOf("key"),1);
            this.notChosen.splice(this.notChosen.indexOf("mode"),1);
        },
        
        prettyFeatureValue(val, feat) {
            return pfv(val, feat);
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },
    },
    components: {
    }
}
</script>

<style>
    .drop-zone {
        min-height: 30px;
        margin-bottom: 2%;
        padding: 1%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        /* background-color: var(--secondary); */
    }

    .drag-el {
        border: 1px solid #1db954;
        background-color: #1db954;
        width: fit-content;
        margin: 1%;
        padding: 1%;
        cursor: move;
        color: white;
        font-weight: 600;
    }

    .dragdrop p {
        font-weight: 600;
    }
</style>