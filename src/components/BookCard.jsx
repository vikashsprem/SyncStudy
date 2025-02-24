import React, { useState } from "react";
import bookImage from "../assets/think.jpg";

function BookCard(props) {
  const { title, imageLink, rating, price, discount } = props.book || {};

  return (
    <div className="bg-gray-200 max-w-52 flex-1">
      <a href="#">
        <img
          className="rounded-t-lg"
          src={imageLink || bookImage}
          alt="product image"
        />
      </a>
      <div className="px-1 pb-2">
        <a href="#">
          <h5 className="text-xs text-gray-900 dark:text-black">{title}</h5>
        </a>
        <div className="flex items-center mt-2.5 mb-0.1">
          <div className="flex items-center rtl:space-x-reverse">
            {[1, 2, 3, 4, 5].map((index) => (
              <span key={index}>⭐</span>
            ))}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {rating}
            </span>
          </div>
        </div>
        <div className="flex">
          <p className="text-sm text-green-500 font-bold">
            <span className="text-sm font-bold dark:text-black">
              Rs. {price}{" "}
            </span>{" "}
            ({discount}% off)
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
