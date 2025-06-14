# Chrome拡張機能の一般配布手順

## 1. Raindropアプリの作成と設定

### 1.1 Raindropアプリを作成
1. [Raindrop開発者設定](https://app.raindrop.io/settings/integrations/dev)にアクセス
2. 「Create new app」をクリック
3. アプリ設定:
   - **Name**: "Upo Tab Saver"（またはお好みの名前）
   - **Description**: "Chrome extension for saving tabs to Raindrop"
4. Client IDとClient Secretをメモ

### 1.2 リダイレクトURLの設定
Chrome Web Store公開前は仮のIDを使用し、公開後に更新します：

**開発段階:**
```
chrome-extension://YOUR_DEV_EXTENSION_ID/
```

**本番配布用（Chrome Web Store公開後）:**
```
chrome-extension://YOUR_PUBLISHED_EXTENSION_ID/
```

## 2. コードの更新

### 2.1 本番用のClient IDを埋め込み
`src/features/Raindrop/config.ts`を更新:

```typescript
export const RAINDROP_CONFIG = {
  CLIENT_ID: 'your_actual_production_client_id_here',
  CLIENT_SECRET: 'your_actual_production_client_secret_here',
};
```

### 2.2 開発用の環境変数は残す
`.env.local`ファイルで開発用の設定も維持:
```
PLASMO_PUBLIC_RAINDROP_CLIENT_ID=your_dev_client_id
PLASMO_PUBLIC_RAINDROP_CLIENT_SECRET=your_dev_client_secret
```

## 3. Chrome Web Store公開手順

### 3.1 拡張機能のビルド
```bash
npm run build
npm run package
```

### 3.2 Chrome Web Storeに公開
1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. 新しいアイテムをアップロード
3. 公開後、拡張機能のIDを確認

### 3.3 RaindropアプリのリダイレクトURLを更新
公開された拡張機能のIDを使って、RaindropアプリのリダイレクトURLを更新

## 4. ユーザー体験

ユーザーは以下の手順で利用開始：

1. Chrome Web Storeから拡張機能をインストール
2. 拡張機能のオプションページを開く
3. 「Raindrop.ioと連携」ボタンをクリック
4. Raindropにログイン（アカウントがない場合は作成）
5. アプリの権限を許可
6. 連携完了！

**ユーザーは自分でRaindropアプリを作成する必要はありません。**

## 5. 注意事項

- あなたがRaindropアプリの管理者として、すべてのユーザーの認証を管理します
- Client SecretはGitリポジトリにコミットされるため、public repositoryの場合は注意
- 必要に応じてClient Secretを環境変数として管理することも可能