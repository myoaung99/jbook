import * as esBuild from "esbuild-wasm";
import { useEffect, useRef, useState } from "react";
import { unpkgPathPlugin } from "./plugin/unpkg-path-plugin";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const serviceRef = useRef<any>();

  const startService = async () => {
    esBuild
      .initialize({
        worker: true,
        wasmURL: "/esbuild.wasm",
      })
      .then(() => {
        //* track the esBuild ref to the rest of the app
        serviceRef.current = esBuild;
      });
  };

  useEffect(() => {
    startService().then((_) => {});
  }, []);

  const clickHandler = async () => {
    //* transpile and bundle the input

    if (!serviceRef.current) return;

    // const result = await serviceRef.current.transform(input, {
    //   loader: "jsx",
    //   target: "es2015",
    // });

    const result = await esBuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={clickHandler}>Submit</button>
      </div>

      <pre>{code}</pre>
    </div>
  );
}

export default App;
