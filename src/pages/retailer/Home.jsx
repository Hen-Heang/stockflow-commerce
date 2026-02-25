import React from "react";
import { Outlet } from "react-router-dom";
import FooterRetailerComponent from "../../components/retailler/FooterRetailerComponent";
import NavBarRetailerComponent from "../../components/retailler/NavBarRetailerComponent";

// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
export default function Home() {
  return (
    <div className="font-family-retailer">
      <div>
        {/* Hello from home component */}
        <div className="bg-[#f5f5f5] min-h-screen ">
          {/* header */}
          <NavBarRetailerComponent />
          <div className="my-3 bg-[#F5F5F5]">
            <Outlet />
          </div>
          <FooterRetailerComponent />
        </div>
      </div>
    </div>
  );
}
