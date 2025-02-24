import React from "react";
import { Link } from "react-router-dom";

function CardSection() {
  const cards = [
    { title: "Cab Sharing", action: "Continue", link: "#" },
    { title: "Food Order Sharing", action: "Continue", link: "#" },
    { title: "Marketplace", action: "Continue", link: "#" },
    { title: "Join discussion Room", action: "Continue", link: "/chat" },
  ];

  return (
    <div className="card-section flex flex-wrap justify-center">
      {cards.map((card, index) => (
        <div
          key={index}
          className="card flex-col flex justify-between gap-10 flex-1"
        >
          <h4 className="">{card.title}</h4>
          <Link className="card-action-btn hover:bg-orange-700" to={card.link}>
            {card.action}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CardSection;
