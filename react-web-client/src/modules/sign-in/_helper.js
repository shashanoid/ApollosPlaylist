import { setCookie } from '../../common/constants';

export const handleLogOut = () => {
  // remove the cookie from the browser that holds the token to logout
  setCookie('spotifyAccessToken', '', 0);
  document.location.reload();
};
