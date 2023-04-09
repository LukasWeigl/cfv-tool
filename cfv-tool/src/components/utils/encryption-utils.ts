export async function encryptFile(file: File, password: string): Promise<ArrayBuffer> {
     // Convert password to ArrayBuffer
  const passwordBuffer = new TextEncoder().encode(password);

  // Generate a random 96-bit IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Import the password as a CryptoKey object
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'AES-GCM', length: 128 },
    false,
    ['encrypt']
  );

  // Encrypt the file using AES-GCM
  const encryptedFile = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    await file.arrayBuffer()
  );

  // Concatenate the IV and encrypted file buffers
  const concatenatedBuffer = concatenateBuffers(iv.buffer, encryptedFile);

  // Return the concatenated buffer
  return concatenatedBuffer;
}
  
  // Helper function to concatenate two ArrayBuffer objects
  function concatenateBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    const concatenatedBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    concatenatedBuffer.set(new Uint8Array(buffer1), 0);
    concatenatedBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return concatenatedBuffer.buffer;
  }

export async function decryptFile(file: File, password: string): Promise<File> {
    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);
  
    // Read file contents into ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
  
    // Extract the IV from the file buffer
    const iv = new Uint8Array(fileBuffer.slice(0, 12));
  
    // Extract the encrypted file data from the file buffer
    const encryptedFileData = fileBuffer.slice(12);
  
    // Import the password as a CryptoKey object
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'AES-GCM', length: 128 },
      false,
      ['decrypt']
    );
  
    // Decrypt the file data using AES-GCM
    const decryptedFileData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encryptedFileData
    );
  
    // Convert the decrypted file data back to a Blob object
    const decryptedFileBlob = new Blob([decryptedFileData], { type: file.type });
  
    // Construct a new File object with the decrypted file data and metadata from the original file
    const decryptedFile = new File([decryptedFileBlob], file.name, { lastModified: file.lastModified, type: file.type });
  
    // Return the decrypted file
    return decryptedFile;
  }