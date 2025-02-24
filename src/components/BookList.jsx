import React from "react";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";
import PromoCard from "./PromoCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./component.css";
import { retrieveAllBooks } from "../apiConfig/ApiService";
import uploadIcon from "../assets/add.png";
function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  useEffect(() => {
    retrieveAllBooks().then((response) => {
      setBooks(response.data);
    });
  }, []);

  return (
    <>
      <PromoCard />
      <div className="flex flex-wrap gap-10 p-20 justify-center sm:justify-start animate-slide-fade">
        {Array.isArray(books) &&
          books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`}>
              <BookCard key={book.id} book={book} />
            </Link>
          ))}
        <button
          onClick={() => navigate("/book/upload")}
          className="fixed right-0 bottom-0 m-4 rounded-3xl p-3 px-5 text-black font-bold border-2 border-black  hover:scale-90 transition-transform duration-300 ease-in-out"
          style={{
            backgroundColor: "white",
          }}
        >
          <div className="flex items-center gap-3 justify-center">
            <img
              src={uploadIcon}
              alt="upload"
              width={30}
              height={30}
              className="duration-300 ease-in-out animate-bounce"
            />
            <span>Upload Book</span>
          </div>
        </button>
      </div>
    </>
  );
}

export default BookList;
