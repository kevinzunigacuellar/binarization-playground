import { Show, createEffect, createSignal } from "solid-js";
import { setStore, store } from "./store";

export default function Form() {
  let canvasRef;

  createEffect(() => {
    if (store.imagePreviewURL) {
      const ctx = canvasRef.getContext("2d");
      const img = new Image();
      img.onload = function() {
        canvasRef.width = img.width;
        canvasRef.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
      img.src = store.imagePreviewURL;
    }
    console.log(store.algorithm)
  })

  const uploadFile = async (e) => {
    const image = e.target.files[0];
    const imagePreview = URL.createObjectURL(image);
    setStore("image", image);
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
    </div>
  )
}

