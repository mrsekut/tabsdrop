import { useEffect, useState } from 'react';

import { saveItems } from './features/Pocket';
import { usePocketAccessToken } from './features/Pocket/usePocketAccessToken';
import { usePocketConsumerKey } from './features/Pocket/usePocketCunsumerKey';

export default function Popup() {
  const [targetTabs, setTargetTabs] = useState<TabInfo[]>([]);

  const { consumerKey } = usePocketConsumerKey();
  const { accessToken } = usePocketAccessToken();

  const handleSaveAll = async () => {
    const tabs = await selectedTabs();
    const result = await saveItems(tabs, consumerKey, accessToken);
  };

  useEffect(() => {
    (async () => {
      const tabs = await selectedTabs();
      setTargetTabs(tabs);
    })();
  }, []);

  return (
    <div
      style={{
        padding: '16px',
        width: '300px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* <h3>Pocketにタブを保存</h3>
      <pre
        style={{ whiteSpace: 'pre-wrap', marginTop: '10px', fontSize: '14px' }}
      >
        {status}
      </pre> */}
      {/* <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
        ※ 認証情報が未設定の場合はオプションページから設定してください。
      </div> */}
      {/* <hr /> */}
      {/* TODO: 仮 */}
      <button onClick={handleSaveAll}>save</button>

      <ul>
        {targetTabs.map(tab => (
          <li key={tab.id}>{tab.title}</li>
        ))}
      </ul>
    </div>
  );
}

type TabInfo = {
  id: number;
  title: string;
  url: string;
};

const selectedTabs = async (): Promise<TabInfo[]> => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    highlighted: true,
  });
  return tabs
    .filter(t => t.id != null && t.title != null && t.url != null)
    .map(t => ({ id: t.id, title: t.title, url: t.url })) as TabInfo[];
};
