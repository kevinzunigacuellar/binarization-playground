import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  fileData: {
    name: "",
  },
  imageData: {
    height: 0,
    width: 0,
    data: new Uint8ClampedArray(),
    previewUrl: "",
  },
  parameters: {
    window: 25,
    k: 0.1,
    threshold: 100, // only for Bernsen
    "contrast-limit": 25, // only for Bernsen
  },
  executionTime: 0,
  selectedAlgorithm: {
    id: new Number(),
    name: "",
    parameters: {
      window: false,
      k: false,
      threshold: false,
      "contrast-limit": false,
    },
  },
  binarizationAlgorithms: {
    Otsu: {
      id: 0,
      parameters: {
        window: false,
        k: false,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Bernsen: {
      id: 1,
      parameters: {
        window: true,
        k: false,
        threshold: true,
        "contrast-limit": true,
      },
    },
    Niblack: {
      id: 2,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Sauvola: {
      id: 3,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Wolf: {
      id: 4,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Nick: {
      id: 5,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Su: {
      id: 6,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Trsingh: {
      id: 7,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Bataineh: {
      id: 8,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Isauvola: {
      id: 9,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Wan: {
      id: 10,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
    Gatos: {
      id: 11,
      parameters: {
        window: true,
        k: true,
        threshold: false,
        "contrast-limit": false,
      },
    },
  },
  doxa: null,
});

export { store, setStore };
