import { useState, useEffect } from 'react';
import { usePocketConsumerKey } from '~features/Pocket/usePocketCunsumerKey';
import { usePocketAccessToken } from '~features/Pocket/usePocketAccessToken';

export default function Options() {
  const { consumerKey, setConsumerKey } = usePocketConsumerKey();
  const { accessToken, setAccessToken } = usePocketAccessToken();
  const autoSaveStatus = useDebouncedAutoSaveStatus([consumerKey, accessToken]);

  return (
    <div
      style={{
        padding: '16px',
        width: '300px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h3>Pocket認証情報の設定</h3>

      <div style={{ marginBottom: '10px' }}>
        <Field
          label="Consumer Key"
          value={consumerKey}
          onChange={setConsumerKey}
        />
        <Field
          label="Access Token"
          value={accessToken}
          onChange={setAccessToken}
        />
      </div>

      {autoSaveStatus && (
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#007700' }}>
          {autoSaveStatus}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
        Pocketの認証情報は&nbsp;
        <a
          href="https://getpocket.com/developer/"
          target="_blank"
          rel="noopener noreferrer"
        >
          こちら
        </a>
        &nbsp;から取得してください。
      </div>
    </div>
  );
}

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({ label, value, onChange }: Props) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <label
        style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '4px' }}
      />
    </div>
  );
}

function useDebouncedAutoSaveStatus(
  deps: any[],
  debounceDelay = 200, // 入力が止まってからの待ち時間（例: 1秒）
  displayDuration = 1000, // 表示期間（例: 1秒）
  message = '保存しました。',
) {
  const [status, setStatus] = useState('');
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }
    let clearTimer: ReturnType<typeof setTimeout>;
    const debounceTimer = setTimeout(() => {
      setStatus(message);
      clearTimer = setTimeout(() => {
        setStatus('');
      }, displayDuration);
    }, debounceDelay);

    return () => {
      clearTimeout(debounceTimer);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, deps);

  return status;
}
