import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import { Toaster, toast} from 'react-hot-toast';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { useState, useEffect } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";


type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;


export default function App(){
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: ()=>fetchMovies(query, page),
        enabled: query !== "",
        placeholderData: keepPreviousData,
    })
    
    const handleSearch = (query: string) => {
        setQuery(query);
        setPage(1);
    }

useEffect(() => {
  if (data && data.results.length === 0) {
    toast.error('No movies found for your request.');
  }
}, [data]);

const handleSelect = (movie: Movie) => {
  setSelectedMovie(movie);
};

const handleCloseModal = () => {
  setSelectedMovie(null);
    };
    const totalPages = data?.total_pages ?? 0;
    
return(
    <div className={css.app}>
        <Toaster/>
        <SearchBar onSubmit={handleSearch} />
{totalPages > 1 && (
  <ReactPaginate
    pageCount={totalPages}
    pageRangeDisplayed={5}
    marginPagesDisplayed={1}
    onPageChange={({ selected }) => setPage(selected + 1)}
    forcePage={page - 1}
    containerClassName={css.pagination}
    activeClassName={css.active}
    nextLabel="→"
    previousLabel="←"
  />
)}
{isLoading ? (
  <Loader />
) : isError ? (
  <ErrorMessage />
) : (
  data?.results && data.results.length > 0 && (
    <MovieGrid
      movies={data.results}
      onSelect={handleSelect}
    />
  )
)}
{selectedMovie && (
  <MovieModal
    movie={selectedMovie}
    onClose={handleCloseModal}
  />
)}
    </div>
)
}
