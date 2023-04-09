import React, { useRef } from 'react';

interface FilePickerProps {
  accept: string;
  onFileSelect: (file: File | null) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ accept, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile != null) {
        onFileSelect(selectedFile);
    }
    
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <button onClick={handleClick}>Select file</button>
    </>
  );
};

export default FilePicker;