"use client";

import PageHeader from "@/components/PageHeader";
import Script from "next/script";

export default function MatchFinder() {
  return (
    <div className="container">
      <Script src="/js/MatchFinder.js" strategy="lazyOnload" />

      <PageHeader
        title="Match Finder"
        description="Find compatible matches based on astrological profiles"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="row">
        <div className="col-md-12">
          <div id="match-finder-content">
            {/* Legacy MatchFinder.js will populate this area */}
          </div>
        </div>
      </div>
    </div>
  );
}
