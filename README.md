# Play Play Productions

#### Created By Ben Ghalami and Matt Peters

This is the font end app that is built off the backend of the same name.  It allows a user to search for music artists and get a list of songs they've made.  The user can then select songs and add them to playlists.

You can use the app in production on [GitHub pages](https://bghalami.github.io/play_play_frontend/).

## Using the app

### Search for an artist

![play play fe - search artists](https://user-images.githubusercontent.com/7269813/49945351-eafa4b00-fea9-11e8-917d-e7d05f460e74.gif)

### Add songs to a playlist

![play play fe - add songs to playlist](https://user-images.githubusercontent.com/7269813/49945148-65769b00-fea9-11e8-8080-4828498a5cf0.gif)

## Contributing

If you would like to contribute, you can follow the steps in the next two sections to get running on your machine.  The API this connects to can be located at [here](https://github.com/bghalami/play_play_backend).

## Initial Setup

1. Clone the repository and rename the repository to anything you'd like in one command:

  ```shell
  git clone git@github.com:bghalami/play_play_frontend.git
  ```
2. Change into the new director directory.

3. Install the dependencies:

  ```shell
  npm install
  ```
  
There are no API keys needed.

## Running the Server Locally

To see your code in action locally, you need to fire up a development server. Use the command:

```shell
npm start
```

Once the server is running, visit in your browser:

* `http://localhost:8080/` to run your application.

## Known issues

This was built with responsiveness in mind, but from a desktop perspective.

The layout could be improved for mobile in regards to how the user interacts with elements.  CSS has hovering effects that won't work on mobile.  Also the layout could be improved on mobile.

Artist results could include their name without having to hover.

Scroll areas could be responsive to the size of the screen or page length.

## Built With

* [JavaScript](https://www.javascript.com/)
* [jQuery](https://jquery.com/)
* [Express](https://expressjs.com/)
* [Mocha](https://mochajs.org/)
* [Chai](https://chaijs.com/)

