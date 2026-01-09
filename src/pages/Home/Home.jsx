import Banner from "./Banner.jsx";
import LatestResolved from "./LatestResolved.jsx";
import Features from "./Features.jsx";
import HowItWorks from "./HowItWorks.jsx";
import CommunityImpact from "./CommunityImpact.jsx";
import WhyReportSection from "./WhyReportSection.jsx";
import IssueCategories from "./IssueCategories.jsx";
import WhoUsesPlatform from "./WhoUsesPlatform.jsx";
import TransparencySection from "./TransparencySection.jsx";
import CallToAction from "./CallToAction.jsx";

const Home = () => {
    return (
        <div>
            <Banner />
            <LatestResolved />
            <Features />
            <HowItWorks />
            <CommunityImpact />
            <WhyReportSection />
            <IssueCategories />
            <WhoUsesPlatform />
            <TransparencySection />
            <CallToAction />
        </div>
    );
};

export default Home;