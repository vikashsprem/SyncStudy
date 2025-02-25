import React, { useState, useEffect } from "react";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";
import PromoCard from "./PromoCard";
import { useNavigate } from "react-router-dom";
import "./component.css";
import { retrieveAllBooks } from "../apiConfig/ApiService";
import uploadIcon from "../assets/add.png";

function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    genre: "",
    author: "",
  });
  const [suggestions, setSuggestions] = useState({
    name: [],
    genre: [],
    author: [],
  });

  useEffect(() => {
    retrieveAllBooks().then((response) => {
      setBooks(response.data);
      setFilteredBooks(response.data);
    });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    // If input is empty, clear suggestions
    if (!value.trim()) {
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
      return;
    }

    // Update suggestions based on the input
    if (name === "name") {
      const nameSuggestions = books
        .map((book) => book.title)
        .filter((title) => title.toLowerCase().includes(value.toLowerCase()));
      setSuggestions((prev) => ({ ...prev, name: nameSuggestions }));
    } else if (name === "genre") {
      const genreSuggestions = books
        .map((book) => book.genre)
        .filter((genre) => genre.toLowerCase().includes(value.toLowerCase()));
      setSuggestions((prev) => ({ ...prev, genre: genreSuggestions }));
    } else if (name === "author") {
      const authorSuggestions = books
        .map((book) => book.author)
        .filter((author) => author.toLowerCase().includes(value.toLowerCase()));
      setSuggestions((prev) => ({ ...prev, author: authorSuggestions }));
    }
  };

  // Apply filters whenever filters state changes
  useEffect(() => {
    const filtered = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(filters.name.toLowerCase()) &&
        book.genre.toLowerCase().includes(filters.genre.toLowerCase()) &&
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    });
    setFilteredBooks(filtered);
  }, [filters, books]);

  // Handle suggestion click
  const handleSuggestionClick = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
    // Clear suggestions after selection
    setSuggestions((prev) => ({ ...prev, [type]: [] }));
  };

  // Clear suggestions on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    // Use a timeout to allow click events on suggestions to fire first
    setTimeout(() => {
      setSuggestions((prev) => ({ ...prev, [name]: [] }));
    }, 200);
  };

  // Render input field with suggestions
  const renderFilterField = (label, name, placeholder, value, suggestionList) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleFilterChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
      />
      {suggestionList.length > 0 && (
        <ul className="absolute z-10 mt-1 left-0 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
          {suggestionList.map((item, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSuggestionClick(name, item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <PromoCard />
      {/* Filter Section */}
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Filters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderFilterField("Name", "name", "Filter by name", filters.name, suggestions.name)}
          {renderFilterField("Genre", "genre", "Filter by genre", filters.genre, suggestions.genre)}
          {renderFilterField("Author", "author", "Filter by author", filters.author, suggestions.author)}
        </div>
      </div>
      {/* Book List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 animate-slide-fade">
        {Array.isArray(filteredBooks) &&
          filteredBooks.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="block">
              <BookCard key={book.id} book={book} />
            </Link>
          ))}
      </div>
      {/* Upload Button */}
      <button
        onClick={() => navigate("/book/upload")}
        className="fixed right-0 bottom-0 m-4 rounded-3xl p-3 px-5 font-bold border-2 hover:scale-90 transition-transform duration-300 ease-in-out bg-white"
      >
        <div className="flex items-center gap-3 justify-center">
          <img
            src={uploadIcon}
            alt="upload"
            width={30}
            height={30}
            className="duration-300 ease-in-out animate-bounce"
          />
          <span className="text-black">Upload Book</span>
        </div>
      </button>
    </>
  );
}

export default BookList;
