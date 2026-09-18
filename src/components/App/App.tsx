import toast, { Toaster } from 'react-hot-toast';
import fetchMovies from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import type { Movie } from '../../types/movie';
import { useEffect, useState } from 'react';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

const { data, isLoading, isError, isSuccess} = useQuery({
  queryKey: ["movieName", query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: query !== "",
  placeholderData: keepPreviousData,
});
  
  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
  }
  
useEffect(() => {
  if (data && data.results.length === 0) {
    toast.error('No movies found for your request.');
  }
}, [data, isSuccess]);
  
    const handleSelect = (movie: Movie) => {
        setSelectedMovie(movie);
    }
    const handleCloseModal = () => {
        setSelectedMovie(null);
  }
  
  const totalPages = data?.total_pages ?? 0;
    return (
        <div className={css.app}>
        <Toaster/>
        <SearchBar onSubmit={handleSearch} />
        {totalPages > 0 && <ReactPaginate
pageCount={totalPages}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
onPageChange={({ selected }) => setPage(selected + 1)}
forcePage={page - 1}
containerClassName={css.pagination}
activeClassName={css.active}
nextLabel="→"
previousLabel="←"
        />} 
        
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : isSuccess && data.results.length > 0 ? (
        <MovieGrid
          onSelect={handleSelect}
          movies={data.results}
        />
      ) : null}
       
 {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
</div>
    )
}