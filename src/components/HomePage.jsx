import React from "react";
import UserProfile from "./UserProfile";
import ServiceSection from "./ServiceSection";
import CardSection from "./CardSection";
import "../assets/styles/style.css";

function HomePage() {
  return (
    <div className="app">
      <div className="content">
        {/* <UserProfile /> */}
        {/* <ServiceSection /> */}
        <CardSection />
      </div>
    </div>
  );
}

export default HomePage;
