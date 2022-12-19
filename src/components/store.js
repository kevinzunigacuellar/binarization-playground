import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  image: null,
  imagePreviewURL: "",
  algorithm: null,
});

export { store, setStore }