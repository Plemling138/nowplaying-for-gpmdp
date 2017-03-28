'use strict'

const Config = require('electron-config');
const config = new Config();

// Twitter API操作用パラメータ
const twitterAPI = require('node-twitter-api');
let twitter = null;

// 得られたアクセストークン
let twitterAccessToken;
let twitterAccessTokenSecret;

// コンストラクタ
const ShareTwitter = function() {
    config.set('share.twitter.consumer_key', 'w65587irJFmqnlv78gNKpwQhV');
    config.set('share.twitter.consumer_secret', 'yHovRSO46DHx3ipbhYCYVBvOH9lpfNVqiV737ZNdbIxDQ0fm3H');
    config.set('share.twitter.callback_url', 'https://dev.hsy.me/');
}

// アクセストークンが存在するかどうかをチェック
ShareTwitter.prototype.checkAccessToken = function() {
    // 設定ファイルからコンシューマキーを取得
    twitter = new twitterAPI({
        consumerKey: config.get('share.twitter.consumer_key'),
        consumerSecret: config.get('share.twitter.consumer_secret'),
        callback: config.get('share.twitter.callback_url')
    });

    // 設定ファイルにアクセストークンが存在する場合
    if(config.get('share.twitter.hasAccessTokens')) {
        // 設定ファイルからトークンを読み出して終了
        twitterAccessToken = config.get('share.twitter.access_token');
        twitterAccessTokenSecret = config.get('share.twitter.access_token_secret');

        return true;
    }
    // 存在しなければfalseを返す
    else {
        return false;
    }
}

// アクセストークンの取得
ShareTwitter.prototype.getAccessToken = function() {
    // ログイン用ウインドウを作成
    const BrowserWindow = require('electron').BrowserWindow;
    let loginWindow = new  BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { webSecurity: false }
    });

    // リクエストトークンの取得
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        // ログイン用ウインドウがコールバックURLに遷移するときのハンドラ
        loginWindow.webContents.on('will-navigate', function(event, url) {
            // 遷移を止める
            event.preventDefault();

            //コールバックURLをパース
            let parsedCallbackURL = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/);
            if(parsedCallbackURL == null) {
                console.log("Failed to parse callback url.");
                return false;
            }

            // パース結果からOAuthトークンと認証キーを取得
            let oauth_token = parsedCallbackURL[1];
            let oauth_verifier = parsedCallbackURL[2];

            // アクセストークンを取得
            twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
                // 大域変数に保存
                twitterAccessToken = accessToken;
                twitterAccessTokenSecret = accessTokenSecret;

                // 設定ファイルに書き出し
                config.set('share.twitter.hasAccessTokens', true);
                config.set('share.twitter.access_token', accessToken);
                config.set('share.twitter.access_token_secret', accessTokenSecret);

                // ウインドウを閉じて終了
                loginWindow.close();
                return true;
            });

        });

        // 取得されたリクエストトークンから認証用URLを生成
        const authURL = twitter.getAuthUrl(requestToken);

        // ログインウィンドウにアクセストークン取得URLを表示
        loginWindow.loadURL(authURL);
    });
}

// ツイートする
ShareTwitter.prototype.tweetPlainText = function(tweetBody, callback) {
    // アクセストークンが存在するかどうかを確認
    if(twitter == null || twitterAccessToken == null || twitterAccessTokenSecret == null) {
        alert("Please authenticate twitter firstly.");
        return false;
    }

    twitter.statuses("update", {
        status: tweetBody
    }, twitterAccessToken, twitterAccessTokenSecret, function(error, data, response) {
        callback(error, data, response);
    });
}

module.exports = ShareTwitter;
