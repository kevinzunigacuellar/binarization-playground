import { store, setStore } from "@scripts/store";
import { Accessor, Show, For } from "solid-js";
import { Select } from "@kobalte/core";

async function binarize(canvas: Accessor<HTMLCanvasElement | undefined>) {
  const start = performance.now();
  const image = await new (store.doxa as any).Image(
    store.imageData.width,
    store.imageData.height,
    store.imageData.data
  );
  const binImage = (store.doxa as any).Binarization.toBinary(
    store.selectedAlgorithm.id,
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
  return end - start;
}

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
    const time = await binarize(canvas);
    setStore("executionTime", time);
  };

  return (
    <div class="w-full sm:w-72 h-full p-4 sm:border-r border-zinc-700 bg-zinc-800 flex flex-col gap-2 order-2 sm:order-none">
      <Select onValueChange={handleSelect}>
        <Select.Label class="text-zinc-400 text-sm font-medium">
          Select an algorithm
        </Select.Label>
        <Select.Trigger
          aria-label="binarization algorithms"
          class="bg-zinc-800 border text-zinc-400 border-zinc-700 rounded-lg flex text-sm justify-between items-center p-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Select.Value placeholder="Select an option" />
          <Select.Icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="bg-zinc-800 border-zinc-700 border rounded-lg py-1">
            <Select.Listbox class="">
              <For each={Object.keys(store.binarizationAlgorithms)}>
                {(algorithm) => (
                  <Select.Item
                    value={algorithm}
                    class="flex py-1 px-2 text-zinc-400 text-sm justify-between items-center outline-none focus:bg-zinc-900 "
                  >
                    <Select.ItemLabel>{algorithm}</Select.ItemLabel>
                    <Select.ItemIndicator>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-5 h-5 mr-1 text-emerald-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
                )}
              </For>
            </Select.Listbox>
          </Select.Content>
        </Select.Portal>
      </Select>
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
          step={5}
          min={0}
          class="bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border"
          onInput={async (e) => {
            const windowSize = e.currentTarget.valueAsNumber;
            setStore("parameters", "window", windowSize);
            const time = await binarize(canvas);
            setStore("executionTime", time);
          }}
        />
      </Show>
      <Show when={store.selectedAlgorithm.parameters.threshold}>
        <label for="threshold" class="block text-sm font-medium text-zinc-400">
          Threshold
        </label>
        <input
          id="threshold"
          value={store.parameters.threshold}
          type="number"
          min={0}
          step={10}
          class="bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border"
          onInput={async (e) => {
            const threshold = e.currentTarget.valueAsNumber;
            setStore("parameters", "threshold", threshold);
            const time = await binarize(canvas);
            setStore("executionTime", time);
          }}
        />
      </Show>
      <Show when={store.selectedAlgorithm.parameters["contrast-limit"]}>
        <label
          for="contrastLimit"
          class="block text-sm font-medium text-zinc-400"
        >
          Contrast Limit
        </label>
        <input
          id="contrastLimit"
          value={store.parameters["contrast-limit"]}
          type="number"
          min={0}
          step={5}
          class="bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2 border"
          onInput={async (e) => {
            const contrastLimit = e.currentTarget.valueAsNumber;
            setStore("parameters", "contrast-limit", contrastLimit);
            const time = await binarize(canvas);
            setStore("executionTime", time);
          }}
        />
      </Show>
      <Show when={store.selectedAlgorithm.parameters.k}>
        <label for="k-value" class="block text-sm font-medium text-zinc-400">
          k value
        </label>
        <input
          id="k-value"
          value={store.parameters.k}
          type="number"
          step={0.05}
          min={0}
          class="bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-400 text-sm rounded-lg block w-full p-2"
          onInput={async (e) => {
            const k = e.currentTarget.valueAsNumber;
            setStore("parameters", "k", k);
            const time = await binarize(canvas);
            setStore("executionTime", time);
          }}
        />
      </Show>
      <button
        class="inline-flex mt-2 items-center justify-center p-2 overflow-hidden text-sm font-medium text-zinc-200 hover:text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-500 focus:ring-blue-300"
        onClick={handleDownload}
      >
        Download
      </button>
      <Show when={store.executionTime > 0}>
        <p class="font-mono text-sm text-white">
          Generated in {store.executionTime.toFixed(2)} ms
        </p>
      </Show>
    </div>
  );
}
