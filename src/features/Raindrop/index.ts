import { getValidAccessToken } from './auth';

export const checkIfSaved = async (url: string): Promise<boolean> => {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    console.error('No valid access token available');
    return false;
  }

  try {
    const response = await fetch(`https://api.raindrop.io/rest/v1/raindrops/0?search=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.items && data.items.length > 0;
    }
    return false;
  } catch (error) {
    console.error('Error checking if item is saved in Raindrop', error);
    return false;
  }
};

export const saveItem = async (
  title: string,
  url: string,
): Promise<boolean> => {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    console.error('No valid access token available');
    return false;
  }

  const body = {
    link: url,
    title: title,
  };

  try {
    const response = await fetch('https://api.raindrop.io/rest/v1/raindrop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving item to Raindrop', error);
    return false;
  }
};
