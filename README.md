# WhatsLog
This project aims to display conversations exported through the WhatsApp "Email chat" feature.
* It will present the conversation in the form of speech bubbles similar to the original app with media files embedded.
* To autoload a conversation, place all the files (log, images, videos) inside the `autoload` folder.
    * Make sure the name of log to be loaded matches the iframe source in `index.html` (default is `log.txt`)
    * For autoloading to work, the project needs to be hosted online due to limitations of iframe's same-origin policy.
* To load a conversation without setting up the autoload or hosting, use the 'Upload' feature.
    * The selected chat and media files are parsed locally to generate the conversation.
    * When uploading, select all the files (log, images, videos) in one upload.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```
