# Apollos Playlist ::

Tired of auto-generated playlist? Apollo's playlist puts the control back in your hands. Develop customized playlists based on your mood or event.
https://apollosplaylist.com/
https://playlistninja.app/

## Screenshots:

![Screenshot](https://raw.githubusercontent.com/shashanoid/ApollosPlaylist/master/Screenshots/new.png)
![Screenshot](https://raw.githubusercontent.com/shashanoid/ApollosPlaylist/master/Screenshots/ninja.png)

# Deploy Guidelines :

## Backend

Python version: 3

To install required tools

```
cd api
pip3 install -r requirements.txt
```

To run the server

```
python3 app.py
```

**Writing Endpoints**
Any endpoint that uses a protected Spotify endpoint needs to take in a parameter `token` that
is used as the user's access token.

**Refresh Token**

`http://localhost:8000/refresh_auth?refresh_token=<REFRESH_TOKEN>`

This is to refresh user access token so we don't have to perform auth again and again.
Refresh token gets returned along with `/auth` and could be stored in user state.

```coffee
{
    header: {
        Authorization: "Bearer BQBzjesRAh8ymxYVXW_I_h64zt4KqncWTgLZJqgvkN0AgwaIBFIDdYNYwxhA-mF36i7wj95y19azz2USXGNcIFkF6IZqJ2VRIhDT3GxOQOGBDgL07VH5Rvee0l2FvmzP7zC_mcqheYrshbQxndqaqRm63xxs3-8Fmlzozf1J_mkCuO0FtQ"
    }
}
```

## Frontend

npm version: 6.5.0
node version: 11.7.0

To install required tools

```
cd react-web-client
npm install
```

To run the server

```
npm run start
```

### We are using React

We want to build an MVP of this app with a React web app first, so that we can better understand the Spotify API.

We are using a npm package called react-spotify-login to handle the login of Spotify, and it returns the user's access code.
This token is saved in our redux store and sent to our backend in order to perform requests to the Spotify API with it.

### We are using Redux for state management

App.js is our main component, and we wrap the Provider component with the initialized store around it in index.js

The store comes from `store.js`, which imports the reducers and actions from the other files within `redux/`
Actions are to be organized in the `actions/` folder, and organized by the modules they are used in.
Reducers are organized in a similar fashion in `reducers/`, and they must be added to the rootReducer for it to work.

When an action is dispatched from one of our components, the root reducer will use that action and update the store accordingly.

```coffee
// From Sidebar.jsx

import { connect } from 'react-redux'
import { getProfileDataAction } from "../../actions/profileActions";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  getUserProfileData: () => dispatch(getProfileDataAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
```

This is what connects a component to the redux cycle. Each component should have `dispatch` and `store` as props
(we need to define this in an interface).

Dispatching actions will update the state, and in turn update the props the component recieves.

### We are using Prettier for Javascript formatting

The VSCode extension could be downloaded here: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## Prod deploy guidelines:

- Clone the repo into server inside /myproject folder
- copy deploy.sh script from apollos-playlist to the outer directory
- run `./deploy.sh`

