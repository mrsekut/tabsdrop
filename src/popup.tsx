import { usePocketAccessToken } from './features/Pocket/usePocketAccessToken';
import { usePocketConsumerKey } from './features/Pocket/usePocketCunsumerKey';
import { PocketTabSaver } from './PocketTabSaver';

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
