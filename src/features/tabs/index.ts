import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useEffect } from 'react';
import { saveItem } from '~features/Raindrop';

export type TabId = number;
export type Tab = {
  id: TabId;
  title: string;
  url: string;
};

export const tabAtom = atomFamily((_id: TabId) => atom<Tab | null>(null));
export const tabIdsAtom = atom<TabId[]>([]);

export const useInitializeSelectedTabs = () => {
  const set = useSetAtom(selectedTabsAtom);
  useEffect(() => {
    set();
  }, [set]);
};

const selectedTabsAtom = atom(null, async (_get, set) => {
  const tabs = await selectedTabs();

  set(
    tabIdsAtom,
    tabs.map(t => t.id),
  );

  tabs.forEach(tab => set(tabAtom(tab.id), tab));
});

async function selectedTabs(): Promise<Tab[]> {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    highlighted: true,
  });
  return tabs
    .filter(t => t.id != null && t.title != null && t.url != null)
    .map(t => ({ id: t.id, title: t.title, url: t.url })) as Tab[];
}

type Status = 'saving' | 'saved' | 'error';
export const tabStatusAtom = atomFamily((_id: TabId) =>
  atom<Status | null>(null),
);

export const saveItemAtom = atom(null, async (get, set, id: TabId) => {
  const tab = get(tabAtom(id));
  if (tab == null) return;

  set(tabStatusAtom(id), 'saving');
  try {
    const success = await saveItem(tab.title, tab.url);
    if (success) {
      set(tabStatusAtom(id), 'saved');
    } else {
      set(tabStatusAtom(id), 'error');
    }
  } catch (error) {
    console.error('Error saving item', error);
    set(tabStatusAtom(id), 'error');
  }
});
