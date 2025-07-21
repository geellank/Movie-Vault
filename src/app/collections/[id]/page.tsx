'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection, Movie } from '@/types';
import { useRouter } from 'next/navigation';

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collectionId = params.id;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Perbaikan: useCallback agar bisa masuk dependency useEffect
  const loadCollectionFromLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined' && collectionId) {
      try {
        const savedCollections = localStorage.getItem('myMovieCollections');
        if (savedCollections) {
          const collections: Collection[] = JSON.parse(savedCollections);
          const foundCollection = collections.find(col => col.id === collectionId);
          if (foundCollection) {
            setCollection(foundCollection);
          } else {
            setError('Collection not found.');
          }
        } else {
          setError('No collections saved.');
        }
      } catch (e: any) {
        console.error('Error loading collections from localStorage:', e);
        setError('Failed to load collections.');
      } finally {
        setLoading(false);
      }
    }
  }, [collectionId]);

  useEffect(() => {
    loadCollectionFromLocalStorage();
  }, [loadCollectionFromLocalStorage]);

  const handleRemoveMovie = (movieIdToRemove: number) => {
    if (!collection) return;

    const updatedMovies = collection.movies.filter(movie => movie.id !== movieIdToRemove);
    const updatedCollection = { ...collection, movies: updatedMovies };
    setCollection(updatedCollection);

    if (typeof window !== 'undefined') {
      const savedCollections: Collection[] = JSON.parse(
        localStorage.getItem('myMovieCollections') || '[]'
      );
      const newCollections = savedCollections.map(col =>
        col.id === collectionId ? updatedCollection : col
      );
      localStorage.setItem('myMovieCollections', JSON.stringify(newCollections));
    }

    alert('Movie removed from collection!');
  };

  const handleDeleteCollection = () => {
    if (!collection) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete the collection "${collection.title}"? This cannot be undone.`
    );

    if (confirmDelete) {
      if (typeof window !== 'undefined') {
        try {
          const savedCollections: Collection[] = JSON.parse(
            localStorage.getItem('myMovieCollections') || '[]'
          );

          const newCollections = savedCollections.filter(col => col.id !== collectionId);
          localStorage.setItem('myMovieCollections', JSON.stringify(newCollections));
          alert(`Collection "${collection.title}" deleted successfully!`);
          router.push('/');
        } catch (e) {
          console.error('Error deleting collection:', e);
          alert('Failed to delete collection. Please try again.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center p-8">Loading collection...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  if (!collection) {
    return (
      <div className="text-gray-400 text-center p-8">Collection not found.</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">{collection.title}</h1>
        <button
          onClick={handleDeleteCollection}
          className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          aria-label={`Delete collection ${collection.title}`}
        >
          Delete Collection
        </button>
      </div>
      <p className="text-gray-400 text-lg mb-8">
        {collection.movies.length} movies
      </p>

      {collection.movies.length === 0 ? (
        <p className="text-gray-400">
          This collection is empty. Add some movies from their detail pages!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {collection.movies.map(movie => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-200"
            >
              <Link href={`/movie/${movie.id}`}>
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    width={300}
                    height={450}
                    alt={movie.title || movie.name || 'Movie Poster'}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-[450px] bg-gray-700 flex items-center justify-center text-gray-400 text-center text-sm">
                    No Poster
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate mb-1">
                    {movie.title || movie.name || 'Untitled'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {movie.release_date || movie.first_air_date
                      ? `Released: ${movie.release_date || movie.first_air_date}`
                      : 'Date N/A'}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleRemoveMovie(movie.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 mt-2 transition-colors duration-200"
                aria-label={`Remove ${movie.title || movie.name} from collection`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
