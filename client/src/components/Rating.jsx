import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

const Rating = ({ ratings }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, index) => {
      const starValue = index + 1;
      if (ratings >= starValue) {
        return <FaStar key={index} className="text-[#EDBB0E]" />;
      } else if (ratings >= starValue - 0.5) {
        return <FaStarHalfAlt key={index} className="text-[#EDBB0E]" />;
      } else {
        return <CiStar key={index} className="text-slate-600" />;
      }
    });
  return <>{stars}</>;
};

export default Rating;
