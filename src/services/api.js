import axios from 'axios';

const EXCHANGE_API_BASE = 'https://api.exchangerate-api.com/v4/latest';
const NEWS_API_BASE = 'https://newsdata.io/api/1/news';

export const fetchExchangeRates = async (base = 'INR') => {
  try {
    const { data } = await axios.get(`${EXCHANGE_API_BASE}/${base}`);
    return data.rates;
  } catch {
    return null;
  }
};

export const fetchFinancialNews = async () => {
  try {
    const { data } = await axios.get(`${NEWS_API_BASE}`, {
      params: { apikey: 'pub_demo', q: 'personal finance budget', language: 'en', size: 5 },
    });
    return data.results || [];
  } catch {
    return [];
  }
};
