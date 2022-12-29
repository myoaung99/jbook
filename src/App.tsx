import * as esBuild from "esbuild-wasm";
import { useEffect, useRef, useState } from "react";

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
    startService();
  }, []);

  const clickHandler = async () => {
    //* transpile and bundle the input

    if (!serviceRef.current) return;
    const result = await serviceRef.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    setCode(result.code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={clickHandler}>Submit</button>
      </div>

      <pre>{code}</pre>
    </div>
  );
}

export default App;
