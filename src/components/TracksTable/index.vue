<template>
  <div v-if="!!tracks.length" class="tracks-table">
    <div class="tracks-table__row tracks-table__row--header">
      <div class="tracks-table__cell tracks-table__cell--playback"></div>
      <div class="tracks-table__cell tracks-table__cell--addition"></div>

      <div class="tracks-table__cell tracks-table__cell--name">
        Title
      </div>

      <div class="tracks-table__cell tracks-table__cell--artist">
        Artist
      </div>

      <div class="tracks-table__cell tracks-table__cell--album">
        Album
      </div>

      <div class="tracks-table__cell tracks-table__cell--added-at">
        <icon name="calendar-alt" />
      </div>

      <div class="tracks-table__cell tracks-table__cell--duration">
        <icon name="clock" />
      </div>
    </div>

    <div
      class="row_with_features"
      v-for="(index, indexinorder) in order"
      :key="indexinorder"
      @click="visible[index] = !visible[index]; hover[index] = false; $forceUpdate();"
      v-on:mouseover="showFeatureHover(index)"
      @mouseleave="hover[index] = false; $forceUpdate();">

      <div
        class="tracks-table__row"
        :class="isActiveTrack(tracks[index].track)"
        :data-id="tracks[index].track.id"
      >
        <div class="tracks-table__cell tracks-table__cell--playback">
          <track-playback
            :trackUri="tracks[index].track.uri"
            :tracksUris="tracksUris"
            :contextUri="contextUri"
            :offset="index"
          />
        </div>

        <div class="tracks-table__cell tracks-table__cell--addition">
          <track-addition
            :trackID="tracks[index].track.id"
            :isSaved="savedTracks[index]"
            v-on:updateTrackstatus="onTrackUpdate"
            v-on:savedTrackRemove="onSavedTrackRemove"
          />
        </div>

        <div class="tracks-table__cell">
          {{ tracks[index].track.name }}
          <span v-if="tracks[index].track.explicit" class="tracks-table__explicit-label">
            Explicit
          </span>
        </div>

        <div class="tracks-table__cell">
          <div>
            <router-link
              class="tracks-table__link"
              v-for="(artist, index) in tracks[index].track.artists"
              :key="index"
              :to="{ name: 'artist', params: { id: artist.id } }"
            >
              {{ artist.name }}
              <template v-if="index !== tracks[index].track.artists.length - 1">
                ,&nbsp;
              </template>
            </router-link>
          </div>
        </div>

        <div class="tracks-table__cell">
          <router-link
            class="tracks-table__link"
            :to="{ name: 'album', params: { id: tracks[index].track.album.id } }"
          >
            {{ tracks[index].track.album.name }}
          </router-link>
        </div>

        <div class="tracks-table__cell tracks-table__cell--added-at">
          {{ tracks[index].added_at | moment("MM-DD-YYYY") }}
        </div>

        <div class="tracks-table__cell tracks-table__cell--duration">
          {{ tracks[index].track.duration_ms | msToMinutes }}
        </div>

        <featureHover 
          v-show="hover[index]" 
          :id="'featurehover'+index"
          :featurestoshow="selectedfeatures"
          :features="allfeatures[index]" 
          :previous="allfeatures[order[indexinorder-1]]" 
          ></featureHover>

      </div>

      <SongDetails 
        v-show="visible[index]" 
        :features="allfeatures[index]" 
        :first="getFeatOfFirst(index)"
        :previous="allfeatures[order[indexinorder-1]]" 
        :next="allfeatures[order[indexinorder+1]]"
        :selectedfeatures="selectedfeatures"
        ></SongDetails>

    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters } from "vuex";
  import TrackAddition from "@/components/TrackAddition";
  import TrackPlayback from "@/components/TrackPlayback";
  import SongDetails from "@/components/compare/SongDetails.vue";
  import FeatureHover from "@/components/tracklist/FeatureHover.vue";

  export default {
    name: "tracks-table",

    components: {
      TrackAddition,
      TrackPlayback,
      SongDetails,
      FeatureHover
    },

    props: {
      tracks: {
        required: true,
        default: []
      },
      type: {
        type: String,
        required: false
      },
      contextUri: {
        required: false
      },
      order: {
          type: Array
      },
      allfeatures: {
          type: Array,
      },
      selectedfeatures: {
          type: Object,
          default: {},
      }
    },

    data() {
      return {
        tracksUris: "",
        tracksIds: "",
        savedTracks: [],

        visible: [],
        hover: [],
      };
    },

    computed: {
      ...mapGetters({
        user: "user/getProfile",
        playback: "player/getPlayback",
        context: "player/getPlaybackContext"
      })
    },

    methods: {
      sortBy(sortKey, event) {
        //@todo Add columns sorting
      },

      fetchTrackUris() {
        this.tracksUris = this.tracks.map((el) => {
          return el.track.uri;
        });
      },

      fetchTrackIds() {
        this.tracksIds = this.tracks.map((el) => {
          return el.track.id;
        });
      },

      async checkSavedTracks() {
        try {
          const saved = {
            offset: 0,
            limit: 50,
            total: this.tracks.length || 0,
            items: []
          };

          while (saved.total > saved.offset) {
            const response = await api.spotify.library.checkUserSavedTracks(
              this.tracksIds
                .slice(saved.offset, saved.offset + saved.limit)
                .toString()
            );
            saved.offset = saved.offset + saved.limit;
            saved.items.push(...response.data);
          }

          this.savedTracks = saved.items;
        } catch (e) {
          console.log(e);
        }
      },

      isActiveTrack(current) {
        const isActiveTrack =
          this.playback.item && this.playback.item.id === current.id;

        return {
          "tracks-table__row--active": isActiveTrack,
          "tracks-table__row--paused":
            isActiveTrack && this.context && this.context.paused
        };
      },

      onTrackUpdate() {
        this.checkSavedTracks();
      },

      onSavedTrackRemove(id) {
        if (this.type === "library") {
          document.querySelectorAll(`[data-id='${id}']`)[0].remove();
        }
        //@todo remove song from playback context
      },

      getFeatOfFirst(index) {
          if (index != 0) {
              return this.$props.allfeatures[this.order[0]];
          } else {
              return undefined;
          }
      },

      resizeDataArrays() {
        this.visible = [];
        this.hover = [];
        for (let i = 0; i < this.$props.tracks.length; i++) {
            this.visible[i] = false;
            this.hover[i] = false;
        }
      },

      showFeatureHover(index) {
        if (Object.keys(this.$props.selectedfeatures).length > 0 && this.visible[index] == false) { 
            this.hover[index] = true; 
            // Get element by id instead of refs, because function onmousemove does not know this.$refs
            var feathov = document.getElementById('featurehover'+index);

            window.onmousemove = function (e) {
                var x = e.clientX,
                    y = e.clientY;
                feathov.style.top = (y + 20) + 'px';
                feathov.style.left = (x + 20) + 'px';
            };
            this.$forceUpdate();
        }
      },
    },

    watch: {
      tracks() {
        this.fetchTrackUris();
        this.fetchTrackIds();
        this.checkSavedTracks();
        this.resizeDataArrays();
      }
    }
  };
</script>

<style lang="sass">

  .tracks-table
    display: flex
    flex-flow: column
    padding: 0 15px 20px

    &__link
      color: $c-white

      &:hover
        text-decoration: underline

    &__row
      position: relative
      display: flex
      min-height: 40px
      padding: 5px
      color: $c-white
      font-size: 13px
      line-height: 15px
      border-bottom: 1px solid $c-mine-shaft

      &:hover
        &:not(:first-of-type)
          background: $c-mine-shaft
          color: $c-white

        .tracks-table__explicit-label
          color: $c-white
          border-color: $c-white

        .track-addition__button
          color: $c-white

        .track-playback
          display: block

      &--header
        color: $c-gray
        text-transform: uppercase

      &--active
        background: $c-mine-shaft
        color: $c-green

        .tracks-table__link
          color: $c-green

        .track-playback
          display: block !important

    &__cell
      display: flex
      flex: 1
      align-items: center
      position: relative
      margin-right: 10px

      &--playback
        max-width: 40px

      &--addition
        max-width: 40px

      &--added-at
        max-width: 100px

      &--duration
        max-width: 60px

    &__explicit-label
      float: right
      margin-left: 5px
      padding: 3px
      border: 1px solid $c-gray
      border-radius: 3px
      color: $c-gray
      font-size: 9px
      line-height: 1
      letter-spacing: 1.5px
      text-transform: uppercase

    .track-playback
      display: none

    .row_with_features:hover
      cursor: pointer

</style>
