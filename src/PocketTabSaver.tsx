import { useAtomValue, useSetAtom } from 'jotai';
import { useState, useEffect, useMemo } from 'react';
import { usePocketAccessToken } from '~features/Pocket/usePocketAccessToken';
import { usePocketConsumerKey } from '~features/Pocket/usePocketCunsumerKey';
import {
  tabIdsAtom,
  saveItemAtom,
  tabStatusAtom,
  tabAtom,
  useInitializeSelectedTabs,
  type TabId,
} from '~features/tabs';

export function PocketTabSaver() {
  useInitializeSelectedTabs();

  const tabIds = useAtomValue(tabIdsAtom);
  const saveItem = useSetAtom(saveItemAtom);
  const [hasRun, setHasRun] = useState(false);

  const { consumerKey } = usePocketConsumerKey();
  const { accessToken } = usePocketAccessToken();

  const handleSaveAll = async () => {
    Promise.all(tabIds.map(id => saveItem(id, consumerKey, accessToken)));
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
      <h3>Saving tabs to Pocket...</h3>

      <ul>
        {tabIds.map(tabId => (
          <ListItem key={tabId} tabId={tabId} />
        ))}
      </ul>
    </div>
  );
}

const ListItem: React.FC<{ tabId: TabId }> = ({ tabId }) => {
  const tab = useAtomValue(tabAtom(tabId));
  const status = useAtomValue(tabStatusAtom(tabId));

  const icon = useMemo(() => {
    switch (status) {
      case 'saving':
        return '⏳';
      case 'saved':
        return '✅️';
      case 'error':
        return '❌️';
      case null:
        return '';
    }
  }, [status]);

  if (tab == null) return null;

  return (
    <li style={{ listStyle: 'none' }}>
      {icon} {tab.title}
    </li>
  );
};
