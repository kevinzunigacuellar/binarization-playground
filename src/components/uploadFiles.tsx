import { createFileUploader } from "@solid-primitives/upload"
import type { Component } from "solid-js";
import { For } from "solid-js";

// create an input element that will trigger the file selection using solidjs

const Form: Component = () => {
  const {
    files,
    selectFiles
  } = createFileUploader();

  return (
    <form>
      <label>Select a single file</label>
      <button onClick={() => {
            selectFiles(([{ source, name, size, file }]) => {
              console.log({ source, name, size, file });
            });
          }}>Select</button>
      <For each={files()}>{(file) => <p>{file.name}</p>}</For>
    </form>
  )
}