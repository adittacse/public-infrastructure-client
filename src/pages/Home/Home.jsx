import React from "react";
import Banner from "./Banner.jsx";
import LatestResolved from "./LatestResolved.jsx";
import Features from "./Features.jsx";
import HowItWorks from "./HowItWorks.jsx";
import CommunityImpact from "./CommunityImpact.jsx";
import WhyReportSection from "./WhyReportSection.jsx";

const Home = () => {
    return (
        <div>
            <Banner />
            <LatestResolved />
            <Features />
            <HowItWorks />
            <CommunityImpact />
            <WhyReportSection />
        </div>
    );
};

export default Home;