import { useEffect, useState } from "react";
import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";

import type { Movie } from "../../types/movie";

import toast, { Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", movieTitle, currentPage],
    queryFn: () => fetchMovies(movieTitle, currentPage),
    enabled: movieTitle !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request");
    }
  }, [data]);

  const handleValue = (title: string) => {
    setMovieTitle(title);
    setCurrentPage(1);
  };

  const closeMovieModal = () => {
    setMovie(null);
  };

  const handleClickCard = (objectMovie: Movie) => {
    setMovie(objectMovie);
  };

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleValue} />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data !== undefined && data.results.length > 0 && (
        <MovieGrid onSelect={handleClickCard} movies={data.results} />
      )}
      {movie !== null && <MovieModal movie={movie} onClose={closeMovieModal} />}
    </>
  );
}

export default App;
