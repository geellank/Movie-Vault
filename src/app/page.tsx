// src/app/page.js

'use client'; // This directive makes the component a Client Component,
              // allowing the use of hooks like useState and useEffect.

import { useState, useEffect } from 'react'; // For managing client-side state
import Link from 'next/link';                 // For navigation
import { Collection, Movie } from '@/types';  // Your custom interfaces for type safety

// Your existing import for displaying movie results
import Results from '@/components/Results';

// The API_KEY definition. This can remain here as environment variables
// are processed during the build, even for client components.
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


export default function Home({ searchParams }) {
  // --- State for Collections (NEW) ---
  // Manages the list of movie collections created by the user
  const [collections, setCollections] = useState<Collection[]>([]);

  // --- State for Movie Results (EXISTING - now managed client-side) ---
  // Manages the movies fetched from TMDB, along with loading/error states
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [errorMovies, setErrorMovies] = useState(null);

  // --- useEffect to Load Collections from LocalStorage (NEW) ---
  // This runs once when the component mounts to load saved collections.
  useEffect(() => {
    // Ensure this code runs only in the browser environment
    if (typeof window !== 'undefined') {
      const savedCollections = localStorage.getItem('myMovieCollections');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }
    }
  }, []); // Empty dependency array means it runs only on initial mount

  // --- useEffect to Fetch Movie Data from TMDB (EXISTING - adapted for client-side) ---
  // This runs when the component mounts and re-runs if `searchParams.genre` changes.
  useEffect(() => {
    async function fetchMovies() {
      setLoadingMovies(true);  // Set loading state to true before fetching
      setErrorMovies(null);     // Clear any previous errors

      try {
        const genre = searchParams.genre || 'fetchTrending';
        const res = await fetch(
          `https://api.themoviedb.org/3${
            genre === 'fetchTopRated' ? `/movie/top_rated` : `/trending/all/week`
          }?api_key=${API_KEY}&language=en-US&page=1`
          // Note: `next: { revalidate: 10000 }` is primarily for Server Components.
          // For client-side fetch, caching is handled by the browser's default mechanisms.
        );

        if (!res.ok) {
          // If response is not OK (e.g., 401, 404, 500), throw an error
          const errorData = await res.json();
          throw new Error(errorData.status_message || 'Failed to fetch movie data');
        }

        const data = await res.json(); // Parse the JSON response
        setMovieResults(data.results);  // Update state with fetched movie results
      } catch (error) {
        // Catch any errors during the fetch operation
        console.error('Error fetching movie data:', error);
        setErrorMovies(error.message); // Set error state
      } finally {
        setLoadingMovies(false); // Set loading state to false after fetching (whether success or error)
      }
    }

    fetchMovies(); // Call the async function to fetch movies
  }, [searchParams.genre]); // Dependency array: re-run effect if 'genre' parameter changes

  return (
    <div className="container mx-auto p-4">
      {/* --- NEW: "My Collections" Section --- */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">My Collections</h2>
        {collections.length === 0 ? (
          // Display message if no collections exist
          <p className="text-gray-400">
            You haven't created any collections yet.{' '}
            <Link href="/collections" className="text-blue-400 hover:underline">
              Create one!
            </Link>
          </p>
        ) : (
          // Grid to display existing collections
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`} // Link to the specific collection's detail page
                className="block bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-xl font-semibold text-white truncate mb-2">{collection.title}</h3>
                <p className="text-gray-400 text-sm">{collection.movies.length} movies</p>
                {/* Visual preview of movies in the collection (up to 3 posters) */}
                <div className="flex -space-x-2 overflow-hidden mt-2">
                  {collection.movies.slice(0, 3).map((movie) =>
                    movie.poster_path ? (
                      <img
                        key={movie.id}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-gray-900 object-cover"
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        title={movie.title}
                      />
                    ) : (
                      <div // Placeholder if no poster is available
                        key={movie.id}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-gray-900 bg-gray-600 flex items-center justify-center text-xs text-white"
                      >
                        No Poster
                      </div>
                    )
                  )}
                  {/* Indicate if there are more than 3 movies */}
                  {collection.movies.length > 3 && (
                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-gray-900 bg-gray-700 flex items-center justify-center text-xs text-white">
                      +{collection.movies.length - 3}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Horizontal rule for visual separation */}
      <hr className="border-gray-700 my-8" />

      {/* --- EXISTING: Trending Movies Section --- */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-4">Trending Movies</h2>
        {loadingMovies ? (
          // Show loading message while fetching movies
          <p className="text-white">Loading movies...</p>
        ) : errorMovies ? (
          // Show error message if movie fetching failed
          <p className="text-red-500">Error: {errorMovies}</p>
        ) : (
          // Render the Results component with fetched movies
          <Results results={movieResults} />
        )}
      </section>
    </div>
  );
}