"use client";

import Script from "next/script";

export default function ComingSoon() {
  return (
    <div
      className="container py-5 d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <img
        className="mb-4"
        src="/images/construction.jpg"
        alt="Under Construction"
        style={{ maxWidth: "100%", maxHeight: "300px" }}
      />
      <h1 className="my-4 text-center">astroweb under construction!</h1>
      <p className="lead text-center">
        We're working hard to bring you an amazing experience. 🤩
      </p>

      <div className="donate mt-5 mb-5 d-flex flex-column gap-3 align-items-center justify-content-center">
        <h2>💖 Support Development:</h2>
        <a
          href="https://buy.stripe.com/7sI15E8rZepVbio289"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Donate 💌
        </a>
        <div className="hstack gap-2 align-items-center justify-content-center flex-wrap">
          <img
            src="/images/astroweb-upi-qr-code-kaladi-icici.png"
            className=""
            style={{ alignSelf: "center", width: "242px" }}
            alt="UPI QR"
          />
          <img
            src="/images/astroweb-phonepe-qr-code.png"
            className=""
            style={{ alignSelf: "center", width: "242px" }}
            alt="PhonePe QR"
          />
        </div>
      </div>
    </div>
  );
}
