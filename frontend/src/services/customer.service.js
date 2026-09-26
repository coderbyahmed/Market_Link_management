import { readStorage, writeStorage } from "../utils/storage.js";
import { getUser } from "../utils/auth.js";

/**
 * Customer profile service backed by localStorage.
 * Seeds personal fields from the authenticated session on first run; the
 * password field is a frontend-only demo value kept in this browser only.
 */

const PROFILE_KEY = "marketlink_customer_profile";
const MOCK_PASSWORD_KEY = "marketlink_customer_mock_password";
const LATENCY_MS = 150;

const wait = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const buildSeed = () => {
  const user = getUser() || {};

  return {
    name: user.name || "",
    email: user.email || "",
    phone: "",
    image: "",
    delivery: {
      address: "",
      city: "",
      location: "",
    },
  };
};

const readProfile = () => {
  const profile = readStorage(PROFILE_KEY, buildSeed());
  return typeof profile === "object" && profile !== null
    ? profile
    : buildSeed();
};

const getProfile = async () => {
  await wait();
  return readProfile();
};

const updateProfile = async (patch) => {
  await wait();

  const current = readProfile();
  const next = {
    ...current,
    ...patch,
    delivery: {
      ...current.delivery,
      ...(patch.delivery || {}),
    },
  };

  writeStorage(PROFILE_KEY, next);
  return next;
};

const saveProfileImage = async (dataUrl) => {
  await wait();

  const current = readProfile();
  const next = { ...current, image: dataUrl };
  writeStorage(PROFILE_KEY, next);
  return next;
};

const changePassword = async ({ newPassword }) => {
  await wait();

  writeStorage(MOCK_PASSWORD_KEY, newPassword);
  return true;
};

export { getProfile, updateProfile, saveProfileImage, changePassword };