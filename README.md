# WhatsLog
This project is for displaying conversations exported through the WhatsApp "Email chat" feature.
* It will embed all the provided media and present the conversation in the form of speech bubbles similar to the original app.
* To autoload a conversation, place all the files (log, images, videos) inside the `autoload` folder.
    * Make sure the name of log to be loaded matches the iframe source in `index.html` (default is `log.txt`)
    * For autoloading to work, the project needs to be hosted online due to limitations of iframe's same-origin policy.
* To load a conversation without setting up the autoload or hosting, use the 'upload' feature which will parse the selected chat and media files locally and generate the conversation.
    * When uploading, select all the files (log, images, videos) in one upload.
