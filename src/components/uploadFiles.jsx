import { Show, createEffect, createSignal } from "solid-js";
import { setStore, store } from "./store";

export default function Form() {
  let canvasRef;

  createEffect(() => {
    // update the canvas when the imagePreviewURL changes
    if (store.imagePreviewURL) {
      const ctx = canvasRef.getContext("2d");
      const img = new Image();
      img.src = store.imagePreviewURL;
      img.onload = function() {
        // set the canvas size to the image size
        canvasRef.width = img.width;
        canvasRef.height = img.height;
        // draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        // save the image data in the store
        setStore("image", ctx.getImageData(0,0,canvasRef.width, canvasRef.height));
      }
    }
  })

  const handleClick = async () => {
    // loads binarization algorithms
    const algo = await store.algorithm.initialize();
    // create a new image from the canvas
    const image = await new store.algorithm.Image(store.image.width, store.image.height, store.image.data);
    // create a binary image from the canvas
    const binImage = store.algorithm.Binarization.toBinary(algo.OTSU, image, { window: 26, k: 0.10 });
    // draw the binary image on the canvas
    binImage.draw(canvasRef);
    // free the memory
    image.free();
    binImage.free();
  }

  const uploadFile = async (e) => {
    // get the image from the input
    const image = e.target.files[0];
    // create a preview URL
    const imagePreview = URL.createObjectURL(image);
    // save the preview URL in the store
    setStore("imagePreviewURL", imagePreview);
  }
  
  return (
    <div>
    <form>
      <label>Select a single file </label>
      <input type="file" onChange={uploadFile} accept="image/*" />
    </form>
    <Show when={store.imagePreviewURL}>
      <canvas ref={canvasRef} style={{"max-width": "400px"}}></canvas>
    </Show>
    <button onClick={handleClick}>binarize</button>
    </div>
  )
}

