import { store, setStore } from "./store";
import { Select } from "@thisbeyond/solid-select";
import "./select.css";

export default function Tools({ canvas }) {
  const handleDownload = () => {
    const imageData = canvas().toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = store.fileName;
    link.click();
    link.remove();
  };

  const handleSelect = async (e) => {
    const selectedAlgorithm = e.target.value;
    setStore("selectedAlgorithm", selectedAlgorithm);
    const start = performance.now();
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    const binImage = store.doxa.Binarization.toBinary(
      selectedAlgorithm,
      image,
      { window: store.windowSize, k: store.k }
    );
    binImage.draw(canvas());
    image.free();
    binImage.free();
    const end = performance.now();
    setStore("executionTime", end - start);
  };

  const handleSelect2 = async (e) => {
    const selectedAlgorithm = store.binarizationAlgorithms[e];
    setStore("selectedAlgorithm", selectedAlgorithm);
    const start = performance.now();
    const image = await new store.doxa.Image(
      store.image.width,
      store.image.height,
      store.image.data
    );
    const binImage = store.doxa.Binarization.toBinary(
      selectedAlgorithm,
      image,
      { window: store.windowSize, k: store.k }
    );
    binImage.draw(canvas());
    image.free();
    binImage.free();
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
    const end = performance.now();
    setStore("executionTime", end - start);
    binImage.draw(canvas());
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
    const end = performance.now();
    setStore("executionTime", end - start);
    binImage.draw(canvas());
    image.free();
    binImage.free();
  };
  return (
    <div className="w-full sm:w-72 h-full p-4 bg-zinc-900 flex flex-col gap-2 order-2 sm:order-none">
      {/* <label
        htmlFor="select-input"
        class="block mb-1 text-sm font-medium text-zinc-400"
      >
        Select an algorithm
      </label>
      <select
        onInput={handleSelect}
        id="select-input"
        className="bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border-0 appearance-none"
      >
        <option>Choose an option</option>
        <For each={Object.entries(store.binarizationAlgorithms)}>
          {([name, value]) => <option value={value}>{name}</option>}
        </For>
      </select> */}
      <label
        htmlFor="select-input2"
        class="block text-sm font-medium text-zinc-400"
      >
        Select an algorithm
      </label>
      <Select
        options={Object.keys(store.binarizationAlgorithms)}
        class="custom"
        placeholder="Choose an option"
        id="select-input2"
        onChange={handleSelect2}
      />

      <label
        htmlFor="window-size"
        class="block text-sm font-medium text-zinc-400"
      >
        Window size
      </label>
      <input
        id="window-size"
        value={store.windowSize}
        type="number"
        min={0}
        className="bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border-0 appearance-none"
        onInput={handleChangeWindow}
      />

      <label htmlFor="k-value" class="block text-sm font-medium text-zinc-400">
        k value
      </label>
      <input
        id="k-value"
        value={store.k}
        type="number"
        step={0.05}
        min={0}
        className="bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border-0 appearance-none"
        onInput={handleChangeZ}
      />
      <button
        class="inline-flex mt-2 items-center justify-center p-2 overflow-hidden text-sm font-medium text-zinc-200 hover:text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-500 focus:ring-blue-300"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
}
