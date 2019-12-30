import { getUserProfileData } from '../common/apiUtils';
import { deepCamelCaseKeys } from '../common/constants';

export const getProfileDataAction = () => async dispatch => {
  let profileData = {};

  await getUserProfileData()
    .then(response => {
      profileData = response.data;
    })
    .then(() => {
      dispatch({
        type: 'GET_USER_PROFILE_DATA',
        payload: deepCamelCaseKeys(profileData),
      });
    })
    .catch(error => {
      dispatch({
        type: 'GET_USER_PROFILE_DATA_ERROR',
        payload: { status: error.request.status, errorMessage: error.request.message },
      });
    });
};
