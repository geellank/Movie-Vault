// src/app/movie/[id]/page.jsx

'use client'; // This directive makes the component a Client Component

import { useState, useEffect } from 'react'; // Import hooks for client-side state
import Image from 'next/image'; // Keep your existing Image import
import Link from 'next/link';   // Import Link for navigation
// In a .jsx file, you typically don't import types directly for runtime functionality,
// but they serve as documentation and for editor hints if you have JSDoc comments.
// For simplicity and avoiding TypeScript errors in a .jsx file, we'll remove the explicit type import here.
// If you still want editor hints, you'd use JSDoc:
// /** @typedef {import('@/types').Movie} Movie */
// /** @typedef {import('@/types').Collection} Collection */


export default function MoviePage({ params }) {
  const movieId = params.id;

  // --- State for the current movie details ---
  // Managed client-side now, without explicit TypeScript types
  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [errorMovie, setErrorMovie] = useState(null);

  // --- State to manage existing collections ---
  const [collections, setCollections] = useState([]);

  // --- State to control the visibility of the "Add to Collection" modal/dropdown ---
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);

  // --- useEffect to fetch movie details (adapted for client-side) ---
  useEffect(() => {
    async function fetchMovieDetails() {
      setLoadingMovie(true);
      setErrorMovie(null);
      try {
        // Use NEXT_PUBLIC_API_KEY for client-side access
        const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

        // Basic validation for API_KEY
        if (!API_KEY) {
          throw new Error("TMDB API Key is not configured. Please check your .env.local file.");
        }

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.status_message || 'Failed to fetch movie details');
        }

        const data = await res.json();
        // Set movie data directly; shape should conform to what you expect from TMDB
        setMovie({
          id: data.id,
          title: data.title || data.name || 'Untitled',
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          overview: data.overview,
          release_date: data.release_date,
          first_air_date: data.first_air_date,
          vote_count: data.vote_count,
        });
      } catch (error) {
        console.error('Error fetching movie details:', error);
        // Cast error to ensure it has a message property for display
        setErrorMovie(error instanceof Error ? error.message : String(error));
      } finally {
        setLoadingMovie(false);
      }
    }

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  // --- useEffect to Load Collections from LocalStorage ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollections = localStorage.getItem('myMovieCollections');
      if (savedCollections) {
        try {
          setCollections(JSON.parse(savedCollections));
        } catch (e) {
          console.error("Error parsing collections from localStorage", e);
          setCollections([]); // Reset if parsing fails
        }
      }
    }
  }, []);

  // --- Function to add movie to a collection ---
  const addMovieToCollection = (collectionId) => {
    if (!movie) return;

    const updatedCollections = collections.map(col => {
      if (col.id === collectionId) {
        if (!col.movies.some(m => m.id === movie.id)) {
          return { ...col, movies: [...col.movies, movie] };
        }
      }
      return col;
    });

    setCollections(updatedCollections);
    if (typeof window !== 'undefined') {
      localStorage.setItem('myMovieCollections', JSON.stringify(updatedCollections));
    }
    setShowAddToCollectionModal(false);
    alert(`${movie.title || movie.name} added to collection!`);
  };

  // --- Function to create a new collection and add the movie ---
  const createNewCollectionAndAddMovie = () => {
    if (!movie) return;
    const title = prompt("Enter new collection title:");
    if (title) {
      const newCollection = {
        id: Date.now().toString(),
        title: title,
        movies: [movie]
      };
      const updatedCollections = [...collections, newCollection];
      setCollections(updatedCollections);
      if (typeof window !== 'undefined') {
        localStorage.setItem('myMovieCollections', JSON.stringify(updatedCollections));
      }
      setShowAddToCollectionModal(false);
      alert(`${movie.title || movie.name} added to new collection "${title}"!`);
    }
  };

  // --- Loading and Error States for Movie Details ---
  if (loadingMovie) {
    return <div className="text-white text-center p-8">Loading movie details...</div>;
  }
  if (errorMovie) {
    return <div className="text-red-500 text-center p-8">Error loading movie: {errorMovie}</div>;
  }
  if (!movie) {
    return <div className="text-gray-400 text-center p-8">Movie not found.</div>;
  }

  // --- Render the Movie Details and "Add to Collection" UI ---
  return (
    <div className='w-full'>
      <div className='p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6'>
        {/* Movie Poster/Backdrop Image */}
        {movie.poster_path || movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original/${
              movie.backdrop_path || movie.poster_path
            }`}
            width={500}
            height={300}
            className='rounded-lg'
            style={{ maxWidth: '100%', height: '100%' }}
            alt={movie.title || movie.name || 'Movie Poster'}
          ></Image>
        ) : (
          <div className="w-full md:w-1/3 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-center h-[300px] md:h-auto">
            No Image Available
          </div>
        )}

        {/* Movie Information */}
        <div className='p-2'>
          <h2 className='text-lg mb-3 font-bold'>
            {movie.title || movie.name || 'Unknown Title'}
          </h2>
          <p className='text-lg mb-3'>{movie.overview || 'No overview available.'}</p>
          <p className='mb-3'>
            <span className='font-semibold mr-1'>Date Released:</span>
            {movie.release_date || movie.first_air_date || 'N/A'}
          </p>
          <p className='mb-3'>
            <span className='font-semibold mr-1'>Rating:</span>
            {movie.vote_count ? `${movie.vote_count} votes` : 'N/A'}
          </p>

          {/* "Add to Collection" Button */}
          <button
            onClick={() => setShowAddToCollectionModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add to Collection
          </button>
        </div>
      </div>

      {/* --- "Add to Collection" Modal/Dropdown --- */}
      {showAddToCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-white">Add &quot;{movie.title || movie.name}&quot; to Collection</h3>
            {collections.length === 0 ? (
              <p className="text-gray-400 mb-4">You have no collections yet. Create a new one!</p>
            ) : (
              <div className="mb-4">
                <p className="font-semibold mb-2 text-white">Select an existing collection:</p>
                {collections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => addMovieToCollection(col.id)}
                    className="block w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded mb-2 text-white transition-colors duration-200"
                  >
                    {col.title} ({col.movies.length} movies)
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={createNewCollectionAndAddMovie}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 transition-colors duration-200"
            >
              + Create New Collection
            </button>
            <button
              onClick={() => setShowAddToCollectionModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}