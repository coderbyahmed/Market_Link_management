import mockSettings from "../components/farmer/settings/data/mockSettings.js";

const SETTINGS_KEY = "marketlink_farmer_settings";
const LATENCY_MS = 150;

const wait = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const read = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // ignore
  }
  const seeded = clone(seed);
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const getSettings = async () => {
  await wait();
  return read(SETTINGS_KEY, mockSettings);
};

const updateSettings = async (section, data) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = { ...current, [section]: { ...current[section], ...data } };
  write(SETTINGS_KEY, updated);
  return updated[section];
};

const addMarket = async (market) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const newMarket = { ...market, id: `market-${Date.now()}` };
  const updated = { ...current, markets: [...current.markets, newMarket] };
  write(SETTINGS_KEY, updated);
  return updated.markets;
};

const updateMarket = async (id, data) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = {
    ...current,
    markets: current.markets.map((m) => (m.id === id ? { ...m, ...data } : m)),
  };
  write(SETTINGS_KEY, updated);
  return updated.markets;
};

const deleteMarket = async (id) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = {
    ...current,
    markets: current.markets.filter((m) => m.id !== id),
  };
  write(SETTINGS_KEY, updated);
  return updated.markets;
};

const updateOperationDays = async (days) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = { ...current, operations: { days } };
  write(SETTINGS_KEY, updated);
  return updated.operations;
};

const updateLocation = async (data) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = { ...current, location: { ...current.location, ...data } };
  write(SETTINGS_KEY, updated);
  return updated.location;
};

const updateNotifications = async (data) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = { ...current, notifications: { ...current.notifications, ...data } };
  write(SETTINGS_KEY, updated);
  return updated.notifications;
};

const updateSecurity = async (data) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = { ...current, security: { ...current.security, ...data } };
  write(SETTINGS_KEY, updated);
  return updated.security;
};

const removeSession = async (sessionId) => {
  await wait();
  const current = read(SETTINGS_KEY, mockSettings);
  const updated = {
    ...current,
    security: {
      ...current.security,
      sessions: current.security.sessions.filter((s) => s.id !== sessionId),
    },
  };
  write(SETTINGS_KEY, updated);
  return updated.security;
};

export {
  getSettings,
  updateSettings,
  addMarket,
  updateMarket,
  deleteMarket,
  updateOperationDays,
  updateLocation,
  updateNotifications,
  updateSecurity,
  removeSession,
};