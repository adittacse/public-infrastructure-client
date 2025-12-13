import React from "react";
import Banner from "./Banner.jsx";
import LatestResolved from "./LatestResolved.jsx";
import Features from "./Features.jsx";
import HowItWorks from "./HowItWorks.jsx";

const Home = () => {

    return (
        <div>
            <Banner />
            <LatestResolved />
            <Features />
            <HowItWorks />
        </div>
    );
};

export default Home;