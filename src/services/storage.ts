export const uploadImage = async (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const deleteImage = async (url: string): Promise<void> => {
  // No-op for base64 strings since they are stored in the database record itself
  // and will be deleted when the record is deleted.
  return Promise.resolve();
};
