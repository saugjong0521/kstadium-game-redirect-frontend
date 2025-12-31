import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_KSTADIUM_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const webGameApi = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_WEBGAME_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const lotteryApi = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_ROTTERY_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api, webGameApi, lotteryApi };
