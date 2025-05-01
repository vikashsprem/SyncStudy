import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { retrieveBook } from "../apiConfig/ApiService";
import "./component.css";
import { useNavigate } from "react-router-dom";
import CommentSection from "./Comment";

const ShoppingCard = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveBook(id).then((response) => {
      setBook(response.data);
    });
  }, [id]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = book.title;
    link.href = book.bookLink;
    link.click();
  };

  const description =
    "This is a beautiful description for Book. It combines magic, mysticism, wisdom, and wonder into an inspiring tale of self-discovery. The story follows the journey of the main character, exploring themes of opportunity, reading life's omens, and the pursuit of dreams.";

  if (!book) {
    return <div className="m-5 p-5">Loading...</div>;
  }

  return (
    <>
      <div className="md:flex grid p-10">
        {/* Left side - Photo and Book Details */}
        <div className="m-2 md:w-1/3 max-w-96">
          <img
            src={book.imageLink || "https://via.placeholder.com/150"}
            alt="Book Cover"
            className="w-full h-auto shadow-md"
          />
          <button className="bg-gray-300 text-black w-full p-5 text-center">
            {book.title}
          </button>
          <div className="flex mt-10 justify-between gap-2 flex-wrap">
            <button
              className="bg-green-500 p-3 flex-1 rounded-sm"
              onClick={handleDownload}
            >
              Download
            </button>
            <button className="bg-orange-500 p-3 flex-1 rounded-sm">
              Contribute
            </button>
          </div>
        </div>

        {/* Right side - Additional Information and Buttons */}
        <div className="md:w-2/3 m-2 p-8 border-2 border-neutral-100 animate-slide-fade rounded-lg shadow-md">
          <p className="font-medium mb-4">{`Description: ${description}`}</p>
          <h2 className="text-2xl font-bold border-t-2 my-7"></h2>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-gray-300">{`Author: ${book.author}`}</p>
            <p className="text-gray-300">{`Publication Year: ${book.publicationYear}`}</p>
            <p className="text-gray-300">{`Genre: ${book.genre}`}</p>
            <p className="text-gray-300">{`Language: ${book.language}`}</p>
            <p className="text-gray-300">{`Rating: ${book.rating}`}</p>
            {/* <p className="text-gray-300">{`Price: ₹${book.price}`}</p> */}
            {/* <p className="text-gray-300">{`Discount: ${book.discount}%`}</p> */}
            {/* <p className="col-span-2 text-xl text-gray-200 font-bold">{`Total price: ₹${
              book.price - (book.price * book.discount) / 100
            }`}</p> */}
          </div>
          <h2 className="text-2xl font-bold border-t-2 my-7"></h2>
        </div>
      </div>
      <br /> <br />
      <br />
      <CommentSection />
    </>
  );
};

export default ShoppingCard;
