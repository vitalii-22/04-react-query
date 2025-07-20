import axios from "axios";
import type { Movie } from "../types/movie";
interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

const myToken = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (movieTitle: string, page: number) => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?`,
    {
      params: {
        query: movieTitle,
        page,
      },
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    }
  );
  return response.data;
};
