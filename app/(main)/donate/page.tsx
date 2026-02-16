"use client";

import PageHeader from "@/components/PageHeader";
import Script from "next/script";

export default function Donate() {
  return (
    <div className="container">
      <PageHeader
        title="Donate"
        description="Help to keep this project & website alive 🌱"
        imageSrc="/images/donate-banner.png"
      />

      <div className="d-flex justify-content-center mt-5">
        {/* Stripe Buy Button Web Component */}
        {/* 
                  Note: TypeScript might complain about custom element <stripe-buy-button>.
                  We can suppress this or declare it. For now, we rely on standard HTML behavior.
                  If React strips it, we might need a wrapper.
                */}
        <stripe-buy-button
          buy-button-id="buy_btn_1OiFvLJuwVWEHuj37W4h3TJp"
          publishable-key="pk_live_51MfBvdJuwVWEHuj3uTQJ0hdZvml1X9MPmQQnvjABkJ4llLyx2XY8KgTttg5bG5mknT1xDK9hvbTup7BLa0EKgYnX00nbSoo7Hm"
        ></stripe-buy-button>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <a
          href="https://buy.stripe.com/7sI15E8rZepVbio289"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
        >
          Open Donation Page Directly
        </a>
      </div>

      <Script async src="https://js.stripe.com/v3/buy-button.js" />
    </div>
  );
}

// Add declaration for custom element to avoid TS errors if checked strictly,
// though in Next.js page files it's often loose.
// Placing it here or in a d.ts file.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": any;
    }
  }
}
