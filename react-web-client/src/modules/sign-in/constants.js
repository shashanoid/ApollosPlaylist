let isProd = window.location.hostname === 'apollosplaylist.com';

export let redirectURI = isProd ? 'https://apollosplaylist.com' : 'http://localhost:3000';
export let clientID = '471acbe6875243599cf1933dd8df64aa';
