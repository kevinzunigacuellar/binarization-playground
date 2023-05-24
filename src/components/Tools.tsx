import { store, setStore } from "@scripts/store";
import { Accessor, Show, For } from "solid-js";
import { Select, HoverCard } from "@kobalte/core";
import { binarize } from "@scripts/utils";

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

  const handleReset = () => {
    setStore("imageData", "previewUrl", "");
    setStore("fileData", "name", "");
    setStore("executionTime", 0);
    setStore("selectedAlgorithm", {
      id: new Number(),
      name: "",
      parameters: {
        window: false,
        k: false,
        threshold: false,
        "contrast-limit": false,
      },
    });
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
            <Select.Listbox>
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
        <div class="text-sm text-zinc-400 flex gap-1 items-center">
          <label for="window-size" class="block font-medium">
            Window size
          </label>
          <HoverCard openDelay={300} gutter={5}>
            <HoverCard.Trigger>
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content>
                <p class="bg-zinc-900 max-w-md p-4 rounded-md text-zinc-400 border border-zinc-600">
                  Number of pixels that will be used to calculate the threshold.
                </p>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard>
        </div>
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
        <div class="text-sm text-zinc-400 flex gap-1 items-center">
          <label for="threshold" class="block font-medium">
            Threshold
          </label>
          <HoverCard openDelay={300} gutter={5}>
            <HoverCard.Trigger>
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content>
                <p class="bg-zinc-900 max-w-md p-4 rounded-md text-zinc-400 border border-zinc-600">
                  Threshold value to be used in the binarization process
                  (0-255).
                </p>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard>
        </div>
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
        <div class="text-sm text-zinc-400 flex gap-1 items-center">
          <label for="contrastLimit" class="block font-medium">
            Contrast Limit
          </label>
          <HoverCard openDelay={300} gutter={5}>
            <HoverCard.Trigger>
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content>
                <p class="bg-zinc-900 max-w-md p-4 rounded-md text-zinc-400 border border-zinc-600">
                  The maximum value of the contrast between the local mean and
                  the local standard deviation.
                </p>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard>
        </div>
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
        <div class="text-sm text-zinc-400 flex gap-1 items-center">
          <label for="k-value" class="block font-medium">
            k value
          </label>
          <HoverCard openDelay={300} gutter={5}>
            <HoverCard.Trigger>
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content>
                <p class="bg-zinc-900 max-w-md p-4 rounded-md text-zinc-400 border border-zinc-600">
                  Constant multiplier that controls the value of the threshold
                  in the local window
                </p>
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard>
        </div>
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
      <button
        class="inline-flex mt-2 items-center justify-center p-2 overflow-hidden text-sm font-medium text-zinc-200 hover:text-white rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-500 focus:ring-blue-300"
        onClick={handleReset}
      >
        Reset
      </button>
      <Show when={store.executionTime > 0}>
        <p class="font-mono text-sm text-white">
          Generated in {store.executionTime.toFixed(2)} ms
        </p>
      </Show>
    </div>
  );
}
