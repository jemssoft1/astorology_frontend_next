"use client";

import PageHeader from "@/components/PageHeader";
import Script from "next/script";

export default function Remedy() {
  return (
    <div className="container">
      <Script src="/js/Remedy.js" strategy="lazyOnload" />

      <PageHeader
        title="Remedy"
        description="Discover astrological remedies and solutions"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="row">
        <div className="col-md-12">
          <div id="remedy-content">
            {/* Legacy Remedy.js will populate this area */}
          </div>
        </div>
      </div>
    </div>
  );
}
