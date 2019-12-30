export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_PLAYLIST_DATA':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.pageNumber]: action.payload.data.playlists,
        },
        total: action.payload.data.total,
      };

    case 'GET_USER_PLAYLIST_DATA_ERROR':
      return action.payload;

    case 'CLEAR_PLAYLIST_DATA':
      return {
        ...state,
        items: {
          0: [],
        },
      };

    case 'SET_LOADING_PROPERTY':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};
