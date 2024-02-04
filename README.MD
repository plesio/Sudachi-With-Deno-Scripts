# Sudachi with Deno Scripts

Deno から Java を経由して Sudachi を利用し、頻出単語をカウントするサンプルスクリプト。

## システム要件

- 事前インストール必須
  - Deno
    - 最新が良い
  - Java
    - Sudachi が動作するバージョンであればよい。私は OpenJDK 11 を利用して確認した。
- 別途ダウンロードが必要なもの
  - Sudachi 本体
    - https://github.com/WorksApplications/Sudachi
  - Sudachi 辞書データ
    - http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/

### 確認環境

- Mac
  - macOS Monterey 
  - Deno 1.40.2
  - OpenJDK "11.0.14.1" 2022-02-08
- Windows
  - Windows 10 Home
  - Deno 1.40.2
  - OpenJDK 1.8.0_171-b11

## 使い方

### Sudachi の配置

DLした Sudachi を配置する。

```sh
% tree
.
├── input.txt
├── run.bat
├── run.sh
├── sudachi-0
│   ├── LICENSE-2.0.txt
│   ├── README.md
│   ├── javax.json-1.1.4.jar
│   ├── jdartsclone-1.2.0.jar
│   ├── licenses
│   │   └── javax.json-1.1.txt
│   ├── sudachi-0.7.3.jar
│   ├── sudachi.json
│   └── system_core.dic
├── sudachi-dictionary-20240109
│   ├── LEGAL
│   ├── LICENSE-2.0.txt
│   └── system_core.dic
└── sudachi-self
    ├── deno_segment.ts
    ├── user.dic
    └── user_dic.csv
```

### スクリプトの修正

- sudachi-self/deno_segment.ts
  - 配置したディレクトリやファイルの状態に応じて、ファイル冒頭にいっぱい書いてある定数を書き換える。

- sudachi-self/user_dic.csv
  - Sudachi で利用するユーザ辞書を記述する。
  - 個別に追加したい単語があれば、ここに追記する。
  - ビルドはスクリプトの中で行うので、ここに追記するだけで良い。

### input.txt の準備

Sudachi で解析したいテキストを input.txt に用意する。

サンプルでおいてあるのは、明くる日のGoogle検索のテキストデータ。

### 実行

Win/Mac でそれぞれ以下のコマンドを実行する。


```sh
./run.sh
```

```bat
.\run.bat
```

もしかしたらWinは動かない？かも。要検証

## その他

結果はコンソールではなく、テキストファイルとして出力される。
あまり複雑なコードでもないので、ちょい修正でいろいろつかえるはず。