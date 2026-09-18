import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[],
  total_pages: number,
}

const URL = 'https://api.themoviedb.org/3/search/movie';

export default async function fetchMovies(query: string, page: number): Promise<FetchMoviesResponse> {

  const myKey = import.meta.env.VITE_TMDB_TOKEN;
  const response = await axios.get<FetchMoviesResponse>(URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  })
return {
  results: response.data.results,
  total_pages: response.data.total_pages,
};
}