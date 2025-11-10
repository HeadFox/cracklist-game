import { create } from 'zustand';
import type { AppState, LivePhoto, PhotoDecision } from '../types/photos';

interface PhotoStore extends AppState {
  // Authentication
  setAccessToken: (token: string | null) => void;
  logout: () => void;

  // Loading and data
  setLivePhotos: (photos: LivePhoto[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPhase: (phase: AppState['phase']) => void;

  // Navigation
  nextPhoto: () => void;
  previousPhoto: () => void;
  goToPhoto: (index: number) => void;

  // Review actions
  addReview: (decision: PhotoDecision) => void;
  updateReview: (index: number, decision: PhotoDecision) => void;
  clearReviews: () => void;

  // Processing
  setProcessedCount: (count: number) => void;
  incrementProcessedCount: () => void;

  // Reset
  reset: () => void;
}

const initialState: AppState = {
  phase: 'login',
  accessToken: null,
  livePhotos: [],
  currentIndex: 0,
  reviews: [],
  isLoading: false,
  error: null,
  totalPhotos: 0,
  processedCount: 0,
};

export const usePhotoStore = create<PhotoStore>((set, get) => ({
  ...initialState,

  // Authentication
  setAccessToken: (token) => set({ accessToken: token, phase: token ? 'loading' : 'login' }),

  logout: () => set({ ...initialState }),

  // Loading and data
  setLivePhotos: (photos) =>
    set({
      livePhotos: photos,
      totalPhotos: photos.length,
      phase: photos.length > 0 ? 'gallery' : 'loading',
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  setPhase: (phase) => set({ phase }),

  // Navigation
  nextPhoto: () => {
    const { currentIndex, livePhotos } = get();
    if (currentIndex < livePhotos.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  previousPhoto: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToPhoto: (index) => {
    const { livePhotos } = get();
    if (index >= 0 && index < livePhotos.length) {
      set({ currentIndex: index });
    }
  },

  // Review actions
  addReview: (decision) => {
    const { livePhotos, currentIndex, reviews } = get();
    const mediaItem = livePhotos[currentIndex];

    if (mediaItem) {
      const existingReviewIndex = reviews.findIndex(
        (r) => r.mediaItem.id === mediaItem.id
      );

      if (existingReviewIndex >= 0) {
        // Update existing review
        const newReviews = [...reviews];
        newReviews[existingReviewIndex] = { mediaItem, decision };
        set({ reviews: newReviews });
      } else {
        // Add new review
        set({ reviews: [...reviews, { mediaItem, decision }] });
      }
    }
  },

  updateReview: (index, decision) => {
    const { reviews } = get();
    if (index >= 0 && index < reviews.length) {
      const newReviews = [...reviews];
      newReviews[index] = { ...newReviews[index], decision };
      set({ reviews: newReviews });
    }
  },

  clearReviews: () => set({ reviews: [] }),

  // Processing
  setProcessedCount: (count) => set({ processedCount: count }),

  incrementProcessedCount: () =>
    set((state) => ({ processedCount: state.processedCount + 1 })),

  // Reset
  reset: () => set(initialState),
}));
