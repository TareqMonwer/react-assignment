import axios from "axios";
import { db } from "firebase.conf";
import {
  collection, getDocs, addDoc, query, where
} from "firebase/firestore";

const col = collection(db, "users");

export const getUsers = async () => {
  const snapshot = await getDocs(col);
  const users = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return users;
};

export const validateEachFields = (fieldsArray) => {
  let result = fieldsArray.every((field) => {
    if (!field) {
      return false;
    }
    return true;
  });
  return result;
};

export const storeUserData = (userObj) => {
  return addDoc(col, userObj);
};

export const getRandomUsers = (limit = 20, page = 1) => {
  const URI = 'https://randomuser.me/api';
  const API_URI = `${URI}?page=${page}&results=${limit}`;
  return axios
    .get(API_URI)
    .then((res) => {
      return res.data.results;
    })
    .catch((err) => err);
};

export const userEmailExists = async (email) => {
  const q = query(col, where("email", "==", email));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0;
};

export const saveRandomUsersToStorage = (usersArr) => {
  const users = usersArr.slice(0, 2);
  users.forEach(async (user) => {
    if (await userEmailExists(user.email)) {
      console.log(user.email, " <<found in database...");
    } else {
      const { name: {title, first, last}, email, gender, cell } = user;
      const fullName = `${title} ${first} ${last}`;
      storeUserData({ name: fullName, email, gender, phone: cell });
    }
  });
};
