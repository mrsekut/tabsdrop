import { useAtomValue } from 'jotai';
import { useState, useEffect, useMemo } from 'react';
import { saveItem } from '~features/Pocket';
import { usePocketAccessToken } from '~features/Pocket/usePocketAccessToken';
import { usePocketConsumerKey } from '~features/Pocket/usePocketCunsumerKey';
import { selectedTabsAtom, type Tab } from '~features/tabs';

export function PocketTabSaver() {
  const tabs = useAtomValue(selectedTabsAtom);
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
  tab: Tab;
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
