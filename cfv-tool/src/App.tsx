import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import FilePicker from "./components/filepicker";
import FileEncrypter from "./components/fileencrypter";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <div className="App">
      <div className="encryption">
        <h1>File Encryption</h1>
        <FilePicker accept=".txt" onFileSelect={handleFileSelect} />
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        <h2>Select Password for Encrpytion:</h2>

        <FileEncrypter file={selectedFile} />
      </div>
      <div className="decryption">
        
      </div>
    </div>
  );
}

export default App;
