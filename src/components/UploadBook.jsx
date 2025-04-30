import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../apiConfig/ApiService";

const BookInput = () => {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publicationYear: "",
    price: "",
    language: "",
    description: "",
  });

  const [bookFile, setBookFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleBookFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setBookFile(file);
      setError("");
    } else {
      setError("Please upload a PDF file");
      setBookFile(null);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    } else {
      setError("Please upload an image file");
      setCoverImage(null);
      setPreviewUrl(null);
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookFile || !coverImage) {
      setError("Please upload both book file and cover image");
      return;
    }

    const formData = new FormData();
    formData.append("file", bookFile);
    formData.append("coverImage", coverImage);
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("genre", book.genre);
    formData.append("publicationYear", book.publicationYear);
    formData.append("price", book.price);
    formData.append("language", book.language);
    formData.append("description", book.description);

    try {
      const response = await addBook(formData);
    if (response.status === 200) {
      navigate("/books");
      }
    } catch (error) {
      setError(error.response?.data || "Error uploading book");
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Preview Panel */}
      <div className="fixed bottom-5 right-5 bg-[#2a2e32] p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="text-white text-sm font-semibold mb-3">Preview</h3>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Book Cover Preview"
            className="w-32 h-40 object-cover rounded-md mx-auto mb-3"
          />
        )}
        {Object.entries(book).map(([key, value]) =>
          value ? (
            <div key={key} className="bg-[#373b40] rounded-md p-2 mb-2">
              <span className="text-gray-400 capitalize text-xs">{key}: </span>
              <span className="text-white text-xs">{value.toString().slice(0, 20)}</span>
            </div>
          ) : null
        )}
      </div>

      {/* Main Form */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Book Details</h1>
        
        <form onSubmit={handleSubmit} className="bg-[#2a2e32] rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* File Uploads */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Book (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleBookFileChange}
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                name="description"
                value={book.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-5">
            <button
              type="button"
              onClick={() => {
                setBook({
                  title: "",
                  author: "",
                  genre: "",
                  publicationYear: "",
                  price: "",
                  language: "",
                  description: "",
                });
                setBookFile(null);
                setCoverImage(null);
                setPreviewUrl(null);
                setError("");
              }}
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