// Google Photos API types

export interface MediaItem {
  id: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: MediaMetadata;
  filename: string;
}

export interface MediaMetadata {
  creationTime: string;
  width: string;
  height: string;
  photo?: PhotoMetadata;
  video?: VideoMetadata;
}

export interface PhotoMetadata {
  cameraMake?: string;
  cameraModel?: string;
  focalLength?: number;
  apertureFNumber?: number;
  isoEquivalent?: number;
  exposureTime?: string;
}

export interface VideoMetadata {
  cameraMake?: string;
  cameraModel?: string;
  fps?: number;
  status?: string;
}

// Live Photo is a media item that has both photo and video metadata
export interface LivePhoto extends MediaItem {
  mediaMetadata: MediaMetadata & {
    photo: PhotoMetadata;
    video: VideoMetadata;
  };
}

// User decision for each Live Photo
export type PhotoDecision = 'keep' | 'convert' | 'skip';

export interface PhotoReview {
  mediaItem: LivePhoto;
  decision: PhotoDecision;
}

// App state
export type AppPhase = 'login' | 'loading' | 'gallery' | 'review' | 'processing';

export interface AppState {
  phase: AppPhase;
  accessToken: string | null;
  livePhotos: LivePhoto[];
  currentIndex: number;
  reviews: PhotoReview[];
  isLoading: boolean;
  error: string | null;
  totalPhotos: number;
  processedCount: number;
}

// Google OAuth response
export interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
