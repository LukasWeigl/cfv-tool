import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import FilePicker from "./components/filepicker";
import FileEncrypter from "./components/fileencrypter";
import FileDecrypter from "./components/filedecrypter";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <div className="App">
      <div>
        <h2>Select File</h2>
        <FilePicker accept=".txt" onFileSelect={handleFileSelect} />
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      </div>
      <div className="encryption">
        <h1>File Encryption</h1>
        <FileEncrypter file={selectedFile} />
      </div>
      <div className="decryption">
        <h1>File Decryption</h1>
        <FileDecrypter encryptedFile={selectedFile} />
      </div>
    </div>
  );
}

export default App;
