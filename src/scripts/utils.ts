import { store } from "@scripts/store";
import type { Accessor } from "solid-js";

export async function binarize(
  canvas: Accessor<HTMLCanvasElement | undefined>
) {
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
