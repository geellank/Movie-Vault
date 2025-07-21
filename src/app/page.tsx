'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Results from '@/components/Results';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function Home({ searchParams }: { searchParams: { genre?: string } }) {
  const [collections, setCollections] = useState<any[]>([]);
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [errorMovies, setErrorMovies] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollections = localStorage.getItem('myMovieCollections');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }
    }
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      setLoadingMovies(true);
      setErrorMovies(null);

      try {
        const genre = searchParams.genre || 'fetchTrending';
        const res = await fetch(
          `https://api.themoviedb.org/3${
            genre === 'fetchTopRated' ? `/movie/top_rated` : `/trending/all/week`
          }?api_key=${API_KEY}&language=en-US&page=1`
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.status_message || 'Failed to fetch movie data');
        }

        const data = await res.json();
        setMovieResults(data.results);
      } catch (error: any) {
        console.error('Error fetching movie data:', error);
        setErrorMovies(error.message);
      } finally {
        setLoadingMovies(false);
      }
    }

    fetchMovies();
  }, [searchParams.genre]);

  return (
    <div className="container mx-auto p-4">
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">My Collections</h2>
        {collections.length === 0 ? (
          <p className="text-gray-400">
            You haven&apos;t created any collections yet.{' '}
            <Link href="/collections" className="text-blue-400 hover:underline">
              Create one!
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="block bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-xl font-semibold text-white truncate mb-2">{collection.title}</h3>
                <p className="text-gray-400 text-sm">{collection.movies.length} movies</p>
                <div className="flex -space-x-2 overflow-hidden mt-2">
                  {collection.movies.slice(0, 3).map((movie) =>
                    movie.poster_path ? (
                      <Image
                        key={movie.id}
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        title={movie.title}
                        width={40}
                        height={40}
                        className="inline-block rounded-full ring-2 ring-gray-900 object-cover"
                      />
                    ) : (
                      <div
                        key={movie.id}
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-gray-900 bg-gray-600 flex items-center justify-center text-xs text-white"
                      >
                        No Poster
                      </div>
                    )
                  )}
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

      <hr className="border-gray-700 my-8" />

      <section>
        <h2 className="text-3xl font-bold text-white mb-4">Trending Movies</h2>
        {loadingMovies ? (
          <p className="text-white">Loading movies...</p>
        ) : errorMovies ? (
          <p className="text-red-500">Error: {errorMovies}</p>
        ) : (
          <Results results={movieResults} />
        )}
      </section>
    </div>
  );
}
