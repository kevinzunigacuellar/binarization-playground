import { store, setStore } from "@scripts/store";
import { Select } from "@thisbeyond/solid-select";
import { Accessor, Show } from "solid-js";
import "./select.css";

interface ToolsProps {
  canvas: Accessor<HTMLCanvasElement | undefined>;
}

type SelectOptions = keyof typeof store.binarizationAlgorithms;

export default function Tools({ canvas }: ToolsProps) {
  const handleDownload = () => {
    const imageData = (canvas() as HTMLCanvasElement).toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = store.fileData.name;
    link.click();
    link.remove();
  };

  const handleSelect = async (option: SelectOptions) => {
    const selectedAlgorithmIdx = store.binarizationAlgorithms[option].id;
    const selectedAlgorithmParams =
      store.binarizationAlgorithms[option].parameters;

    setStore("selectedAlgorithm", "id", selectedAlgorithmIdx);
    setStore("selectedAlgorithm", "name", option);
    setStore("selectedAlgorithm", "parameters", selectedAlgorithmParams);

    const start = performance.now();
    const image = await new (store.doxa as any).Image(
      store.imageData.width,
      store.imageData.height,
      store.imageData.data
    );
    const binImage = (store.doxa as any).Binarization.toBinary(
      selectedAlgorithmIdx,
      image,
      {
        window: store.parameters.window,
        k: store.parameters.k,
        threshold: store.parameters.threshold,
        "contrast-limit": store.parameters["contrast-limit"],
      }
    );
    binImage.draw(canvas());
    image.free();
    binImage.free();
    const end = performance.now();
    console.log(end - start);
    setStore("executionTime", end - start);
  };

  const handleChangeZ = async (e: any) => {
    // const k = Number(e.target.value);
    // setStore("k", k);
    // const start = performance.now();
    // const image = await new (store.doxa as any).Image(
    //   store.image.width,
    //   store.image.height,
    //   store.image.data
    // );
    // const binImage = (store.doxa as any).Binarization.toBinary(
    //   store.selectedAlgorithm,
    //   image,
    //   { window: store.windowSize, k: store.k }
    // );
    // const end = performance.now();
    // setStore("executionTime", end - start);
    // binImage.draw(canvas());
    // image.free();
    // binImage.free();
  };

  const handleChangeWindow = async (e: any) => {
    // const windowSize = Number(e.target.value);
    // setStore("windowSize", windowSize);
    // const start = performance.now();
    // const image = await new (store.doxa as any).Image(
    //   store.image.width,
    //   store.image.height,
    //   store.image.data
    // );
    // const binImage = (store.doxa as any).Binarization.toBinary(
    //   store.selectedAlgorithm,
    //   image,
    //   { window: store.windowSize, k: store.k }
    // );
    // const end = performance.now();
    // setStore("executionTime", end - start);
    // binImage.draw(canvas());
    // image.free();
    // binImage.free();
  };
  return (
    <div class="w-full sm:w-72 h-full p-4 sm:border-r border-zinc-700 bg-zinc-800 flex flex-col gap-2 order-2 sm:order-none">
      <label
        for="select-input2"
        class="block text-sm font-medium text-zinc-400"
      >
        Select an algorithm
      </label>
      <Select
        options={Object.keys(store.binarizationAlgorithms)}
        class="custom"
        placeholder="Choose an option"
        id="select-input2"
        onChange={handleSelect}
      />
      <Show when={store.selectedAlgorithm.parameters.window}>
        <label
          for="window-size"
          class="block text-sm font-medium text-zinc-400"
        >
          Window size
        </label>
        <input
          id="window-size"
          value={store.parameters.window}
          type="number"
          min={0}
          class="bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border-0 appearance-none"
          onInput={handleChangeWindow}
        />
      </Show>
      <Show when={store.selectedAlgorithm.parameters.window}>
        <label for="k-value" class="block text-sm font-medium text-zinc-400">
          k value
        </label>
        <input
          id="k-value"
          value={store.parameters.k}
          type="number"
          step={0.02}
          min={0}
          class="bg-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border-0 appearance-none"
          onInput={handleChangeZ}
        />
      </Show>
      <button
        class="inline-flex mt-2 items-center justify-center p-2 overflow-hidden text-sm font-medium text-zinc-200 hover:text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-500 focus:ring-blue-300"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
  );
}
