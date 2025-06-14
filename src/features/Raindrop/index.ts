import { getValidAccessToken } from './auth';

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
