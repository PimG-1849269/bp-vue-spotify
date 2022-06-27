<template>
    <nav>
        <!-- Tab labels -->
        <div class="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-myplaylist-tab" data-toggle="tab" href="#nav-myplaylist" role="tab" aria-controls="nav-myplaylist" aria-selected="true">My playlist</a>
            <a class="nav-item nav-link" id="nav-general-tab" data-toggle="tab" href="#nav-general" role="tab" aria-controls="nav-general" aria-selected="false">General</a>
        </div>
        <!-- Tab content -->
        <div class="tab-content" id="nav-tabContent">
            <!-- My playlist tab -->
            <div class="tab-pane fade show active" id="nav-myplaylist" role="tabpanel" aria-labelledby="nav-myplaylist-tab">
                <ParamDetails
                    ref="myplaylist"
                    :allsongs="allsongs" 
                    :allfeatures="allfeatures"
                    :features="features"
                    :explanations="explanations">
                </ParamDetails>
            </div>
            <!-- General tab -->
            <div class="tab-pane fade" id="nav-general" role="tabpanel" aria-labelledby="nav-general-tab">
                <ParamDetails
                    ref="general"
                    :allsongs="generalsongs" 
                    :allfeatures="generalfeatures"
                    :features="features"
                    :explanations="explanations">
                </ParamDetails>
            </div>
        </div>
    </nav>
</template>

<script>
import ParamDetails from "./ParamDetails.vue";
import generalSongData from "../../assets/top50songs.json";
import generalSongFeatures from "../../assets/top50features.json";

export default {
    props: {
        allsongs: {
            type: Array,
            default: null
        },
        allfeatures: {
            type: Array,
            default: null
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
            generalsongs: [],
            generalfeatures: []
        }
    },

    mounted() {
        this.getGeneralData();
    },

    computed: {

    },

    methods: {
        getGeneralData() {
            console.debug("FeatureExplanation: loading general data from json.");
            this.generalsongs = generalSongData.items;
            this.generalfeatures = generalSongFeatures.audio_features;
        }
    },

    components: {
        ParamDetails
    }
}
</script>

<style>
</style>