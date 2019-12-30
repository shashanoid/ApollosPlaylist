export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR_STATUS':
      return {
        ...state,
        sidebar: {
          open: action.payload,
        },
      };
    case 'PAGE_CHANGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};
