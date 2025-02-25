import React from "react";
import { Link } from "react-router-dom";

// Updated images from Pexels (more relevant to each card)
const cardImages = [
  "https://images.pexels.com/photos/590059/pexels-photo-590059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Cab Sharing
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600", // Food Order Sharing
  "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Marketplace
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600", // Join Discussion Room
];

function CardSection() {
  const cards = [
    { title: "Cab Sharing", action: "Continue", link: "#" },
    { title: "Food Order Sharing", action: "Continue", link: "#" },
    { title: "Marketplace", action: "Continue", link: "/market-place" },
    { title: "Join Discussion Room", action: "Continue", link: "/chat" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg bg-slate-700 shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-48 w-full">
              <img
                src={cardImages[index]}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h4 className="text-2xl font-bold mb-4 text-gray-300">
                {card.title}
              </h4>
              <Link
                to={card.link}
                className="bg-gray-400 py-3 px-6 rounded-md text-center font-semibold hover:bg-gray-300 transition-colors"
              >
                {card.action}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardSection;