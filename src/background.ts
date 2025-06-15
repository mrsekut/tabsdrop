import { checkIfSaved } from '~features/Raindrop';

export {};

chrome.tabs.onActivated.addListener(async activeInfo => {
  await updateBadgeForTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await updateBadgeForTab(tabId);
  }
});

async function updateBadgeForTab(tabId: number) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) return;

    const isSaved = await checkIfSaved(tab.url);

    if (isSaved) {
      chrome.action.setBadgeText({
        text: '✓',
        tabId: tabId,
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#00AA00',
        tabId: tabId,
      });
    } else {
      chrome.action.setBadgeText({
        text: '',
        tabId: tabId,
      });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
  }
}
