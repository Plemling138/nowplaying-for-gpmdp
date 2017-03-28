// WebSocketクライアント：GPMDPとの通信
let WSC = require('websocket').client;
const GPMDP_CLIENT_URL = 'ws://localhost:5672/';
let socket = new WSC();

// 保持するデータ変数。
let last_updated; // 最新の取得日時
let connection_results; // 接続の成否
let nowPlayingTrack; // 現在の再生情報
let playPositions; // 現在の再生位置

// コンストラクタ
const GPMDPClient = function() {
}

// GPMDPに接続
GPMDPClient.prototype.connect = function() {
    if(socket != null) {
        socket.connect(GPMDP_CLIENT_URL)
    }
}

// 取得データのゲッター
GPMDPClient.prototype.getLastUpdated = function() {
    return last_updated;
}

GPMDPClient.prototype.getConnectionResults = function() {
    return connection_results;
}

GPMDPClient.prototype.getNowPlayingTrack = function() {
    return nowPlayingTrack;
}

GPMDPClient.prototype.getPlayPositions = function() {
    return playPositions;
}

// 接続失敗時のハンドラ
socket.on('connectFailed', function(data) {
    //console.log("[FAILED] perhaps GPMDP is not opened.");
    //console.log(data);

    last_updated = new Date();
    connection_results = data;
    nowPlayingTrack = playPositions = null;

    return;
});

// 接続中のハンドラ
socket.on('connect', function(connection) {
    let tempTrack = null;
    let tempPositions= null;

    //console.log("[SUCCESS] Connected GPMDP WebSocket API endopoint.");

    // 取得結果はセッションクローズ時に格納
    connection.on('close', function(reason, description) {
        //console.log("[CLOSED] Session was closed.");

        last_updated = new Date();
        connection_results = {status: "success"};
        nowPlayingTrack = tempTrack;
        playPositions = tempPositions;

        //console.log(last_updated);
        //console.log(connection_results);
    });

    // データ受信
    connection.on('message', function(msg) {
        let data = null;
        if(msg.type == 'utf8') {
            data = JSON.parse(msg.utf8Data);
        }
        else return;

        ////console.log(data);
        if(data.channel == "track") {
            tempTrack = data.payload;
        }
        else if(data.channel == 'time') {
            tempPositions = data.payload;
        }
    });
}) ;

// 接続終了時のハンドラ
socket.on('close', function() {
    //console.log("[CLOSED] Socket was closed.");
});

// 切断時のハンドラ
socket.on('disconnect', function(data) {
    //console.log("[DISCONNECT] Socket was disconnected to GPMDP.");
}) ;

module.exports = GPMDPClient;
