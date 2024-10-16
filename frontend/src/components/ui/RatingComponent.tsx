import { useEffect, useState } from 'react';

interface RatingComponentProps {
  articleId: string; // Article ID to associate the rating with
}

const RatingComponent: React.FC<RatingComponentProps> = ({ articleId }) => {
  const [rating, setRating] = useState<number>(0); // State to store the current rating
  const [hoveredRating, setHoveredRating] = useState<number>(0); // State to store the rating being hovered over
  const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false); // State to control prompt visibility
  const [hasRated, setHasRated] = useState<boolean>(false); // State to track if the user has rated the article

  // Fetch the current rating when the component mounts
  useEffect(() => {
    const fetchCurrentRating = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/extracted-articles/${articleId}/rating`);
        if (!response.ok) {
          throw new Error('Failed to fetch current rating');
        }
        const data = await response.json();
        setRating(data.rating);

        // Check if the user has already rated the article
        if (data.rating > 0) {
          setHasRated(true); // Set to true if the rating is greater than 0
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentRating();
  }, [articleId]);

  const handleClick = (value: number) => {
    if (hasRated) {
      alert('You have already rated this article!'); // Alert user if they try to rate again
      return;
    }

    if (window.confirm('Do you want to rate this article?')) { // Prompt user for confirmation
      setIsPromptVisible(true); // Show rating stars if user confirms
      submitRating(value); // Submit the rating to the server
    }
  };

  const handleMouseEnter = (value: number) => {
    setHoveredRating(value); // Update hovered rating
  };

  const handleMouseLeave = () => {
    setHoveredRating(0); // Reset hovered rating
  };

  const submitRating = async (value: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/extracted-articles/${articleId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      console.log(`Rating submitted: ${value}`);
      setRating(value); // Set rate
      setHasRated(true); // Set to true after successfully rating
      setIsPromptVisible(false); // Hide stars after rating submission
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      {hasRated ? ( // Check if the user has already rated the article
        <span className="text-gray-500">You rated this article: {rating} stars</span> // Display the rating given
      ) : (
        isPromptVisible ? ( // Check if the prompt is visible
          [1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer"
            >
              {value <= (hoveredRating || rating) ? (
                <span className="text-yellow-500">&#9733;</span> // Solid star icon
              ) : (
                <span className="text-gray-300">&#9734;</span> // Hollow star icon
              )}
            </span>
          ))
        ) : (
          <button onClick={() => setIsPromptVisible(true)} className="text-blue-500">Rate Article</button> // Button to start rating
        )
      )}
    </div>
  );
};

export default RatingComponent;
