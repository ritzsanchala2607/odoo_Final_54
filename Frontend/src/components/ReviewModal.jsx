// import React, { useState } from "react";
// import Button from "./Button";

// const ReviewModal = ({ booking, onSubmit, onClose }) => {
//   const [rating, setRating] = useState(0);
//   const [hoveredRating, setHoveredRating] = useState(0);
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (rating === 0) {
//       alert("Please provide a rating");
//       return;
//     }

//     if (!title.trim()) {
//       alert("Please provide a review title");
//       return;
//     }

//     if (!body.trim()) {
//       alert("Please provide a review description");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await onSubmit({
//         rating,
//         title: title.trim(),
//         body: body.trim(),
//       });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       alert("Error submitting review. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleStarClick = (value) => {
//     setRating(value);
//   };

//   const handleStarHover = (value) => {
//     setHoveredRating(value);
//   };

//   const handleStarLeave = () => {
//     setHoveredRating(0);
//   };

//   const StarRating = () => {
//     return (
//       <div className="star-rating">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             className={`star-button ${
//               star <= (hoveredRating || rating) ? "star-filled" : "star-empty"
//             }`}
//             onClick={() => handleStarClick(star)}
//             onMouseEnter={() => handleStarHover(star)}
//             onMouseLeave={handleStarLeave}
//           >
//             <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//             </svg>
//           </button>
//         ))}
//       </div>
//     );
//   };

//   const getRatingText = (rating) => {
//     switch (rating) {
//       case 1:
//         return "Poor";
//       case 2:
//         return "Fair";
//       case 3:
//         return "Good";
//       case 4:
//         return "Very Good";
//       case 5:
//         return "Excellent";
//       default:
//         return "Rate your experience";
//     }
//   };

//   if (!booking) return null;

//   return (
//     <div className="modal-overlay review-modal-overlay">
//       <div className="modal-content review-modal">
//         <div className="modal-header">
//           <h2>Write a Review</h2>
//           <button className="close-button" onClick={onClose} type="button">
//             &times;
//           </button>
//         </div>

//         <div className="modal-body">
//           <div className="booking-info">
//             <div className="venue-info">
//               <img
//                 src={booking.venueImage}
//                 alt={booking.venueName}
//                 className="venue-thumbnail"
//               />
//               <div className="venue-details">
//                 <h3>{booking.venueName}</h3>
//                 <p className="sport-name">{booking.sportName}</p>
//                 <p className="venue-location">{booking.venueLocation}</p>
//                 <p className="booking-date">
//                   {new Date(booking.date).toLocaleDateString("en-US", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}{" "}
//                   • {booking.time}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="review-form">
//             <div className="form-section">
//               <label className="form-label">
//                 How was your experience? <span className="required">*</span>
//               </label>
//               <div className="rating-section">
//                 <StarRating />
//                 <span className="rating-text">
//                   {getRatingText(hoveredRating || rating)}
//                 </span>
//               </div>
//             </div>

//             <div className="form-section">
//               <label htmlFor="review-title" className="form-label">
//                 Review Title <span className="required">*</span>
//               </label>
//               <input
//                 id="review-title"
//                 type="text"
//                 className="form-input"
//                 placeholder="Summarize your experience in a few words..."
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 maxLength={100}
//                 required
//               />
//               <div className="char-count">{title.length}/100 characters</div>
//             </div>

//             <div className="form-section">
//               <label htmlFor="review-body" className="form-label">
//                 Detailed Review <span className="required">*</span>
//               </label>
//               <textarea
//                 id="review-body"
//                 className="form-textarea"
//                 placeholder="Tell others about your experience at this venue. What did you like? What could be improved?"
//                 value={body}
//                 onChange={(e) => setBody(e.target.value)}
//                 maxLength={500}
//                 rows={5}
//                 required
//               />
//               <div className="char-count">{body.length}/500 characters</div>
//             </div>

//             <div className="review-guidelines">
//               <h4>Review Guidelines</h4>
//               <ul>
//                 <li>Be honest and provide constructive feedback</li>
//                 <li>Focus on the venue, facilities, and overall experience</li>
//                 <li>Keep your review respectful and appropriate</li>
//                 <li>Avoid personal information or irrelevant content</li>
//               </ul>
//             </div>

//             <div className="form-actions">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={onClose}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 disabled={
//                   isSubmitting || rating === 0 || !title.trim() || !body.trim()
//                 }
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Review"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewModal;

import React, { useState } from "react";
import Button from "./Button";

const ReviewModal = ({ booking, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please provide a rating");
    if (!title.trim()) return alert("Please provide a review title");
    if (!body.trim()) return alert("Please provide a review description");

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        title: title.trim(),
        body: body.trim(),
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="rm-star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`rm-star-rating__btn ${
            star <= (hoveredRating || rating)
              ? "rm-star-rating__btn--filled"
              : "rm-star-rating__btn--empty"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );

  const getRatingText = (val) => {
    switch (val) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate your experience";
    }
  };

  if (!booking) return null;

  return (
    <div className="rm-overlay">
      <div className="rm-modal">
        <div className="rm-modal__header">
          <h2 className="rm-modal__title">Write a Review</h2>
          <button className="rm-modal__close" onClick={onClose} type="button">
            &times;
          </button>
        </div>

        <div className="rm-modal__body">
          <div className="rm-booking">
            <div className="rm-booking__info">
              <img
                src={booking.venueImage}
                alt={booking.venueName}
                className="rm-booking__thumbnail"
              />
              <div className="rm-booking__details">
                <h3 className="rm-booking__venue">{booking.venueName}</h3>
                <p className="rm-booking__sport">{booking.sportName}</p>
                <p className="rm-booking__location">{booking.venueLocation}</p>
                <p className="rm-booking__date">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  • {booking.time}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rm-form">
            <div className="rm-form__section">
              <label className="rm-form__label">
                How was your experience? <span className="rm-required">*</span>
              </label>
              <div className="rm-rating">
                <StarRating />
                <span className="rm-rating__text">
                  {getRatingText(hoveredRating || rating)}
                </span>
              </div>
            </div>

            <div className="rm-form__section">
              <label htmlFor="review-title" className="rm-form__label">
                Review Title <span className="rm-required">*</span>
              </label>
              <input
                id="review-title"
                type="text"
                className="rm-input"
                placeholder="Summarize your experience..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <div className="rm-char-count">{title.length}/100 characters</div>
            </div>

            <div className="rm-form__section">
              <label htmlFor="review-body" className="rm-form__label">
                Detailed Review <span className="rm-required">*</span>
              </label>
              <textarea
                id="review-body"
                className="rm-textarea"
                placeholder="What did you like? What could be improved?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                rows={5}
                required
              />
              <div className="rm-char-count">{body.length}/500 characters</div>
            </div>

            <div className="rm-guidelines">
              <h4 className="rm-guidelines__title">Review Guidelines</h4>
              <ul className="rm-guidelines__list">
                <li>Be honest and constructive</li>
                <li>Focus on the venue, facilities, and experience</li>
                <li>Keep it respectful and appropriate</li>
                <li>No personal or irrelevant info</li>
              </ul>
            </div>

            <div className="rm-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  isSubmitting || rating === 0 || !title.trim() || !body.trim()
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
