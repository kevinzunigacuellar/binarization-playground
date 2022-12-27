import { createSignal } from "solid-js";
import DropZone from "@components/DropZone";
import ImageSlider from "@components/ImageSlider";
import Tools from "@components/Tools";
import { store } from "@scripts/store";

export default function Playground() {
  const [canvas, setCanvas] = createSignal(null);

  return (
    <Show when={store.imagePreviewURL} fallback={<DropZone />}>
      <section className="flex flex-col sm:flex-row w-full h-full">
        <Tools canvas={canvas} />
        <ImageSlider setCanvas={setCanvas} canvas={canvas} />
      </section>
    </Show>
  );
}
