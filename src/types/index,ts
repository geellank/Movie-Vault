// src/types/index.ts
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  name?: string;
  // Add any other properties you frequently use from TMDB
}

export interface Collection {
  id: string; // Firestore document ID
  title: string;
  movies: Movie[];
  userId: string; // Link to the user who owns this collection
  createdAt?: number; // Optional: timestamp for sorting
}