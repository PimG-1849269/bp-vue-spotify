import request from "./../request";
import axios from "axios";

export default {
  getCurrentUserPlaylists(limit = 2, offset) {
    return request.get("me/playlists", {
      params: {
        limit,
        offset
      }
    });
  },

  getPlaylist(user_id, playlist_id, fields) {
    return request.get(`users/${user_id}/playlists/${playlist_id}`, {
      params: {
        fields
      }
    });
  },

  getPlalistsTracks(user_id, playlist_id, offset, limit, fields) {
    return request.get(`users/${user_id}/playlists/${playlist_id}/tracks`, {
      params: {
        fields,
        limit,
        offset
      }
    });
  },

  getUserPlalists(user_id, offset, limit) {
    return request.get(`users/${user_id}/playlists`, {
      params: {
        limit,
        offset
      }
    });
  },

  createPlaylist(user_id, name, description) {
    return request.post(`users/${user_id}/playlists`, {
      name,
      description
    });
  },

  updatePlaylist(user_id, playlist_id, name, description) {
    return request.put(`users/${user_id}/playlists/${playlist_id}`, {
      name,
      description
    });
  },

  //@todo something doesn't works it return 400 O_o
  updatePlaylistCover(user_id, playlist_id, base64) {
    return request({
      method: "put",
      url: `users/${user_id}/playlists/${playlist_id}/images`,
      headers: {
        "content-type": "image/jpeg"
      },
      data: { ...base64 }
    });
  },

  async getPlaylistFeatures(track_ids) {
    var feat = await request.get("audio-features?ids=" + track_ids.toString(), {
      json: true
    });

    // Save features to json file, so shuffle can use them
    await axios.post("https://localhost:4040/saveFeatures",
      feat.data,
      { headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return feat;
  },
};
