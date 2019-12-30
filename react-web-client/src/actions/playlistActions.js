import { getUserPlaylistData } from '../common/apiUtils';
import { deepCamelCaseKeys } from '../common/constants';

export const getPersonalPlaylistDataAction = pageNumber => async dispatch => {
  let personalPlaylistData = {};

  dispatch(setLoadingPropertyAction(true));
  await getUserPlaylistData(pageNumber)
    .then(response => {
      personalPlaylistData = deepCamelCaseKeys(response.data);
    })
    .then(() => {
      dispatch({
        type: 'GET_USER_PLAYLIST_DATA',
        payload: { pageNumber: pageNumber, data: personalPlaylistData },
      });
    })
    .catch(error => {
      dispatch({
        type: 'GET_USER_PLAYLIST_DATA_ERROR',
        payload: { status: error.request.status, errorMessage: error.request.message },
      });
    });
  dispatch(setLoadingPropertyAction(false));
};

export const setLoadingPropertyAction = loading => {
  return {
    type: 'SET_LOADING_PROPERTY',
    payload: loading,
  };
};

export const clearPlaylistDataAction = () => dispatch => {
  dispatch({
    type: 'CLEAR_PLAYLIST_DATA',
    payload: null,
  });
};
