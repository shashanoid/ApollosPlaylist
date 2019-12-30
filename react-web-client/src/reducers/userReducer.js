export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_PROFILE_DATA':
      return action.payload;
    case 'GET_USER_PROFILE_DATA_ERROR':
      return action.payload;
    default:
      return state;
  }
};
