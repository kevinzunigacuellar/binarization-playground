import { createSignal, createEffect } from "solid-js";
import { store, setStore } from "@scripts/store";

const INITIAL_POSITION = 50;

interface ImageSliderProps {
  canvas: () => HTMLCanvasElement;
  setCanvas: (canvas: HTMLCanvasElement) => void;
}

export default function ImageSlider({ setCanvas, canvas }: ImageSliderProps) {
  const [position, setPosition] = createSignal(INITIAL_POSITION);

  createEffect(() => {
    if (store.imagePreviewURL) {
      const ctx = canvas().getContext("2d", {
        willReadFrequently: true,
      });
      if (!ctx) return;
      const img = new Image();
      img.src = store.imagePreviewURL;
      img.onload = () => {
        canvas().width = img.width;
        canvas().height = img.height;
        ctx.drawImage(img, 0, 0);
        setStore(
          "image",
          ctx.getImageData(0, 0, canvas().width, canvas().height)
        );
      };
    }
  });

  return (
    <div class="w-full h-full flex justify-center items-center bg-zinc-900">
      <div class="relative flex max-w-3xl">
        <img
          class="h-full object-cover object-left absolute top-0"
          style={{ width: `${position()}%` }}
          src={store.imagePreviewURL}
        />
        <canvas
          class="w-full h-full object-cover object-left"
          ref={setCanvas}
        />

        <div
          class="absolute h-full w-0.5 bg-zinc-900 -translate-x-1/2"
          style={{ left: `${position()}%` }}
        ></div>
        <div
          class="absolute top-1/2 w-20 h-20 text-zinc-900 -translate-x-1/2 -translate-y-1/2 rotate-90"
          style={{ left: `${position()}%` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current stroke-1 fill-none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>

        <input
          type="range"
          class="absolute inset-0 opacity-0 cursor-pointer"
          value={INITIAL_POSITION}
          min="0"
          max="100"
          onInput={(e) => {
            setPosition(e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
}
