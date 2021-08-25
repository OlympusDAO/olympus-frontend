// ApiStopper.js
//
// an attempt to delay running API calls unless a certain Time Duration has passed
// ... preventing CHADs from refresh bombing the backend APIs

// Console.logging just to demonstrate functionality
const DEBUG = true;

// a simple truthy operation
// checks whether enough time has passed to allow refresh
// time duration is governed by minutes param
// ... also returns true if localStorage.getItem(key) is Not a Number, AKA we can assume time is expired
const isTimeExpiredForKey = (key, minutes) => {
  if (
    Number.isNaN(parseInt(localStorage.getItem(key))) ||
    new Date().getTime() > parseInt(localStorage.getItem(key)) + millisecondsTime(minutes)
  ) {
    // Time is expired
    if (DEBUG) console.log("ApiStopper: Key:", key, "Time Expired refreshing calls");
    return true;
  } else {
    if (DEBUG) {
      console.log(
        "ApiStopper: Key:",
        key,
        "Time Not Expired; Not refreshing calls.",
        "Time will expire in ",
        minutesRemaining(key, minutes),
        "minutes",
      );
    }
    return false;
  }
};

const minutesRemaining = (key, minutes) => {
  // add minutes to stored timestamp, subtract current time, divide by 60000 milliseconds
  return (parseInt(localStorage.getItem(key)) + millisecondsTime(minutes) - new Date().getTime()) / 60000;
};

// first check that key is in our Array
// then check if time is expired
// returns true or false
export const isRefreshAllowedForKey = (key, minutes) => {
  if (minutes >= 5) {
    console.warn("ApiStopper: Key:", key, "You set a high (>= 5 minutes) threshold for preventing API reloads");
  }
  if (allowableStoppers.indexOf(key) < 0) {
    console.warn(
      "ApiStopper: Key:",
      key,
      " is an invalid ApiStopper key.",
      "REFRESHING all API calls unless you change to an allowableStopper",
    );
    return true;
  } else {
    // returns true if Time is Expired
    return isTimeExpiredForKey(key, minutes);
  }
};

// convert minutes params to Javascript.getTime() milliseconds
const millisecondsTime = minutes => {
  // there are 60,000 milliseconds in a minute
  return minutes * 60000;
};

// sets the current timestamp into localStorage.key
export const setStopperTimestamp = key => {
  if (DEBUG) console.log("ApiStopper: Key:", key, "setStopperTimestamp: ", new Date().getTime().toString());
  localStorage.setItem(key, new Date().getTime().toString());
};

// strictly check that localStorage keys are valid
// if a key was to be stepped on somewhere in the app errors would be thrown that bring you here
export const loadAppKey = "loadAppAt";
export const loadAccountKey = "loadAccountAt";
export const loadBondsKey = "loadBondsAt";

// check allowable localStorage Keys
const allowableStoppers = [loadAppKey, loadAccountKey, loadBondsKey];
