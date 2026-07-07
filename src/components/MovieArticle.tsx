import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { Review } from "../pages/MovieDetailsPage";

interface MovieArticleProps {
  id: number;
  title: string;
  genres?: { id: number; name: string }[];
  release_date: string;
  poster_path: string;
  likesCount: number;
  rating: number;
  likedByUser: boolean;
  onLike: (likedByUser: boolean, id: number) => void;
}

function MovieArticle({
  id,
  title,
  release_date,
  poster_path,
  genres = [],
  likesCount,
  likedByUser,
  onLike,
}: MovieArticleProps) {
  const token = localStorage.getItem("token");
  const baseUrl = "http://localhost:3000/";
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  async function getReviews() {
    try {
      const response = await fetch(baseUrl + "reviews/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        setReviews([]);
        return;
      }

      console.log(data);
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getReviews();
  }, [user]);
  return (
    <article key={id}>
      <img
        src={`https://image.tmdb.org/t/p/w300/${poster_path}`}
        alt="Poster-bild"
      />
      <h3>
        <Link className="postTitles" to={`/movies/${id}`}>
          {title}
        </Link>
      </h3>
      <p>Utgivningsdatum: {release_date}</p>
      <p>Genrer: {genres.map((g) => g.name).join(", ")}</p>

      <div>
        {user && (
          <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            onClick={() => onLike(likedByUser, id)}
            icon={likedByUser ? faHeartSolid : faHeartRegular}
          />
        )}

        <span>{likesCount}</span>
      </div>
      <span>{averageRating}/ 5</span>

      <br />

      <Link className="showContentLinks" to={`/movies/${id}`}>
        Visa innehåll
      </Link>
    </article>
  );
}

export default MovieArticle;
