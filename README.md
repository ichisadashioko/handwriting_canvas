# Handwriting Canvas

## Description

- This is a `cordova` application for writing and saving handwritten characters. I used it for learning and collecting Japanese kanji data.

## Getting started

### Requirements:

- [nodejs](https://nodejs.org)
- [cordova](https://cordova.apache.org/) or [PhoneGap](https://phonegap.com/): `npm install -g cordova`

### Setting up and running the project

- Create a blank cordova project

```bash
cordova create [folder-name] [com.example.cordova] [app-name]
```

- Replace the `www` folder content with this repository `www`

- Add your platform of choice. For example, `cordova platform add android`

    - You will need to install some addition softwares depend on your targeting platform (`android` will need `Android Studio` and an `Android SDK` version)

- Add `cordova-plugin`

    - [`Canvas2ImagePlugin`](https://github.com/kuroemon2509/Canvas2ImagePlugin):

        ```bash
        cordova plugin add https://github.com/kuroemon2509/Canvas2ImagePlugin.git
        ```

### Note

- On `android` device, images will be saved at `/root/sdcard/Pictures/cordova_app/`.