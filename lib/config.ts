const DEFAULT_API_BASE_URL = 'http://localhost:8080';
const DEFAULT_GOOGLE_CLIENT_ID =
  '772681843196-dqudmnoc3iqf2np8cjl2836enqtam0st.apps.googleusercontent.com';

const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, '');
const withProtocol = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `http://${value}`;
const normalizeApiBaseUrl = (value: string) => {
  const trimmed = value.trim();
  const normalized = stripTrailingSlashes(withProtocol(trimmed || DEFAULT_API_BASE_URL));

  try {
    new URL(normalized);
  } catch {
    return `${DEFAULT_API_BASE_URL}/api`;
  }

  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

export const GOOGLE_CLIENT_ID =
  process.env.VITE_GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  DEFAULT_GOOGLE_CLIENT_ID;

export const getApiBaseUrl = () => {
  const configured =
    process.env.VITE_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_API_BASE_URL;
  return normalizeApiBaseUrl(configured);
};

export const API_BASE_URL = getApiBaseUrl();
