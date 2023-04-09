import React, { useCallback, useState } from 'react';

interface FileEncrypterProps {
  file: File | any;
  password: string;
}

const FileEncrypter: React.FC<FileEncrypterProps> = ({ file }) => {

    function handleOnClick() {

    }

    return(
        <>
            <button onClick={handleOnClick}>
                Encrypte File
            </button>
        </>
    )
 
};

export default FileEncrypter;