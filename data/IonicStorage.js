import { Storage } from "@ionic/storage";

let storage = false;

export const createStore = () => {
    storage = new Storage();
    storage.create();
}

export const set = (key, val) => {
    storage.set(key, val);
}

export const get = async key => {
    const val = await storage.get(key);
    return val;
}