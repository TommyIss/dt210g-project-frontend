import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegular } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ReviewForm from "./ReviewForm";
import type { Review } from "../pages/MovieDetailsPage";
import { useAuth } from "../context/AuthContext";

interface ReviewItemProps {
  review: Review;
  onDelete: (id: number) => void;
  onLike: (id: number, liked: boolean) => void;
  currentUserId?: number;
  updateReview: (id: number, text: string, rating: number) => Promise<boolean>;
}

function ReviewItem({
  review,
  onDelete,
  onLike,
  currentUserId,
  updateReview,
}: ReviewItemProps) {
  const [formType, setFormType] = useState<string | null>(null);

  const { user } = useAuth();

  if (formType === "update") {
    return (
      <ReviewForm
        setFormType={setFormType}
        formType={"update"}
        updateReview={updateReview}
        createReview={async () => false}
        initialReview={review}
      />
    );
  }
  return (
    <div className="review" key={review.id}>
      <p>
        <strong>
          {review.user.firstname} {review.user.lastname}
        </strong>
      </p>
      <p>{review.text}</p>
      <p>Betyg: {review.rating}</p>
      <div>
        {user && <FontAwesomeIcon
          icon={review.likedByUser ? faSolid : faRegular}
          style={{ cursor: "pointer" }}
          onClick={() => onLike(review.id, review.likedByUser)}
        />}
        <span>Antal-likes: {review.likesCount ?? 0}</span>
      </div>

      {(currentUserId === review.user.id || user?.role === 'admin') && (
        <div>
          <button onClick={() => setFormType("update")}>Ändra</button>
          <button onClick={() => onDelete(review.id)}>Radera</button>
        </div>
      )}
      <hr />
    </div>
  );
}

export default ReviewItem;
