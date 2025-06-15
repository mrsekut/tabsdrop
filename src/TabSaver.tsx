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

// CSS-in-JS for spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export function TabSaver() {
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
        <p>Checking authentication status...</p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ padding: '16px', width: '300px' }}>
        <p style={{ fontSize: '14px', color: '#f44336' }}>
          Authentication error occurred. Please reconnect in the settings page.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px',
        width: '320px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          padding: '8px 0',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#4285f4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
          }}
        >
          📋
        </div>
        <h3
          style={{
            margin: '0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Saving to Raindrop
        </h3>
      </div>

      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {tabIds.map(tabId => (
          <ListItem key={tabId} tabId={tabId} />
        ))}
      </div>
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        marginBottom: '4px',
        borderRadius: '6px',
        backgroundColor: (() => {
          switch (status) {
            case 'saved':
              return '#f0f9f0';
            case 'error':
              return '#fdf2f2';
            default:
              return '#f8f9fa';
          }
        })(),
        border: (() => {
          switch (status) {
            case 'saved':
              return '1px solid #d4edda';
            case 'error':
              return '1px solid #f5c6cb';
            default:
              return '1px solid #e9ecef';
          }
        })(),
        transition: 'all 0.2s ease',
      }}
      title={tab.title}
    >
      <div
        style={{
          fontSize: '16px',
          minWidth: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '14px',
          color: '#333',
          lineHeight: '1.4',
        }}
      >
        {tab.title}
      </div>
      {status === 'saving' && (
        <div
          style={{
            width: '12px',
            height: '12px',
            border: '2px solid #e3e3e3',
            borderTop: '2px solid #4285f4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
    </div>
  );
};
