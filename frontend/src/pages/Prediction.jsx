import React, { useState } from "react";
import UploadForm from "../components/UploadForm";

export default function Prediction(){
  const [result, setResult] = useState(null);

  return (
    <div>
      <h2>Crowd Prediction</h2>
      <UploadForm endpoint="/crowd/image" onResult={(data)=>setResult(data)} />
      <hr />
      <h3>Result</h3>
      <pre>{ result ? JSON.stringify(result, null, 2) : "No result yet" }</pre>
    </div>
  );
}
