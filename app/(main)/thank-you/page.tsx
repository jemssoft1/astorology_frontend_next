"use client";

import PageHeader from "@/components/PageHeader";
import Script from "next/script";

export default function ThankYou() {
  return (
    <div className="container">
      <Script src="/js/ThankYou.js" strategy="lazyOnload" />

      <PageHeader
        title="Thank You"
        description="Thank you for your support!"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="row">
        <div className="col-md-12">
          <div className="text-center py-5">
            <h2 className="display-4">🙏 Thank You!</h2>
            <p className="lead mt-3">
              We appreciate your support and trust in our astrological services.
            </p>
            <div id="thank-you-content" className="mt-4">
              {/* Legacy ThankYou.js may populate this area */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
