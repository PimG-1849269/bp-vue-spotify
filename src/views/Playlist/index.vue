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
      <tracks-table 
        :tracks="tracks.items" 
        :contextUri="playlist.uri" 
        :order="shuffleorder"
        :allfeatures="allfeatures"
        :selectedfeatures="selectedfeatures"/>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters, mapActions } from "vuex";
  import EntityInfo from "@/components/EntityInfo";
  import TracksTable from "@/components/TracksTable";
  import axios from "axios";

  export default {
    name: "playlist-view",

    components: {
      EntityInfo,
      TracksTable
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
      })
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
    },

    created() {
      this.init();
    }
  };
</script>

<style scoped lang="sass"></style>
