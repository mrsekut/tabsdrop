import { useAtomValue, useSetAtom } from 'jotai';
import { useState, useEffect, useMemo } from 'react';
import { isAuthenticated } from '~features/Raindrop/auth';
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
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  const handleSaveAll = async () => {
    Promise.all(tabIds.map(id => saveItem(id)));
  };

  useEffect(() => {
    if (!hasRun && authChecked && isAuth) {
      setHasRun(true);
      handleSaveAll();
    }
  }, [isAuth, authChecked, hasRun]);

  if (!authChecked) {
    return (
      <div style={{ padding: '16px', width: '300px' }}>
        <p>認証状況を確認中...</p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ padding: '16px', width: '300px' }}>
        <p>
          Raindrop authentication information is not set. Please configure it on
          the options page.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px',
        width: '300px',
      }}
    >
      <h3>Saving tabs to Raindrop...</h3>

      <ul style={{ paddingInlineStart: '0' }}>
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
    <li
      style={{
        listStyle: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      title={tab.title}
    >
      {icon} {tab.title}
    </li>
  );
};
