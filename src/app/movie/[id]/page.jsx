'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MoviePage({ params }) {
  const movieId = params.id;

  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [errorMovie, setErrorMovie] = useState(null);
  const [collections, setCollections] = useState([]);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);

  useEffect(() => {
    async function fetchMovieDetails() {
      setLoadingMovie(true);
      setErrorMovie(null);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
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
        setErrorMovie(error instanceof Error ? error.message : String(error));
      } finally {
        setLoadingMovie(false);
      }
    }

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollections = localStorage.getItem('myMovieCollections');
      if (savedCollections) {
        try {
          setCollections(JSON.parse(savedCollections));
        } catch (e) {
          console.error("Error parsing collections from localStorage", e);
          setCollections([]);
        }
      }
    }
  }, []);

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

  if (loadingMovie) {
    return <div className="text-white text-center p-8">Loading movie details...</div>;
  }
  if (errorMovie) {
    return <div className="text-red-500 text-center p-8">Error loading movie: {errorMovie}</div>;
  }
  if (!movie) {
    return <div className="text-gray-400 text-center p-8">Movie not found.</div>;
  }

  return (
    <div className='w-full'>
      <div className='p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6'>
        {movie.poster_path || movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`}
            width={500}
            height={300}
            className='rounded-lg'
            style={{ maxWidth: '100%', height: '100%' }}
            alt={movie.title || movie.name || 'Movie Poster'}
          />
        ) : (
          <div className="w-full md:w-1/3 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-center h-[300px] md:h-auto">
            No Image Available
          </div>
        )}

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

          <button
            onClick={() => setShowAddToCollectionModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add to Collection
          </button>
        </div>
      </div>

      {showAddToCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Add {"\""}{movie.title || movie.name}{"\""} to Collection
            </h3>
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
