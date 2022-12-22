import { Show, createEffect, For } from "solid-js";
import { setStore, store } from "./store";
import debounce from "lodash.debounce";

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
    console.log(store.k);
  });

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

  const handleClick = async () => {
    // create a new image from the canvas
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    // create a binary image from the canvas
    const binImage = store.doxa.Binarization.toBinary(
      store.binarizationAlgorithms.OTSU,
      image,
      { window: 26, k: 0.1 }
    );
    // draw the binary image on the canvas
    binImage.draw(canvasRef);
    // free the memory
    image.free();
    binImage.free();
  };

  const handleDownload = () => {
    // get the image data from the canvas
    const imageData = canvasRef.toDataURL("image/png");
    // create a link to download the image
    const link = document.createElement("a");
    link.href = imageData;
    link.download = store.fileName;
    link.click();
    // free the memory
    link.remove();
  };

  const handleInput = async (e) => {
    // get the selected algorithm from the select
    const selectedAlgorithm = e.target.value;
    // save the selected algorithm in the store
    setStore("selectedAlgorithm", selectedAlgorithm);
    // create a new image from the canvas
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
  };

  const handleInput2 = async (e) => {
    // get the selected algorithm from the select
    const k = e.target.value;
    // save the selected algorithm in the store
    setStore("k", k);
    // create a new image from the canvas
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    // create a binary image from the canvas
    console.log("binarizing image");
    const binImage = store.doxa.Binarization.toBinary(
      store.selectedAlgorithm,
      image,
      { window: store.windowSize, k: store.k }
    );
    // draw the binary image on the canvas
    binImage.draw(canvasRef);
    // free the memory
    image.free();
    binImage.free();
    console.log("binarizing image done");
  };

  return (
    <Show when={store.imagePreviewURL} fallback={<DropZone />}>
      <div className="flex gap-4 flex-1">
        <img src={store.imagePreviewURL} className="max-w-md" />
        <canvas ref={canvasRef} className="max-w-md"></canvas>
      </div>
      <div className="flex w-full gap-4 mt-10">
        <div className="flex-1">
          <label
            htmlFor="select-input"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Select an algorithm
          </label>
          <select
            onInput={handleInput}
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
            onInput={(e) => setStore("windowSize", e.target.value)}
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
            onChange={handleInput2}
          />
        </div>
      </div>
    </Show>
  );
}
