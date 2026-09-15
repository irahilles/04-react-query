import axios from "axios";
import type {Movie} from '../types/movie';

interface FetchMoviesResponse{
    results: Movie[];
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';

export default async function fetchMovies(query: string):Promise<Movie[]>{
const myKey = import.meta.env.VITE_TMDB_TOKEN;
 const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: {
      query,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
 })
 return response.data.results;
}