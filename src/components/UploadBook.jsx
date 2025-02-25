import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../apiConfig/ApiService";
import DropboxChooser from "react-dropbox-chooser";

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
    setBook(prev => ({ ...prev, bookLink: tempUrl }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addBook(book);
    if (response.status === 200) {
      navigate("/books");
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Preview Panel */}
      <div className="fixed bottom-5 right-5 bg-[#2a2e32] p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="text-white text-sm font-semibold mb-3">Preview</h3>
        {book.imageLink && (
          <img
            src={book.imageLink}
            alt="Book Cover"
            className="w-32 h-40 object-cover rounded-md mx-auto mb-3"
          />
        )}
        {Object.entries(book).map(([key, value]) =>
          value && key !== "imageLink" ? (
            <div key={key} className="bg-[#373b40] rounded-md p-2 mb-2">
              <span className="text-gray-400 capitalize text-xs">{key}: </span>
              <span className="text-white text-xs">{value.slice(0, 20)}</span>
            </div>
          ) : null
        )}
      </div>

      {/* Main Form */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Book Details</h1>
        
        <form onSubmit={handleSubmit} className="bg-[#2a2e32] rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Title */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="title"
                value={book.title}
                onChange={handleChange}
              />
            </div>

            {/* Author */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="author"
                value={book.author}
                onChange={handleChange}
              />
            </div>

            {/* Genre */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <input
                type="text"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="genre"
                value={book.genre}
                onChange={handleChange}
              />
            </div>

            {/* Publication Year */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="publicationYear"
                value={book.publicationYear}
                onChange={handleChange}
              />
            </div>

            {/* Price */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="price"
                value={book.price}
                onChange={handleChange}
              />
            </div>

            {/* Language */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <input
                type="text"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="language"
                value={book.language}
                onChange={handleChange}
              />
            </div>

            {/* Image Link - Full Width */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image Link
              </label>
              <input
                type="text"
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="imageLink"
                value={book.imageLink}
                onChange={handleChange}
              />
            </div>

            {/* Description - Full Width */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                name="description"
                value={book.description}
                onChange={handleChange}
              />
            </div>

            {/* Dropbox Chooser - Full Width */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Attach Book
              </label>
              <DropboxChooser
                appKey={APP_KEY}
                success={handleSuccess}
                cancel={() => {}}
              >
                <div className="w-full bg-[#373b40] hover:bg-[#424242] text-white rounded-lg px-4 py-3 cursor-pointer text-center transition-colors duration-200">
                  CLICK TO ATTACH BOOK FILE
                </div>
              </DropboxChooser>
            </div>
          </div>

          {/* Submit Button - Full Width */}
          <div className="mt-8 flex gap-5">
            <button
              type="submit"
              className="w-full bg-[#101827] hover:bg-sky-950 text-white py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-full bg-[#101827] hover:bg-sky-950 text-white py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Submit Book Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookInput;