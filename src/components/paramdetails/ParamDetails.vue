<template>
    <div class="paramdetails border rounded text-white">
        <!-- Row to explain component -->
        <div class="row explanation border-bottom border-secondary" align="center">
            <div class="col font-weight-bold">
                Song with smallest value
            </div>
            <div class="col font-weight-bold">
                Feature
            </div>
            <div class="col font-weight-bold">
                Song with highest value
            </div>
        </div>

        <!-- For every feature -->
        <div class="row" align="center"
            v-if="songsLoaded"
            v-for="(feat) in features">
            <div class="col">
                <!-- {{ allsongs[minima[feat]].name  }} -->
                <iframe :src="'https://open.spotify.com/embed/track/'+allsongs[minima[feat]].id" width="250" height="80" frameborder="0" allowtransparency="true"></iframe>
            </div>
            <div class="col">
                <div class="row"><div class="col font-weight-bold font-italic">{{ prettyFeatureName(feat) }}</div></div>
                <div class="row"><div class="col">{{explanations[feat]}}</div></div>
            </div>
            <div class="col">
                <!-- {{ allsongs[maxima[feat]].name }} -->
                <iframe :src="'https://open.spotify.com/embed/track/'+allsongs[maxima[feat]].id" width="250" height="80" frameborder="0" allowtransparency="true"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
import { prettyFeatureName as pfn } from '../../prettyFunctions.js';

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
            minima: {
                "danceability": 0,
                "energy": 0,
                "speechiness": 0,
                "acousticness": 0,
                "instrumentalness": 0,
                "liveness": 0,
                "valence": 0,
                "key": 0,
                "loudness": 0,
                "mode": 0,
                "tempo": 0,
                "time_signature": 0,
                "duration_ms": 0
            },
            maxima: {
                "danceability": 0,
                "energy": 0,
                "speechiness": 0,
                "acousticness": 0,
                "instrumentalness": 0,
                "liveness": 0,
                "valence": 0,
                "key": 0,
                "loudness": 0,
                "mode": 0,
                "tempo": 0,
                "time_signature": 0,
                "duration_ms": 0
            },
        };
    },
    computed: {
        songsLoaded: function() {
            return (typeof(this.$props.allsongs) !== 'undefined' 
                    && this.$props.allsongs.length > 0) 
        },
    },

    mounted() {
        if (this.$props.allfeatures != null && this.$props.allsongs != null){
            this.calcExtrema();
        }
    },

    methods: {
        calcExtrema() {
            for (var i = 0; i < this.$props.features.length; i++) {
                this.calcMinima(this.$props.features[i]);
                this.calcMaxima(this.$props.features[i]);
            }
        },
        calcMinima(feature) {
            var min = -1;
            var minvalue = Number.POSITIVE_INFINITY;
            for (var i = 0; i < this.$props.allsongs.length; i++) {
                // console.debug(feature, i, this.$props.allfeatures[i][feature], minvalue, min)
                if (this.$props.allfeatures[i][feature] < minvalue) {
                    min = i;
                    minvalue = this.$props.allfeatures[i][feature];
                }
            }
            if (min != -1) {
                this.minima[feature] = min;
            }
            
            // return min;
        },
        calcMaxima(feature) {
            var max = -1;
            var maxvalue = Number.NEGATIVE_INFINITY;
            for (var i = 0; i < this.$props.allsongs.length; i++) {
                // console.debug(feature, i, this.$props.allfeatures[i][feature], maxvalue, max)
                if (this.$props.allfeatures[i][feature] > maxvalue) {
                    max = i;
                    maxvalue = this.$props.allfeatures[i][feature];
                }
            }

            if (max != -1) {
                this.maxima[feature] = max;
            }
            // return max;
        },

        prettyFeatureName(feat, firstup = true) {
            return pfn(feat, firstup);
        },
    },
    watch: {
        allfeatures: {
            handler(newValue, oldValue) {
                // If actually changed
                if (newValue !== oldValue && (typeof(newValue) !== 'undefined' && newValue.length > 0)) {
                    this.calcExtrema();
                }
            },
            deep: true
        }
    }
}
</script>

<style>
.paramdetails {
    /* margin-top: 5%; */
    border: 1px solid #1db954 !important;
    background-color: #1db954 !important;
    font-weight: 600 !important;
}

.explanation {
    margin: 3%;
}
</style>