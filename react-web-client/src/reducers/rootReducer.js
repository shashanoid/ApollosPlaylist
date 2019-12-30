import { combineReducers } from 'redux';
import userReducer from './userReducer';
import playlistReducer from './playlistReducer';
import navigationReducer from './navigationReducer';

export default combineReducers({
  user: userReducer,
  playlists: playlistReducer,
  nav: navigationReducer,
});
