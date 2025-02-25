import React from "react";
import bookImage from "../assets/think.jpg";

function BookCard(props) {
  const { title, imageLink, rating, price, discount } = props.book || {};

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 w-64">
      {/* Image Container with Fixed Height and Width */}
      <div className="w-full h-64 overflow-hidden">
        <a href="#" className="block">
          <img
            className="object-cover w-full h-full"
            src={imageLink || bookImage}
            alt="product image"
          />
        </a>
      </div>
      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <a href="#">
          <h5 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {title}
          </h5>
        </a>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((index) => (
              <span key={index} className="text-yellow-400">
                ⭐
              </span>
            ))}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded ml-2">
              {rating}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-lg font-bold text-gray-900">
            Rs. {price}{" "}
            <span className="text-sm text-green-500">({discount}% off)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookCard;