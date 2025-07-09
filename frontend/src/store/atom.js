// src/store/atoms.js
import { atom } from "recoil";

// This function will help us persist the state in localStorage
// so the user stays logged in after a page refresh.
const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const userState = atom({
  key: "userState", //  key is unique for the entire application
  default: {
    isLoading: true, // Useful for showing a loading spinner initially
    user: null, // Will hold user info like { firstName: 'Ashish' }
  },
  effects_UNSTABLE: [
    localStorageEffect("current_user"), // The key for localStorage
  ],
});
