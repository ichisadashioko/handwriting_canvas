# Handwriting Canvas



## Getting started

### Requirements:

- [nodejs](https://nodejs.org)
- [cordova](https://cordova.apache.org/) or [PhoneGap](https://phonegap.com/): `npm install -g cordova`

### Setting up and running the project

- Create a blank cordova project
```
cordova create [folder-name] [com.example.cordova] [app-name]
```
- Replace the `www` folder content with this repository
```
cd [folder-name]/www
rm -rf *
git clone https://github.com/kuroemon2509/handwriting_canvas
```
- Add your platform of choice. For example, `cordova platform add android`
    - You will need to install some addition softwares depend on your targeting platform (`android` will need `Android Studio` and an `Android SDK` version)
- Add [`cordova-screenshot`](https://github.com/gitawego/cordova-screenshot) plugin
```
cordova plugin add https://github.com/gitawego/cordova-screenshot.git
```
- *(Optional)* If you are going to build for `android`, you will need to add `<preference name="CrosswalkAnimatable" value="true" />` to `config.xml` file
- `build` or `run` it in your devices
    - Build for android platform: `cordova build android`
    - Or run on android device: `cordova run android`