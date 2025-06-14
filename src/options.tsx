import { useState } from 'react';
import { useRaindropAuth } from '~features/Raindrop/useRaindropAccessToken';
import { authenticateWithRaindrop, logout } from '~features/Raindrop/auth';
import { RAINDROP_CONFIG } from '~features/Raindrop/config';

const { CLIENT_ID } = RAINDROP_CONFIG;

export default function Options() {
  const { isAuthenticated, loading, refresh } = useRaindropAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleConnect = async () => {
    setAuthLoading(true);
    setAuthError('');

    const success = await authenticateWithRaindrop();

    if (success) {
      await refresh();
    } else {
      setAuthError('認証に失敗しました。もう一度お試しください。');
    }

    setAuthLoading(false);
  };

  const handleDisconnect = async () => {
    await logout();
    await refresh();
  };

  if (loading) {
    return (
      <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px',
        width: '400px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Raindrop.io 連携設定</h2>

      {isAuthenticated ? (
        <div>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          >
            <p style={{ margin: 0, color: '#2e7d32' }}>
              ✓ Raindrop.ioと連携済み
            </p>
          </div>

          <button
            onClick={handleDisconnect}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            連携を解除
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '16px', color: '#555' }}>
            Raindrop.ioと連携すると、開いているタブを簡単に保存できます。
          </p>

          <button
            onClick={handleConnect}
            disabled={authLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: authLoading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: authLoading ? 'default' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {authLoading ? '連携中...' : 'Raindrop.ioと連携'}
          </button>

          {authError && (
            <p style={{ color: '#f44336', marginTop: '12px' }}>{authError}</p>
          )}

          {CLIENT_ID === 'YOUR_CLIENT_ID' && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#fff3cd',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              <strong>初回設定が必要です:</strong>
              <ol
                style={{
                  marginTop: '8px',
                  marginBottom: 0,
                  paddingLeft: '20px',
                }}
              >
                <li>.env.localファイルを作成</li>
                <li>RaindropのClient IDとSecretを設定</li>
                <li>npm run devで再起動</li>
              </ol>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '24px', fontSize: '12px', color: '#777' }}>
        <p>注意事項:</p>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>この拡張機能はRaindrop.ioの公式アプリではありません</li>
          <li>連携を解除すると、保存済みのアイテムは削除されません</li>
        </ul>
      </div>
    </div>
  );
}
