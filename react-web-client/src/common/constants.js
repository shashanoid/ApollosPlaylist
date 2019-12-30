import camelCaseKeys from 'camelcase-keys';

export let spotifyScopes =
  'user-top-read user-follow-modify user-follow-read user-library-read ' +
  'playlist-modify-public playlist-read-private playlist-read-collaborative ' +
  'user-read-email playlist-modify-private';

export function setCookie(cname, cvalue, expirationHours) {
  var d = new Date();
  d.setTime(d.getTime() + expirationHours * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function deepCamelCaseKeys(variable) {
  if (variable instanceof Object) {
    Object.keys(variable).forEach(key => {
      variable[key] = deepCamelCaseKeys(variable[key]);
    });

    return camelCaseKeys(variable);
  } else if (variable instanceof Array) {
    variable.forEach((object, index) => {
      variable[index] = deepCamelCaseKeys(object);
    });

    return camelCaseKeys(variable);
  } else {
    return variable;
  }
}

export function isBelowLargeBreakpoint() {
  return window.innerWidth < 1200;
}

export function isBelowMediumBreakpoint() {
  return window.innerWidth < 992;
}

export function isBelowSmallBreakpoint() {
  return window.innerWidth < 768;
}
