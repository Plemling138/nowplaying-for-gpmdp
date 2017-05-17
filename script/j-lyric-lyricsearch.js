'use strict'

const scraper = require('cheerio-httpcli');

// J-lyricのURL
const j_lyric_url = 'http://search.j-lyric.net/index.php?';

// 検索オーダー
// 0: 前方一致、1:完全一致、2:中間一致、3:後方一致
const searchOrder = {MATCH_FORWARD : 0, MATCH_PERFECT : 1, MATCH_PARTIAL : 2, MATCH_BACKWARD : 3};

// コンストラクタ
const JLyricSearch = function() {
}

// タイトルとアーティスト名から有力な歌詞を取得して返す
// 下記の2つの関数を組み合わせたもの
// in) songTitle: 曲名  songArtist: アーティスト名
// return) 歌詞テキスト
JLyricSearch.prototype.getLyricFromSongTitle = function(songTitle, songArtist, callback) {
    let lyric_info = null;
    JLyricSearch.prototype.searchLyricURLs(songTitle, songArtist)
    .then(function(data) {
        console.log(data[0]);
        lyric_info = data[0];

        // 検索できなければnullを返して終了（この書き方じゃないよな）
        if(lyric_info == null) {
            callback(null);
            return null;
        }
    }).then(function() {
        let lyric_body = null;
        JLyricSearch.prototype.getLyricFromURL(lyric_info.url)
        .then(function(data) {
            // console.log(data);
            if(callback != null) {
                callback(data);
            }
            return data;
        });
    });
}

// J-lyric.netの検索から曲名とアーティスト名を用いて歌詞URLリストを取得
// in) songTitle: 曲名  songArtist: アーティスト名
// return) 曲名・アーティスト名・歌詞URLのリスト
JLyricSearch.prototype.searchLyricURLs = function (songTitle, songArtist) {
    return new Promise(function (resolve, reject) {
        // j-lyric検索クエリ
        const searchQuery = {
            p : 1, // これをインクリメントすれば複数ページのリストが取れるんだけどな…
            kt : songTitle,
            ct : searchOrder.MATCH_FORWARD,
            ka : songArtist,
            ca : searchOrder.MATCH_FORWARD,
            kl : '',
            cl : searchOrder.MATCH_FORWARD
        }

        // 曲名、歌手名とURLのリスト
        let songInfoAndURL = [];

        // 検索画面をスクレイピングして曲名とURLのリストを作成
        scraper.fetch(j_lyric_url, searchQuery, function(error, $, response) {
            if(error) {
                console.log("[ERROR from search lyrics] " + JSON.stringify(error));
                reject(error);
            }

            // 曲名、歌手名とURLのリストを作成
            $('div[id=bas] > div[id=cnt] > div[id=mnb] > div[class=bdy]').each(function(index, element) {
                songInfoAndURL.push({
                    title : $(this).children('.mid').children('a').text(),
                    artist : $(this).children('.sml').children('a').text(),
                    url : $(this).children('.mid').children('a').attr('href')
                });
            });

            // リストを返す
            resolve(songInfoAndURL);
        });
    });
}

// 歌詞本体の取得
// in) TargetURL: j-Lyric.netの歌詞URL
// return) 歌詞のテキストデータ
JLyricSearch.prototype.getLyricFromURL = function(TargetURL) {
    return new Promise(function(resolve, reject) {
        // 指定URLから直接歌詞を取得
        scraper.fetch(TargetURL, null, function(error, $, response) {
            // エラーハンドリング
            if(error) {
                console.log("[ERROR from getting lyrics] " + JSON.stringify(error));
                reject(error);
            }

            // p要素から歌詞の本文を取得
            const songLyricBody = $('p[id=Lyric]').html();
            resolve(songLyricBody);
        });
    });
}

module.exports = JLyricSearch;
