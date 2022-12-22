import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  image: null,
  selectedAlgorithm: null,
  imagePreviewURL: "",
  doxa: null,
  windowSize: 25,
  k: 0.1,
  binarizationAlgorithms: {
    Otsu: 0,
    Bernsen: 1,
    Niblack: 2,
    Sauvola: 3,
    Wolf: 4,
    Nick: 5,
    Su: 6,
    Trsingh: 7,
    Bataineh: 8,
    Isauvola: 9,
    Wan: 10,
    Gatos: 11,
  },
  fileName: "",
});

export { store, setStore };
