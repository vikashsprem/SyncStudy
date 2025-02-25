import React, { useState } from 'react';
import calc from "../assets/calc.jpg"

const MarketplaceComponent = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Engineering Textbook",
      price: 45.99,
      category: "Books",
      condition: "Like New",
      seller: "John D.",
      description: "Fundamentals of Engineering, 5th Edition. Used for one semester.",
      image: calc
    },
    {
      id: 2,
      title: "Scientific Calculator",
      price: 25.00,
      category: "Electronics",
      condition: "Good",
      seller: "Sarah M.",
      description: "TI-84 Plus, perfect for calculus and statistics classes.",
      image: calc
    },
    {
      id: 3,
      title: "Study Desk",
      price: 89.99,
      category: "Furniture",
      condition: "New",
      seller: "Mike R.",
      description: "Modern study desk with built-in USB ports. Perfect for dorm rooms.",
      image: calc
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: ''
  });

  const categories = ["Books", "Electronics", "Furniture", "Clothing", "Other"];
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleAddItem = (e) => {
    e.preventDefault();
    setItems([...items, {
      id: items.length + 1,
      ...newItem,
      seller: "You",
      image: "/api/placeholder/300/200"
    }]);
    setShowModal(false);
    setNewItem({
      title: '',
      price: '',
      category: '',
      condition: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Campus Marketplace</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">+</span>
            List New Item
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-[#1d2023] p-4 rounded-lg shadow-lg">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full bg-[#373b40] text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="bg-[#373b40] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select className="bg-[#373b40] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Conditions</option>
              {conditions.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#1d2023] rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:transform hover:scale-[1.02]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-fit object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <span className="text-lg font-bold text-green-400">${item.price}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-[#373b40] text-sm rounded-full text-blue-400">
                    {item.category}
                  </span>
                  <span className="px-2 py-1 bg-[#373b40] text-sm rounded-full text-gray-300">
                    {item.condition}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#373b40]">
                  <span className="text-sm text-gray-400">Posted by {item.seller}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#2a2e32] rounded-lg p-6 w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">List New Item</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Title"
                  className="w-full bg-[#373b40] text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full bg-[#373b40] text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                />
                <select
                  className="w-full bg-[#373b40] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  className="w-full bg-[#373b40] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newItem.condition}
                  onChange={(e) => setNewItem({...newItem, condition: e.target.value})}
                >
                  <option value="">Select Condition</option>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Item Description"
                  className="w-full bg-[#373b40] text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    List Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceComponent;