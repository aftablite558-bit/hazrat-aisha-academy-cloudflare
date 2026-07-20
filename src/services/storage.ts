import { getSupabase } from '../supabase/supabaseClient';

const BUCKET_NAME = 'School file';

const extractPathFromUrl = (url: string): string => {
  if (!url || !url.startsWith('http')) {
    return url || '';
  }
  
  try {
    const decodedUrl = decodeURIComponent(url);
    const searchString = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const index = decodedUrl.indexOf(searchString);
    if (index !== -1) {
      return decodedUrl.substring(index + searchString.length);
    }
    
    const encodedSearchString = `/storage/v1/object/public/${encodeURIComponent(BUCKET_NAME)}/`;
    const indexEncoded = url.indexOf(encodedSearchString);
    if (indexEncoded !== -1) {
      const relativePath = url.substring(indexEncoded + encodedSearchString.length);
      return decodeURIComponent(relativePath);
    }

    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => decodeURIComponent(part) === BUCKET_NAME);
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return decodeURIComponent(pathParts.slice(bucketIndex + 1).join('/'));
    }
  } catch (e) {
    console.error('Error parsing Supabase storage URL:', e);
  }
  
  return url;
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const supabase = getSupabase();
  const cleanPath = path.replace(/^\/+/, '');
  const fileName = `${cleanPath}/${Date.now()}_${file.name}`;
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  if (!url) return;
  try {
    const supabase = getSupabase();
    const filePath = extractPathFromUrl(url);
    if (!filePath) return;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error removing file from Supabase storage:', error);
    }
  } catch (error) {
    console.error('Error in deleteImage:', error);
  }
};
