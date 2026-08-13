import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Movie } from "./MoviesPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import Notification from "../components/Notification";
import Breadcrumbs from "../components/Breadcrumbs";

interface MovieDetails extends Movie {
  overview: string;
}

export interface Review {
  id: number;
  movieId: number;
  text: string;
  rating: number;
  created_at: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  likesCount: number;
  likedByUser: boolean;
}

function MovieDetailsPage() {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview] = useState<Review | null>(null);
  const baseUrl = "https://tois-dt210g-project-webservice.onrender.com/";

  const { user } = useAuth();
  const location = useLocation();
  const [formType, setFormType] = useState<string | null>(null);
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const userHasReview = reviews.some((r) => r.user.id === user?.id);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function showNotification(
    message: string,
    type: "success" | "error" = "success",
  ) {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  useEffect(() => {
    getMovieDetails();
    getReviews();
    localStorage.setItem("pathname", location.pathname);
  }, [id, user]);

  async function getMovieDetails() {
    try {
      const response = await fetch(baseUrl + "movies/" + id, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setMovie(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function likeOrUnlikeMovie(likedByUser: boolean, id: number) {
    try {
      let url = `https://tois-dt210g-project-webservice.onrender.com/movie-like/${id}/like`;
      let method = likedByUser ? "DELETE" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        showNotification("Ett fel vid like av film", "error");
        throw new Error("Ett fel vid like av film");
      }
      if (method === "DELETE") {
        showNotification("Du har slutat gilla filmen", "success");
      }
      if (method === "POST") {
        showNotification("Du har gillat filmen", "success");
      }

      getMovieDetails();
    } catch (err) {
      console.error(err);
      showNotification("Ett fel vid like av film", "error");
    }
  }

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

      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function createReview(text: string, rating: number) {
    try {
      const response = await fetch(baseUrl + "reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: Number(id),
          text,
          rating,
        }),
      });

      if (response.ok) {
        showNotification("Recension har skapats!", "success");
        getReviews();
        return true;
      }

      showNotification("Ett fel vid skapandet av recension!", "error");
      return false;
    } catch (error) {
      console.error(error);

      showNotification(
        "Ett oförväntat fel vid skapandet av recension!",
        "error",
      );
      return false;
    }
  }

  async function updateReview(id: number, text: string, rating: number) {
    try {
      if (!text || text === "") {
        return false;
      }
      if (!rating || rating < 1 || rating > 5) {
        return false;
      }

      const response = await fetch(baseUrl + "reviews/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, rating }),
      });

      if (!response.ok) {
        showNotification("Ett fel vid uppdatering av recension!", "error");
        return false;
      }

      showNotification("Recension har uppdaterats!", "success");
      getReviews();

      return true;
    } catch (error) {
      console.error(error);
      showNotification("Ett fel vid skapandet av recension!", "error");
      return false;
    }
  }

  async function deleteReview(id: number) {
    try {
      const confirm = window.confirm("Är du säker på att ta bort recensionen?");
      if (!confirm) return;

      const response = await fetch(baseUrl + "reviews/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showNotification("Recension har raderats!", "success");
        setReviews((prev) => prev.filter((review) => review.id !== id));
      } else {
        showNotification("Ett fel vid radering av recension!", "error");
        return;
      }
    } catch (error) {
      console.error(error);
      showNotification("Ett fel vid radering av recension!", "error");
    }
  }

  async function likeUnlikeReview(reviewId: number, liked: boolean) {
    try {
      const method = liked ? "DELETE" : "POST";
      const response = await fetch(baseUrl + `review-like/${reviewId}/like`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (method === "DELETE") {
          showNotification("Du har slutat gilla recension!", "success");
        }
        if (method === "POST") {
          showNotification("Du har gillat recension!", "success");
        }
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  likedByUser: !liked,
                  likesCount: (review.likesCount ?? 0) + (liked ? -1 : 1),
                }
              : review,
          ),
        );
      } else {
        showNotification("Ett fel vid like av recension!", "error");
        return;
      }
    } catch (error) {
      console.error(error);

      showNotification("Ett oförväntat fel vid like av recension!", "error");
    }
  }

  return (
    <section>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Breadcrumbs pageLabel="Alla filmer" itemLabel={movie?.title} />
      <h2>{movie?.title}</h2>

      {!movie && <p>laddar...</p>}

      <div className="movie">
        <div className="movieDetails">
          <h3>Titel: {movie?.title}</h3>
          <p>
            <strong>Utgivningsdatum: </strong>
            {movie?.release_date}
          </p>
          <p>
            <strong>Genrer:</strong>
            {movie?.genres?.map((g) => g.name).join(", ")}
          </p>

          <p style={{ maxWidth: "30ch" }}>
            <strong>Översikt:</strong> {movie?.overview}
          </p>

          <span>
            <strong>Betyg: </strong>
            {averageRating ?? "Inga betyg"} / 5
          </span>
          <div>
            {user && (
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                onClick={() =>
                  movie && likeOrUnlikeMovie(movie.likedByUser, Number(id))
                }
                icon={movie?.likedByUser ? faHeartSolid : faHeartRegular}
              />
            )}

            <span>Antal-likes: {movie?.likesCount}</span>
          </div>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w300/${movie?.poster_path}`}
          alt="Poster-bild"
        />
      </div>

      <hr />

      <h3>Recensioner</h3>
      {user && !userHasReview && (
        <div>
          <button onClick={() => setFormType("create")}>
            Skriv en recension
          </button>
        </div>
      )}

      {formType === "create" && (
        <ReviewForm
          formType={"create"}
          updateReview={async () => false}
          createReview={createReview}
          setFormType={setFormType}
          initialReview={null}
        />
      )}
      <hr />

      {formType === "update" && selectedReview && (
        <ReviewForm
          formType={"update"}
          createReview={async () => false}
          updateReview={updateReview}
          initialReview={selectedReview}
        />
      )}

      <hr />
      {!reviews || reviews.length === 0 ? (
        <p>Inga recensioner har skapats för denna film!</p>
      ) : null}
      {reviews &&
        reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            onDelete={deleteReview}
            currentUserId={user?.id}
            onLike={likeUnlikeReview}
            updateReview={updateReview}
          />
        ))}
    </section>
  );
}

export default MovieDetailsPage;
