import { Show, createEffect, For } from "solid-js";
import { setStore, store } from "./store";

function DropZone() {
  const uploadFile = async (e) => {
    const [image] = e.target.files;
    const fileName = image.name;
    const imagePreview = URL.createObjectURL(image);
    setStore("imagePreviewURL", imagePreview);
    setStore("fileName", fileName);
  };

  return (
    <div class="flex items-center justify-center w-full max-w-xl">
      <label
        htmlFor="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            class="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">SVG, PNG, JPG, JPEG</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          class="hidden"
          onChange={uploadFile}
          accept="image/*"
        />
      </label>
    </div>
  );
}

export default function Form() {
  let canvasRef;
  createEffect(() => {
    // update the canvas when the imagePreviewURL changes
    if (store.imagePreviewURL) {
      const ctx = canvasRef.getContext("2d");
      const img = new Image();
      img.src = store.imagePreviewURL;
      img.onload = function () {
        // set the canvas size to the image size
        canvasRef.width = img.width;
        canvasRef.height = img.height;
        // draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        // save the image data in the store
        setStore(
          "image",
          ctx.getImageData(0, 0, canvasRef.width, canvasRef.height)
        );
      };
    }
  });

  const handleDownload = () => {
    const imageData = canvasRef.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = store.fileName;
    link.click();
    link.remove();
  };

  const handleSelect = async (e) => {
    // get the selected algorithm from the select
    const selectedAlgorithm = e.target.value;
    // save the selected algorithm in the store
    setStore("selectedAlgorithm", selectedAlgorithm);
    // create a new image from the canvas
    const start = performance.now();
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    // create a binary image from the canvas
    const binImage = store.doxa.Binarization.toBinary(
      selectedAlgorithm,
      image,
      { window: store.windowSize, k: store.k }
    );
    // draw the binary image on the canvas
    binImage.draw(canvasRef);
    // free the memory
    image.free();
    binImage.free();
    // record the execution time
    const end = performance.now();
    setStore("executionTime", end - start);
  };

  const handleChangeZ = async (e) => {
    const k = Number(e.target.value);
    setStore("k", k);
    const start = performance.now();
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    const binImage = store.doxa.Binarization.toBinary(
      store.selectedAlgorithm,
      image,
      { window: store.windowSize, k: store.k }
    );
    // record the execution time
    const end = performance.now();
    setStore("executionTime", end - start);
    binImage.draw(canvasRef);
    image.free();
    binImage.free();
  };

  const handleChangeWindow = async (e) => {
    const windowSize = Number(e.target.value);
    setStore("windowSize", windowSize);
    const start = performance.now();
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    const binImage = store.doxa.Binarization.toBinary(
      store.selectedAlgorithm,
      image,
      { window: store.windowSize, k: store.k }
    );
    // record the execution time
    const end = performance.now();
    setStore("executionTime", end - start);
    binImage.draw(canvasRef);
    image.free();
    binImage.free();
  };

  return (
    <Show when={store.imagePreviewURL} fallback={<DropZone />}>
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <img src={store.imagePreviewURL} className="max-w-md" />
        <canvas ref={canvasRef} className="max-w-md"></canvas>
      </div>
      <p className="font-mono">
        Binarization completed in {store.executionTime.toFixed(2)} ms
      </p>
      <div className="flex flex-col w-full gap-4 mt-10 max-w-xl">
        <div className="flex-1">
          <label
            htmlFor="select-input"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Select an algorithm
          </label>
          <select
            onInput={handleSelect}
            id="select-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option>Choose an option</option>
            <For each={Object.entries(store.binarizationAlgorithms)}>
              {([name, value]) => <option value={value}>{name}</option>}
            </For>
          </select>
        </div>
        <div>
          <label
            htmlFor="window-size"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Window size
          </label>
          <input
            id="window-size"
            value={store.windowSize}
            type="number"
            min={0}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onInput={handleChangeWindow}
          />
        </div>
        <div>
          <label
            htmlFor="k-value"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            k value
          </label>
          <input
            id="k-value"
            value={store.k}
            type="number"
            step={0.05}
            min={0}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onInput={handleChangeZ}
          />
        </div>
        <button
          class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
          onClick={handleDownload}
        >
          <span class="relative w-full px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
            Download
          </span>
        </button>
      </div>
    </Show>
  );
}
