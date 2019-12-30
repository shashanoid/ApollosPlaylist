export const setSidebarStatusAction = open => dispatch => {
  dispatch({
    type: 'SET_SIDEBAR_STATUS',
    payload: open,
  });
};

export const pageChangeAction = newPage => dispatch => {
  dispatch({
    type: 'PAGE_CHANGE',
    payload: newPage,
  });
};
