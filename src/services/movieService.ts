import axios from "axios";
import type {Movie} from '../types/movie';

interface FetchMoviesResponse{
  results: Movie[],
  total_pages: number,
}

interface FetchMoviesResult{
results: Movie[];
total_pages: number;
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';

export default async function fetchMovies(query: string, page: number):Promise<FetchMoviesResult>{
const myKey = import.meta.env.VITE_TMDB_TOKEN;
 const response = await axios.get<FetchMoviesResponse>(API_URL, {
   params: {
      page,
     query,
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