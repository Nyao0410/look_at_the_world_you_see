# Look at the world you see 🌍

**Blueskyユーザーが見ている世界を覗いてみよう**

このアプリケーションは、Blueskyのユーザーハンドルを入力するだけで、そのユーザーがフォローしている人々の投稿を集約したタイムラインを表示します。つまり、**他の人が日々見ている世界を体験できる**ユニークなアプリです。

## ✨ 特徴

- 🔍 **ユーザーの視点を体験**: 任意のBlueskyユーザーのハンドルを入力して、そのユーザーがフォローしている人々のタイムラインを閲覧
- 📱 **クロスプラットフォーム対応**: iOS、Android、Webで動作するReact Native / Expoアプリ
- 🎨 **リッチコンテンツ表示**: 画像、リンクプレビュー、リポストなどをサポート
- 🔄 **無限スクロール**: タイムラインを下にスクロールすると自動的に追加の投稿を読み込み
- 👤 **ユーザー間ナビゲーション**: 投稿者のアバターをタップして、そのユーザーの視点に切り替え可能
- 📲 **プルトゥリフレッシュ**: 下に引っ張って最新の投稿を取得

## 🚀 はじめ方

### 必要要件

- Node.js (v18以上推奨)
- npm または yarn
- Expo CLI (グローバルインストール推奨)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Macha-mini/look_at_the_world_you_see.git
cd look_at_the_world_you_see

# 依存関係をインストール
npm install
```

### 実行方法

#### 開発モードで実行

```bash
# Expo開発サーバーを起動
npm start

# または特定のプラットフォームで起動
npm run ios      # iOSシミュレーター
npm run android  # Androidエミュレーター
npm run web      # Webブラウザ
```

#### Webビルド

```bash
# Webプラットフォーム向けにビルド
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## 📖 使い方

1. **アプリを起動**: ホーム画面が表示されます
2. **ハンドルを入力**: Blueskyのユーザーハンドル（例: `jay.bsky.social`）を入力
3. **「見る」をタップ**: そのユーザーがフォローしている人々の投稿が時系列で表示されます
4. **投稿を閲覧**: スクロールして投稿を閲覧。画像やリンクもクリック可能
5. **他のユーザーへ移動**: 投稿者のアバターをタップすると、そのユーザーの視点に切り替わります
6. **戻る**: 左上の矢印ボタンでホーム画面に戻れます

## 🏗️ プロジェクト構造

```
look_at_the_world_you_see/
├── app/                      # Expo Routerのルートディレクトリ
│   ├── index.tsx            # ホーム画面（ハンドル入力）
│   ├── [id].tsx             # ダイナミックルート（タイムライン表示）
│   └── _layout.tsx          # レイアウト設定
├── src/
│   └── services/
│       └── bsky.ts          # Bluesky APIとの通信ロジック
├── assets/                   # 画像アセット（アイコン、スプラッシュなど）
├── App.tsx                   # レガシーエントリーポイント
├── index.ts                  # アプリのエントリーポイント
├── app.json                  # Expoアプリ設定
├── package.json              # 依存関係とスクリプト
├── tsconfig.json             # TypeScript設定
└── vercel.json               # Vercelデプロイ設定
```

## 🛠️ 技術スタック

- **フレームワーク**: [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- **ルーティング**: [Expo Router](https://expo.github.io/router/docs/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **API**: [@atproto/api](https://github.com/bluesky-social/atproto) (Bluesky公式APIクライアント)
- **UI**: React Native標準コンポーネント + react-native-safe-area-context

## 🔧 主な機能の実装

### Bluesky APIとの統合

`src/services/bsky.ts` で以下の主要機能を実装:

- **`resolveHandle()`**: ハンドルからDID（分散識別子）を解決
- **`getFollows()`**: ユーザーのフォローリストを取得
- **`getMergedTimeline()`**: フォローしているユーザーの投稿を集約・時系列ソート
- **`getAuthorFeed()`**: 特定ユーザーの投稿を取得

### パフォーマンス最適化

- バッチ処理でAPI呼び出しを効率化（一度に5ユーザーずつ処理）
- カーソルベースのページネーションで無限スクロール実装
- 認証不要なフィードのみを取得（`!no-unauthenticated`ラベルでフィルタリング）
- 最大30人のフォローからタイムラインを生成（レート制限対策）

### リッチテキストのレンダリング

- Blueskyのfacets（リンク、メンション等）を解析してインタラクティブに表示
- UTF-8バイトオフセットを正確に処理

## 🌐 デプロイ

このプロジェクトはVercelでのデプロイに対応しています。`vercel.json`の設定により、すべてのルートが`index.html`にリダイレクトされ、SPAとして動作します。

```bash
# Vercel CLIを使用したデプロイ
vercel
```

## 📝 ライセンス

このプロジェクトのライセンスは明示されていません。使用前に作者に確認してください。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

## 📧 連絡先

プロジェクトオーナー: [@Macha-mini](https://github.com/Macha-mini)

---

**注意**: このアプリはBlueskyの公開APIを使用しており、認証なしでアクセス可能なコンテンツのみを表示します。プライベートな投稿は表示されません。
