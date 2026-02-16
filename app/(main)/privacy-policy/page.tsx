"use client";

import PageHeader from "@/components/PageHeader";

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <PageHeader
        title="Privacy Policy"
        description="Your privacy is important to us"
      />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2>Privacy Policy</h2>
              <p className="text-muted">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h3 className="mt-4">Information We Collect</h3>
              <p>
                We collect information that you provide directly to us,
                including but not limited to:
              </p>
              <ul>
                <li>
                  Birth date and time information for astrological calculations
                </li>
                <li>Location data for accurate chart generation</li>
                <li>Account information (email, username)</li>
              </ul>

              <h3 className="mt-4">How We Use Your Information</h3>
              <p>We use the information we collect to:</p>
              <ul>
                <li>
                  Provide accurate astrological calculations and predictions
                </li>
                <li>Maintain and improve our services</li>
                <li>Communicate with you about your account</li>
              </ul>

              <h3 className="mt-4">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction.
              </p>

              <h3 className="mt-4">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
