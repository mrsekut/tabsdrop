import { useEffect, useMemo, useState } from 'react';

import { saveItem } from './features/Pocket';
import { usePocketAccessToken } from './features/Pocket/usePocketAccessToken';
import { usePocketConsumerKey } from './features/Pocket/usePocketCunsumerKey';

export default function Popup() {
  const { consumerKey } = usePocketConsumerKey();
  const { accessToken } = usePocketAccessToken();

  if (!consumerKey || !accessToken) {
    return <NotAuthorized />;
  }

  return <PocketTabSaver />;
}

function NotAuthorized() {
  return (
    <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
      Pocket authentication information is not set. Please configure it on the
      options page.
    </div>
  );
}

function PocketTabSaver() {
  const tabs = useTabs();
  const [hasRun, setHasRun] = useState(false);
  const [results, setResults] = useState<{ id: number; success: boolean }[]>(
    [],
  );

  const { consumerKey } = usePocketConsumerKey();
  const { accessToken } = usePocketAccessToken();

  const handleSaveAll = async () => {
    for (const tab of tabs) {
      const result = await saveItem(
        tab.title,
        tab.url,
        consumerKey,
        accessToken,
      );
      setResults(p => [...p, { id: tab.id, success: result }]);
    }
  };

  useEffect(() => {
    if (!hasRun && consumerKey && accessToken) {
      setHasRun(true);
      handleSaveAll();
    }
  }, [consumerKey, accessToken, hasRun]);

  return (
    <div
      style={{
        padding: '16px',
        width: '300px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {results.length === 0 ? (
        <h3>Saving tabs to Pocket...</h3>
      ) : (
        <h3>Saved!!</h3>
      )}

      <ul>
        {tabs.map(tab => {
          const result = results.find(r => r.id === tab.id);
          return (
            <ListItem
              key={tab.id}
              tab={tab}
              status={result ? (result.success ? 'saved' : 'error') : 'saving'}
            />
          );
        })}
      </ul>
    </div>
  );
}

const ListItem: React.FC<{
  status: 'saving' | 'saved' | 'error';
  tab: TabInfo;
}> = ({ status, tab }) => {
  const icon = useMemo(() => {
    switch (status) {
      case 'saving':
        return '⏳';
      case 'saved':
        return '✅️';
      case 'error':
        return '❌️';
    }
  }, [status]);

  return (
    <li style={{ listStyle: 'none' }}>
      {icon} {tab.title}
    </li>
  );
};

const useTabs = () => {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  useEffect(() => {
    (async () => {
      const tabs = await selectedTabs();
      setTabs(tabs);
    })();
  }, []);
  return tabs;
};

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
