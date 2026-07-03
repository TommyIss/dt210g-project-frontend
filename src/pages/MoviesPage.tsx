import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieArticle from "../components/MovieArticle";

export interface Movie {
  id: number;
  title: string;
  genres?: { id: number; name: string }[];
  release_date: string;
  poster_path: string;
  likesCount: number;
  rating: number;
  likedByUser: boolean;
}

function MoviesPage() {

  const token = localStorage.getItem("token");
  const [movies, setMovies] = useState<Movie[]>([]);
  const tmdbToken = import.meta.env.VITE_TMDB_TOKEN;

  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("Alla");

  const filtredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchPhrase.toLowerCase()),
    )
    .filter((movie) =>
      selectedGenre === "Alla"
        ? true
        : movie.genres?.some((g) => g.name === selectedGenre),
    );

  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    getMovies();
    localStorage.setItem("pathname", location.pathname);
  }, [user]);

  async function getMoviesFromTMDB(pages: number) {
    try {
      const requests = [];

      for (let p = 1; p <= pages; p++) {
        requests.push(
          fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${p}&sort_by=popularity.desc`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tmdbToken}`,
              },
            },
          ).then((res) => res.json()),
        );
      }

      const results = await Promise.all(requests);

      return results.flatMap((r) => r.results.map((m: { id: number}) => m.id));
    } catch (err) {
      console.error(err);
    }
  }

  async function getMoviesFromApi(ids: number[]): Promise<Movie[]> {
    try {
      const movies = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch("http://localhost:3000/movies/" + id, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) return null;

          const data = await response.json();
          return data as Movie;
        }),
      );

      return movies.filter(Boolean) as Movie[];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function getMovies() {
    try {
      const ids = await getMoviesFromTMDB(5);
      if (!ids) return;

      const movies = await getMoviesFromApi(ids);
      
      setMovies(movies);
    } catch (err) {
      console.error(err);
    }
  }

  const uniqueGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genres?.map((g) => g.name) ?? [])),
  );

  async function likeOrUnlikeMovie(likedByUser: boolean, id: number) {
    try {
      console.log(likedByUser);
      let url = `http://localhost:3000/movie-like/${id}/like`;
      let method = likedByUser ? "DELETE" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ett fel vid like av film");
      }

      // getMovies();
      setMovies((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                likedByUser: !likedByUser,
                likesCount: m.likesCount + (likedByUser ? -1 : 1),
              }
            : m,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Filmer</h2>

      <hr />
      <label htmlFor="search">Sök film:</label>
      <input
        type="text"
        id="search"
        value={searchPhrase}
        onChange={(e) => setSearchPhrase(e.target.value)}
      />

      <label htmlFor="genre">Filtrera efter genre:</label>
      <select
        name="genre"
        id="genre"
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <option value="Alla">Alla</option>
        {uniqueGenres.map((genre) => (
          <option value={genre} key={genre}>
            {genre}
          </option>
        ))}
      </select>
      <hr />
      <span>
        Visar {filtredMovies.length} av {movies.length}
      </span>
      <div className="flex-container">
        {filtredMovies.length === 0 && <p>Inga filmer har lagts till</p>}
        {filtredMovies.map((movie) => (
          <MovieArticle
            key={movie.id}
            id={movie.id}
            title={movie.title}
            release_date={movie.release_date}
            poster_path={movie.poster_path}
            rating={movie.rating}
            likesCount={movie.likesCount}
            likedByUser={movie.likedByUser}
            onLike={likeOrUnlikeMovie}
            genres={movie.genres}
          />
        ))}
      </div>
    </div>
  );
}

export default MoviesPage;
