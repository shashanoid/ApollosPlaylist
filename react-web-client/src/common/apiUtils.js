import { getCookie } from './constants';
import axios from 'axios';

let isProd = window.location.hostname === 'apollosplaylist.com';
export let api = isProd ? 'https://apollosplaylist.com' : 'http://localhost:8000';

export function getUserProfileData() {
  return axios.get(`${api}/users/user`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
    },
  });
}

export function getUserPlaylistData(pageNumber = 0) {
  return axios.get(`${api}/playlists/personal-playlists`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
      limit: 12,
      offset: pageNumber * 12,
    },
  });
}

export function getUserEditablePlaylists() {
  return axios.get(`${api}/users/editable-playlists`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
    },
  });
}

export function getDetailedPlaylistData(playlistSpotifyId, userSpotifyId) {
  return axios.get(`${api}/playlists/playlist`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
      userSpotifyId,
      playlistSpotifyId,
    },
    contentType: 'application/json',
  });
}

export function getPlaylistStatistics(playlistSpotifyId, userSpotifyId) {
  return axios.get(`${api}/playlists/playlist-stats`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
      userSpotifyId,
      playlistSpotifyId,
    },
  });
}

export function getTrackData(trackId) {
  return axios.get(`${api}/tracks/track`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
      track_id: trackId,
    },
  });
}

export function addTracksToPlaylist(userSpotifyId, playlistSpotifyId, trackIds) {
  return axios.post(`${api}/playlists/add-tracks`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    data: JSON.stringify({
      token: getCookie('spotifyAccessToken'),
      playlistSpotifyId,
      userSpotifyId,
      trackIds,
    }),
  });
}

export function userPlaylistUnfollow(userSpotifyId, playlistSpotifyId) {
  return axios.delete(`${api}/playlists/unfollow-playlist`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    data: JSON.stringify({
      token: getCookie('spotifyAccessToken'),
      playlistSpotifyId,
      userSpotifyId,
    }),
  });
}

export function userPlaylistFollowPlaylist(userSpotifyId, playlistSpotifyId) {
  return axios.get(`${api}/playlists/follow-playlist`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
      userSpotifyId,
      playlistSpotifyId,
    },
  });
}

export function getUserTopTracks() {
  return axios.get(`${api}/users/top_tracks`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
    },
  });
}

export function getTracksFromAttributes(state) {
  let { energy, danceability, acousticness, tempo } = state;
  return axios.get(`${api}/playlists/get-tracks-from-attributes`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    params: {
      token: getCookie('spotifyAccessToken'),
      energy,
      danceability,
      acousticness,
      tempoLow: tempo[0],
      tempoHigh: tempo[1],
    },
  });
}

export function createUserPlaylistWithTracks(userSpotifyId, playlistName, tracks) {
  return axios.post(`${api}/playlists/create-playlist-with-tracks`, {
    headers: {
      'Content-Type': 'application/json',
    },
    crossDomain: true,
    data: JSON.stringify({
      token: getCookie('spotifyAccessToken'),
      userSpotifyId,
      playlistName,
      tracks,
    }),
  });
}
