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
  const [isUploading, setIsUploading] = useState(false);
  const [bookFileSize, setBookFileSize] = useState("");
  const [coverImageSize, setCoverImageSize] = useState("");

  // Maximum file size in bytes (95MB for PDF, 5MB for image)
  const MAX_PDF_SIZE = 95 * 1024 * 1024;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleBookFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setBookFile(null);
      setBookFileSize("");
      return;
    }
    
    // Validate file size
    if (file.size > MAX_PDF_SIZE) {
      setError(`PDF file size exceeds limit (max: ${formatFileSize(MAX_PDF_SIZE)})`);
      setBookFile(null);
      setBookFileSize("");
      return;
    }
    
    setBookFile(file);
    setBookFileSize(formatFileSize(file.size));
    setError("");
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setCoverImage(null);
      setCoverImageSize("");
      setPreviewUrl(null);
      return;
    }
    
    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      setError(`Image file size exceeds limit (max: ${formatFileSize(MAX_IMAGE_SIZE)})`);
      setCoverImage(null);
      setCoverImageSize("");
      setPreviewUrl(null);
      return;
    }
    
    setCoverImage(file);
    setCoverImageSize(formatFileSize(file.size));
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
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
      setIsUploading(true);
      setError("");
      const response = await addBook(formData);
      if (response.status === 200) {
        navigate("/books");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.status === 413) {
        setError("File too large. Please reduce the size of your PDF or image.");
      } else {
        setError(error.response?.data || "Error uploading book. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
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
                Upload Book (PDF) <span className="text-gray-400 text-xs ml-1">Max size: 95MB</span>
              </label>
              <div className="flex flex-col">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleBookFileChange}
                  className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {bookFileSize && (
                  <span className="mt-1 text-xs text-gray-400">File size: {bookFileSize}</span>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Cover Image <span className="text-gray-400 text-xs ml-1">Max size: 5MB</span>
              </label>
              <div className="flex flex-col">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full bg-[#373b40] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {coverImageSize && (
                  <span className="mt-1 text-xs text-gray-400">File size: {coverImageSize}</span>
                )}
              </div>
              
              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-300 mb-1">Preview:</p>
                  <img 
                    src={previewUrl} 
                    alt="Cover preview" 
                    className="h-40 object-contain rounded border border-gray-700" 
                  />
                </div>
              )}
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
                setBookFileSize("");
                setCoverImageSize("");
                setError("");
              }}
              className="w-full bg-[#101827] hover:bg-sky-950 text-white py-3 rounded-lg transition-colors duration-200 font-medium"
              disabled={isUploading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="w-full bg-[#101827] hover:bg-sky-950 text-white py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookInput;