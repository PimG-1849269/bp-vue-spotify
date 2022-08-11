<template>
  <div class="playlist-view" v-scroll @vScroll="loadMore">
    <div class="playlist-view__content">
      <entity-info
        v-if="playlist"
        :coverImg="playlist.images"
        :type="playlist.type"
        :name="playlist.name"
        :description="playlist.description"
        :author="playlist.owner.display_name"
        :followers="playlist.followers.total"
        :uri="playlist.uri"
        :playlistID="playlistID"
        :ownerID="playlist.owner.id"
      />

      <div id="collapse-boards">
      <div id="shuffleboardCollapse-over">
      <div class="collapse" id="shuffleboardCollapse">
        <ShuffleBoard 
          ref="shuffleboard"
          :allsongs="allsongs"
          :allfeatures="allfeatures"
          :features="features"
          :explanations="explanations"
          :selectedfeatures="selectedfeatures"
          @selected-features="updateSelectedFeatures"
            ></ShuffleBoard>
      </div>
      </div>
      <div id="quicksortCollapse-over">
      <div class="collapse" id="quicksortCollapse">
        <QuicksortBoard
          ref="quicksortboard"
          :features="features"
          :explanations="explanations"
          :selectedfeatures="selectedfeatures"
          @selected-features="updateSelectedFeatures"></QuicksortBoard>
      </div>
      </div>
      </div>

      <tracks-table 
        :tracks="tracks.items" 
        :contextUri="playlist.uri" 
        :order="shuffleorder"
        :allfeatures="allfeatures"
        :selectedfeatures="selectedfeatures"/>
    </div>

    <!-- POPUP WITH EXPLANATIONS OF FEATURES -->
      <div class="modal fade" id="featureexplanation" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 75%" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Explanations of features</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p class="rounded myalert text-white" style="padding: 1%">In this section you can find, for every feature, both the song with the lowest and highest value of the feature in your playlist. Loading songs is required for this to work!</p>
                <FeatureExplanation 
                :allsongs="allsongs" 
                :allfeatures="allfeatures"
                :features="features"
                :explanations="explanations"
                ></FeatureExplanation>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import api from "@/api";
  import axios from "axios";
  import { mapGetters, mapActions } from "vuex";
  import EntityInfo from "@/components/EntityInfo";
  import TracksTable from "@/components/TracksTable";
  import ShuffleBoard from "@/components/shuffleboard/ShuffleBoard.vue";
  import QuicksortBoard from "@/components/shuffleboard/QuicksortBoard.vue";
  import FeatureExplanation from "@/components/paramdetails/FeatureExplanation.vue";
 

  export default {
    name: "playlist-view",

    components: {
    EntityInfo,
    TracksTable,
    ShuffleBoard,
    FeatureExplanation,
    QuicksortBoard
},

    data() {
      return {
        userID: null,
        playlistID: null,
        tracks: null,
        more: null,

        allfeatures: [],
        selectedfeatures: {},
        shuffleorder: [],

        features: [
            "danceability",
            "energy",
            "speechiness",
            "acousticness",
            "instrumentalness",
            "liveness",
            "valence",
            "key",
            "loudness",
            "mode",
            "tempo",
            "time_signature",
            "duration_ms"
        ],
        explanations: {
            "danceability": "How suitable a track is for dancing (%)",
            "energy": "How intense and active a track is (%)",
            "speechiness": "The amount of presence of spoken words in the track (%)",
            "acousticness": "Confidence measure of how acoustic a track is (%)",
            "instrumentalness": "Confidence measure of how instrumental a track is (= no vocals) (%)",
            "liveness": "Likelihood of the presece of an audience in the recording (%)",
            "valence": "Positiveness of the mood of a track (%)",
            "key": "Key the track is played in",
            "loudness": "Average number of dB the track is played in",
            "mode": "Played in Minor or Major",
            "tempo": "Average BPM of the track",
            "time_signature": "Number of beats in a bar (3/4 - 7/4)",
            "duration_ms": "Duration of track in milliseconds",
        },
      };
    },

    computed: {
      ...mapGetters("playlist", {
        playlist: "getPlaylist"
      }),

      allsongs: function() {
        var tracks = this.tracks.items.map((el) => {
          return el.track;
        });
        return tracks;
      }
    },

    mounted() {
      var $myGroup = $('#collapse-boards');
      
      $myGroup.find('#quicksortCollapse-over').on('show.bs.collapse','.collapse', function() {
          $myGroup.find('#shuffleboardCollapse.collapse').collapse('hide');
      });

      $myGroup.find('#shuffleboardCollapse-over').on('show.bs.collapse','.collapse', function() {
          $myGroup.find('#quicksortCollapse.collapse').collapse('hide');
      });
    },

    methods: {
      ...mapActions({
        notFoundPage: "app/notFoundPage",
        fetchPlaylist: "playlist/fetchPlaylist"
      }),

      initData() {
        this.tracks = {
          limit: 50,
          offset: 0,
          total: 1,
          items: []
        };
      },

      async getPlaylistTracks(userID, playlistID) {
        try {
          if (this.tracks.total > this.tracks.offset) {
            const response = await api.spotify.playlists.getPlalistsTracks(
              userID,
              playlistID,
              this.tracks.offset,
              this.tracks.limit
            );

            this.tracks.offset = response.data.offset + this.tracks.limit;
            this.tracks.total = response.data.total;
            this.tracks.items.push(...response.data.items);
            this.more = false;

            this.loadFeatures()
            this.returnOrderToNormal();
          }
        } catch (e) {
          this.notFoundPage(true);
        }
      },

      async loadMore(ev) {
        if (this.more) {
          return false;
        }

        if (ev.detail.scrollbarV.percent > 70) {
          this.more = true;
          this.getPlaylistTracks(this.userID, this.playlistID);
        }
      },

      init() {
        const { user_id, playlist_id } = this.$route.params;

        this.userID = user_id;
        this.playlistID = playlist_id;

        this.initData();
        this.getPlaylistTracks(this.userID, this.playlistID);
        this.fetchPlaylist({
          userID: this.userID,
          playlistID: this.playlistID
        });
      }, 

      async loadFeatures() {
        var tracksIds = this.tracks.items.map((el) => {
          return el.track.id;
        });
        this.allfeatures = (await api.spotify.playlists.getPlaylistFeatures(tracksIds)).data.audio_features;
      },

      returnOrderToNormal() {
        this.shuffleorder = [...Array(this.tracks.items.length).keys()];
      },

      updateSelectedFeatures(selected) {
          // Use JQUERY.extend instead of "= selected" to make copy;
          // JS works with pass by reference, so otherwise this would automatically update the list without pressing shuffle-button
          this.selectedfeatures = $.extend(true,{},selected);

          if (Object.keys(this.selectedfeatures).length > 0) {
            this.shuffle()
          } else {
            this.returnOrderToNormal();
          }
        },

      async shuffle() {
          // this.shuffleorder = await service.shuffle(this.selectedfeatures);
          console.debug("Shuffling on features:", this.selectedfeatures);
          let res = await axios.get("https://localhost:4040/shuffle", {params: this.selectedfeatures});
          console.debug("Response of shuffling:", res);
          this.shuffleorder = res.data;
        },

    },

    watch: {
      $route() {
        this.init();
      },

      'tracks.items'() {
        if (Object.keys(this.selectedfeatures).length > 0) {
          this.shuffle()
        }
      }
    },

    created() {
      this.init();
    }
  };
</script>

<style scoped lang="sass"></style>
<style>
  .modal-content {
    background-color: var(--dark) !important;
    color: white !important;
    font-weight: 600 !important;
  }
  .modal-header {
    border-color: #1db954 !important;
  }
</style>
