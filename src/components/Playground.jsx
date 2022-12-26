import { createSignal } from "solid-js";
import DropZone from "./DropZone";
import ImageSlider from "./ImageSlider";
import Tools from "./Tools";
import { store } from "./store";

export default function Playground() {
  const [canvas, setCanvas] = createSignal(null);

  return (
    <Show when={store.imagePreviewURL} fallback={<DropZone />}>
      <section className="flex flex-col sm:flex-row w-full h-full">
        <Tools canvas={canvas} />
        <ImageSlider setCanvas={setCanvas} canvas={canvas} />
      </section>
    </Show>
    // <section className="flex w-full h-full">
    //   <Tools canvas={canvas} />
    //   <ImageSlider setCanvas={setCanvas} canvas={canvas} />
    // </section>
  );
}
