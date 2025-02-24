import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../apiConfig/ApiService";
import DropboxChooser from "react-dropbox-chooser";
import "./component.css";

const BookInput = () => {
  const navigate = useNavigate();
  const APP_KEY = "px6ca2gxjrgjq96";

  const [book, setBook] = useState({
    imageLink: "",
    title: "",
    author: "",
    genre: "",
    publicationYear: "",
    price: "",
    language: "",
    description: "",
    bookLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  function handleSuccess(files) {
    const tempUrl = files[0].link.replace("dl=0", "dl=1");
    book.bookLink = tempUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addBook(book);
    if (response.status === 200) {
      navigate("/books");
    }
  };

  return (
    <div className="upload-box">
      <div className="bg-gray-400 p-5 rounded-md fixed overflow-hidden bottom-5 right-5">
        {Object.entries(book).map(
          ([key, value]) =>
            value &&
            (key !== "imageLink" ? (
              <div
                key={key}
                className="flex mb-1 gap-3 mx-auto bg-slate-300 px-1"
              >
                <span className="text-black capitalize text-xs">{key}:</span>
                <span className="text-black text-xs">
                  {value.slice(0, 20) || "N/A"}
                </span>
              </div>
            ) : (
              <img
                src={book.imageLink}
                alt="Book Cover"
                className="align-middle mb-1 mx-auto"
                width={140}
              />
            ))
        )}
      </div>

      <div className="container mx-auto max-w-4xl">
        <div className="bg-slate-500 p-8 border rounded shadow-lg">
          <h1 className="text-3xl text-black text-center font-bold">
            Book Details
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 border rounded shadow-lg"
          style={{ backgroundColor: "rgb(18, 18, 18)" }}
        >
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-300"
            >
              Author
            </label>
            <input
              type="text"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="author"
              name="author"
              value={book.author}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-300"
            >
              Genre
            </label>
            <input
              type="text"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="genre"
              name="genre"
              value={book.genre}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="publicationYear"
              className="block text-sm font-medium text-gray-300"
            >
              Publication Year
            </label>
            <input
              type="number"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="publicationYear"
              name="publicationYear"
              value={book.publicationYear}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-300"
            >
              Price (₹)
            </label>
            <input
              type="number"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="price"
              name="price"
              value={book.price}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-300"
            >
              Language
            </label>
            <input
              type="text"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="language"
              name="language"
              value={book.language}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="description"
              name="description"
              value={book.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="imageLink"
              className="block text-sm font-medium text-gray-300"
            >
              Image Link
            </label>
            <input
              type="text"
              className="input-field mt-1 px-4 py-2 p-2 border rounded w-full"
              id="imageLink"
              name="imageLink"
              value={book.imageLink}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="imageLink"
              className="block text-sm font-medium text-gray-300"
            >
              Attach Book
            </label>
            <DropboxChooser
              appKey={APP_KEY}
              success={handleSuccess}
              cancel={() => this.onCancel()}
            >
              <div className="dropbox-button input-field mt-1 px-4 py-2 p-2 border rounded w-full font-semibold bg-green-950 cursor-pointer">
                CLICK TO ATTACH BOOK FILE
              </div>
            </DropboxChooser>
          </div>

          <button
            type="submit"
            className="bg-blue-800 hover:bg-slate-900 text-white p-2 rounded mt-1 border w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookInput;
