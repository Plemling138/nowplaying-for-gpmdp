'use strict'

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let window;
let windowWidth, windowHeight;
let GPMClient;

exports.expandWindowSize = function() {
    if(window != null) {
        window.setSize(windowWidth, windowHeight + 30);
    }
};

exports.resetWindowSize = function() {
    if(window != null) {
        window.setSize(windowWidth, windowHeight);
    }
};

exports.exitApp = function() {
    if(window != null) {
        window.close();
    }
}

// ウインドウの表示
function createWindow() {
    // モニタ解像度を取得
    //const screen = electron.screen;
    const screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
    const screenWidth = screenSize.width;
    const screenHeight = screenSize.height;

    // ウインドウ初期位置とサイズを決定
    windowWidth = 300;
    windowHeight = 120;
    const windowPositionX = screenWidth - windowWidth - 5;
    const windowPositionY = (process.platform == 'windows') ? screenHeight - windowHeight - 5 : 5;

    // ウインドウを開く
    window = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: windowPositionX,
        y: windowPositionY,
        alwaysOnTop: true,
        //resizable: false,
        hasShadow: false,
        frame: false
    });

    window.loadURL(`file://${__dirname}/mainContents.html`);
    // window.webContents.openDevTools();

    window.on('closed', function() {
        window = null;
    });
}

// アプリケーションのハンドラ
app.on('ready', createWindow);
app.on('window-all-closed', function() {
  // if(process.platform != 'darwin') {
  //   app.quit();
  // }

  // アプリはプラットフォーム問わず終了する
  app.quit();
});

app.on('activate', function() {
  if(window == null) {
    createWindow();
  }
});
