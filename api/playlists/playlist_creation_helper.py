import random


def aggregate_top_artists(sp):
    top_artists = sp.current_user_top_artists(limit=50, offset=0, time_range='short_term')
    top_artists_uri = []

    for artist in top_artists['items']:
        top_artists_uri.append(artist['uri'])

    return top_artists_uri


def aggregate_top_tracks(sp, top_artists_uri):
    top_tracks_uri = []
    for artist in top_artists_uri:
        top_tracks_data = sp.artist_top_tracks(artist)['tracks']
        for track_data in top_tracks_data:
            top_tracks_uri.append(track_data['uri'])

    random.shuffle(top_artists_uri)

    return top_tracks_uri[:50]


def _check_attribute(attribute, attribute_name, track_data):
    return (attribute - 0.5) <= track_data[attribute_name] <= (attribute + 0.5)


def check_energy(energy, track):
    return _check_attribute(energy, "energy", track)


def check_danceability(danceability, track):
    return _check_attribute(danceability, "danceability", track)


def check_acousticness(acousticness, track):
    return _check_attribute(acousticness, "acousticness", track)


def check_tempo(tempo, track_data):
    low, high = tempo
    return low <= track_data["tempo"] <= high


def meets_track_attributes(track, energy, danceability, acousticness, tempo):
    return (check_energy(energy, track) and check_danceability(danceability, track) and
            check_tempo(tempo, track) and check_acousticness(acousticness, track))


def select_tracks(sp, top_tracks_uri, energy, danceability, acousticness, tempo):
    selected_tracks_uri = []
    tracks_data = sp.audio_features(top_tracks_uri)
    for track_data in tracks_data:
        try:
            if meets_track_attributes(track_data, energy, danceability, acousticness, tempo):
                selected_tracks_uri.append(track_data["uri"])
        except TypeError as te:
            continue

    return selected_tracks_uri

    # def group(seq, size):
    #     return (seq[pos:pos + size] for pos in range(0, len(seq), size))

    # for tracks in list(group(top_tracks_uri, 50)):
    #     tracks_all_data = sp.audio_features(tracks)
    #     for track_data in tracks_all_data:
    #         try:
    #             if meets_track_attributes(track_data, energy, danceability, acousticness, tempo):
    #                 selected_tracks_uri.append(track_data["uri"])
    #         except TypeError as te:
    #             continue
