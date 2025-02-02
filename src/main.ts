import { deleteLocalStorageData } from './deleteLocalStorageData';

const leetcode = 'https://leetcode.com';

async function checkAndInjectContentScript(tabId: number, url: string) {
  if (url.startsWith(leetcode)) {
    const { leetcodeAutoResetIsActive } = await chrome.storage.local.get('leetcodeAutoResetIsActive');
    if (!leetcodeAutoResetIsActive) return;

    chrome.scripting.executeScript({
      target: { tabId },
      files: ['./js/content.js']
    });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkAndInjectContentScript(tabId, tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'deleteLocalStorage') {
    console.log('deleteLocalStorage action received');
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: deleteLocalStorageData
    });
  }
});
