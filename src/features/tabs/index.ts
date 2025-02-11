import { atom } from 'jotai';

export type Tab = {
  id: number;
  title: string;
  url: string;
};

export const selectedTabsAtom = atom(selectedTabs);

async function selectedTabs(): Promise<Tab[]> {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    highlighted: true,
  });
  return tabs
    .filter(t => t.id != null && t.title != null && t.url != null)
    .map(t => ({ id: t.id, title: t.title, url: t.url })) as Tab[];
}
