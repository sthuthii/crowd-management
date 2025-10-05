// frontend/src/components/UploadForm.jsx
import React, { useState } from "react";
import api from "../services/api"; // <- updated path

export default function UploadForm({ endpoint, onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file, file.name);

    try {
      const resp = await api.post(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult && onResult(resp.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>
    </form>
  );
}
