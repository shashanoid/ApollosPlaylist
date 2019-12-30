import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { isBelowMediumBreakpoint } from './common/constants';

let store = createStore(
  rootReducer,
  {
    playlists: {
      total: 0,
      loading: true,
      items: {
        0: [],
      },
    },
    nav: {
      sidebar: {
        open: isBelowMediumBreakpoint() ? false : true,
      },
      currentPage: '',
    },
  },
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;

