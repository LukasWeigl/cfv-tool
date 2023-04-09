import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import FilePicker from './components/filepicker';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  }
  return (
    <div className="App">
     <h1>Hello World</h1>
     <FilePicker accept=".txt" onFileSelect={handleFileSelect} />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </div>
  );
}

export default App;
