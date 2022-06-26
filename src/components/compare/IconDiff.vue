<template>
    <div>
    <i v-show="positive" class="fa fa-caret-up text-success"></i>
    <i v-show="neutral" class="fa fa-minus text-secondary"></i>
    <i v-show="negative" class="fa fa-caret-down text-danger"></i>
    </div>
</template>

<script>
export default {
    props: {
        val: {
            type: String,
            default: 0,
        }
    },
    computed: {
        positive: function() {
            return this.sign(this.$props.val) == 1;
        },
        neutral: function() {
            return this.sign(this.$props.val) == 0;
        },
        negative: function() {
            return this.sign(this.$props.val) == -1;
        },
    },

    methods: {
        // Returns -1, 0 or 1 for negative, equal or positive difference respectfully
        sign(val) {
            if (val[0] == "+") {
                return 1;
            } else if (val[0] == "-") {
                return -1;
            } else {
                return 0;
            }
        },
    }
}
</script>

<style>
</style>