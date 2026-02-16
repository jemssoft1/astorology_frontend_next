"use client";

import PageHeader from "@/components/PageHeader";
import Script from "next/script";

export default function RegisterSubscription() {
  return (
    <div className="container">
      <Script src="/js/RegisterSubscription.js" strategy="lazyOnload" />

      <PageHeader
        title="Register Subscription"
        description="Subscribe to premium features and services"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="row">
        <div className="col-md-12">
          <div id="register-subscription-content">
            {/* Legacy RegisterSubscription.js will populate this area */}
          </div>
        </div>
      </div>
    </div>
  );
}
