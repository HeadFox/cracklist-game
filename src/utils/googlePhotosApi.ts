import axios from 'axios';
import type { MediaItem, LivePhoto } from '../types/photos';

const GOOGLE_PHOTOS_API_BASE = 'https://photoslibrary.googleapis.com/v1';

/**
 * Check if a media item is a Live Photo
 * Live Photos have both photo and video metadata
 */
export function isLivePhoto(item: MediaItem): item is LivePhoto {
  return !!(item.mediaMetadata.photo && item.mediaMetadata.video);
}

/**
 * Fetch all media items from Google Photos
 * This will paginate through all items
 */
export async function fetchAllMediaItems(
  accessToken: string,
  onProgress?: (count: number) => void
): Promise<MediaItem[]> {
  const allItems: MediaItem[] = [];
  let pageToken: string | undefined = undefined;

  try {
    do {
      const response: any = await axios.post(
        `${GOOGLE_PHOTOS_API_BASE}/mediaItems:search`,
        {
          pageSize: 100, // Max allowed by API
          pageToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const items = response.data.mediaItems || [];
      allItems.push(...items);

      if (onProgress) {
        onProgress(allItems.length);
      }

      pageToken = response.data.nextPageToken;
    } while (pageToken);

    return allItems;
  } catch (error) {
    console.error('Error fetching media items:', error);
    throw new Error('Failed to fetch media items from Google Photos');
  }
}

/**
 * Fetch only Live Photos from Google Photos
 */
export async function fetchLivePhotos(
  accessToken: string,
  onProgress?: (count: number) => void
): Promise<LivePhoto[]> {
  const allItems = await fetchAllMediaItems(accessToken, onProgress);
  return allItems.filter(isLivePhoto);
}

/**
 * Download a media item
 */
export async function downloadMediaItem(
  baseUrl: string,
  filename: string
): Promise<Blob> {
  try {
    // For photos, we need to append =d to download the original
    const downloadUrl = `${baseUrl}=d`;
    const response = await axios.get(downloadUrl, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    console.error('Error downloading media item:', error);
    throw new Error(`Failed to download ${filename}`);
  }
}

/**
 * Upload a media item to Google Photos
 */
export async function uploadMediaItem(
  accessToken: string,
  file: Blob,
  filename: string,
  description?: string
): Promise<string> {
  try {
    // Step 1: Upload the bytes to get an upload token
    const uploadResponse = await axios.post(
      'https://photoslibrary.googleapis.com/v1/uploads',
      file,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
          'X-Goog-Upload-File-Name': filename,
          'X-Goog-Upload-Protocol': 'raw',
        },
      }
    );

    const uploadToken = uploadResponse.data;

    // Step 2: Create the media item using the upload token
    const createResponse = await axios.post(
      `${GOOGLE_PHOTOS_API_BASE}/mediaItems:batchCreate`,
      {
        newMediaItems: [
          {
            description: description || '',
            simpleMediaItem: {
              uploadToken,
              fileName: filename,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = createResponse.data.newMediaItemResults[0];
    if (result.status.message === 'Success') {
      return result.mediaItem.id;
    } else {
      throw new Error(result.status.message);
    }
  } catch (error) {
    console.error('Error uploading media item:', error);
    throw new Error(`Failed to upload ${filename}`);
  }
}

/**
 * Delete a media item from Google Photos
 * Note: The Google Photos API doesn't support direct deletion through the API
 * This is a limitation of the API - users need to delete manually or use trash
 */
export async function deleteMediaItem(): Promise<void> {
  // Unfortunately, Google Photos Library API doesn't support deleting media items
  // The only way is to use the batch delete endpoint which requires the item to be in trash first
  // Or use the Photos Web UI
  console.warn(
    'Google Photos API does not support direct deletion. Item must be deleted manually.'
  );
  throw new Error(
    'Google Photos API does not support deletion. Please delete manually from Google Photos.'
  );
}

/**
 * Process a Live Photo conversion:
 * 1. Download the still image
 * 2. Re-upload as static image
 * 3. Note: Cannot delete original via API (must be done manually)
 */
export async function convertLivePhotoToStill(
  accessToken: string,
  livePhoto: LivePhoto,
  onProgress?: (stage: string) => void
): Promise<{ success: boolean; newItemId?: string; error?: string }> {
  try {
    // Step 1: Download the still image
    if (onProgress) onProgress('Downloading still image...');
    const stillBlob = await downloadMediaItem(
      livePhoto.baseUrl,
      livePhoto.filename
    );

    // Step 2: Upload as new still image
    if (onProgress) onProgress('Uploading still image...');
    const newFilename = livePhoto.filename.replace(
      /\.(jpg|jpeg|png)$/i,
      '_still.$1'
    );
    const newItemId = await uploadMediaItem(
      accessToken,
      stillBlob,
      newFilename,
      `Converted from Live Photo: ${livePhoto.filename}`
    );

    // Step 3: Note about deletion
    if (onProgress)
      onProgress(
        'Upload complete. Original Live Photo must be deleted manually.'
      );

    return {
      success: true,
      newItemId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error during conversion',
    };
  }
}
