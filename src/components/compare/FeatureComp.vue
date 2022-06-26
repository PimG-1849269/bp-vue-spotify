<template>
    <div class="row card-text">
        <div class="col-4">{{feature}}: </div>
        <div class="col">
            <div class="row">
            <div class="col-2" v-if="iconNeeded">
            <IconDiff :val="value"></IconDiff>
            </div>
            <div class="col">
            {{value}}
            </div>
            </div>
        </div>
        <!-- {{feature}}: 
        <IconDiff v-if="iconNeeded" :val="value"></IconDiff>
        {{value}} -->
    </div>
</template>

<script>
import IconDiff from "./IconDiff.vue";

export default {
    props: {
        feature: {
            type: String,
            default: "Feature"
        },
        value: {
            type: String,
            default: 0,
        }
    },
    computed: {
        iconNeeded() {
            if (this.$props.feature == "Key" || this.$props.feature == "Mode" || this.$props.feature == "Time signature") {
                return false;
            } else {
                return true;
            }
        }
    },

    methods: {
    },

    components: {
        IconDiff,
    }
}
</script>

<style>
</style>