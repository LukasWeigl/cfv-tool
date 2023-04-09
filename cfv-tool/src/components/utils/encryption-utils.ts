export async function encryptFile(file: File, password: string): Promise<ArrayBuffer> {
    // Convert password to ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(password);
    
    // Read file contents into ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
  
    // Concatenate password and file buffers
    const concatenatedBuffer = concatenateBuffers(passwordBuffer, fileBuffer);
  
    // Hash the concatenated buffer using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', concatenatedBuffer);
  
    // Return the hashed buffer
    return hashBuffer;
  }
  
  // Helper function to concatenate two ArrayBuffer objects
  function concatenateBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    const concatenatedBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    concatenatedBuffer.set(new Uint8Array(buffer1), 0);
    concatenatedBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return concatenatedBuffer.buffer;
  }