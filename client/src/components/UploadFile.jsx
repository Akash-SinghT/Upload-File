import { useState } from "react";
import axios from "axios";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(""); // Clear error on new selection
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFileUrl(response.data.url);
      setError("");
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {error && <p>{error}</p>}

      {fileUrl && (
        <div>
          <p>File Uploaded Successfully!</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Open File
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
