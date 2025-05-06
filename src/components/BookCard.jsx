import React from "react";
import bookImage from "../assets/think.jpg";

function BookCard(props) {
  const { title, imageLink, rating, price, discount } = props.book || {};

  return (
    <div className="bg-gray-400 shadow-lg rounded-lg overflow-hidden flex flex-col book-card-hover w-full h-full">
      {/* Image Container with Fixed Height */}
      <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src={imageLink || bookImage}
          alt={title || "Book cover"}
        />
      </div>
      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h5>
        <div className="flex items-center mt-2">
          <div className="flex items-center flex-wrap">
            {[1, 2, 3, 4, 5].map((index) => (
              <span key={index} className="text-yellow-400">
                ⭐
              </span>
            ))}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded ml-2">
              {rating || "0"}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-lg font-bold text-gray-900">
            Rs. {price || "0"}{" "}
            <span className="text-sm text-green-500">({discount || "0"}% off)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookCard;