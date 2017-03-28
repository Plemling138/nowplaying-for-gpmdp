# #nowplaying for Google Play Music Desktop Player(GPMDP)

## Demo
[![Demo movie](https://img.youtube.com/vi/k2vPMy18ceo/0.jpg)](https://www.youtube.com/watch?v=k2vPMy18ceo)

[Click to see video on YouTube](https://www.youtube.com/watch?v=k2vPMy18ceo)

## Notice
このアプリケーションはGPMDPとのAPI連携のためのプロトタイプ実装です。     
あと、開発者の勉強用アプリでもあるので、アプリ名の割にはコンセプトに一貫性がありません。    

また、このコードには外部サイトをスクレイピングする機能が実装されています。   
利用規約には抵触していないと考えますが、諸機関からの要請等によりソースコードや機能自体が消滅すること、または仕様変更等により使えなくなることが想定されます。ご注意下さい。

## Features
### Core concept
- シェア機能の貧弱なGoogle Play Music利用者でも#nowplaying情報を共有できるようになります
- Google Play Music Desktop Player(GPMDP)で再生中の楽曲の情報を取得してツイート
    - GPMDPのWebSocketによるPlayback APIを使用しています
- 本家へのMergeを想定したElectronによる実装

### Miscellaneous
- Mini Player（っぽい）外観
- 再生中の楽曲情報に基いてJ-Lyric.netから歌詞を取得・表示できます

## Requirements
- GPMDPを起動している必要があります
- Desktop Settings（デスクトップ設定）の「Enable Playback API（Playback APIを有効にする）」にチェックを入れてください

## Issues / Wishes
- ツイートテキストの自由度の向上（config画面）
- アルバムアート等のツイート
- 曲名に不必要な情報（Album Mix）などが含まれると検索できない問題への対処
- どうせならMini Playerにしたい
