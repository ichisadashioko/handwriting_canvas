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

- Replace the `www` folder content with this repository

```bash
cd [folder-name]/www
rm -rf *
git clone https://github.com/kuroemon2509/handwriting_canvas
```

- Add your platform of choice. For example, `cordova platform add android`

    - You will need to install some addition softwares depend on your targeting platform (`android` will need `Android Studio` and an `Android SDK` version)

- Add some `cordova-plugin`s

    - [`Canvas2ImagePlugin`](https://github.com/kuroemon2509/Canvas2ImagePlugin):

        ```bash
        cordova plugin add https://github.com/kuroemon2509/Canvas2ImagePlugin.git
        ```
        
    - [`cordova-plugin-android-permissions`](https://www.npmjs.com/package/cordova-plugin-android-permissions):

        ```bash
        cordova plugin add cordova-plugin-android-permissions
        ```

- `build` or `run` it in your devices

    - Build for android platform: `cordova build android`

    - Or run on android device: `cordova run android`

### Note

- On `android` device, you may need to manually go to *Setting* > *Apps* > *this-app* to enable `WRITE_EXTERNAL_STORAGE` permission for the `save` functionality to work.

- All the images will be saved at `/root/sdcard/Pictures/cordova_app/` folder on `android` devices.