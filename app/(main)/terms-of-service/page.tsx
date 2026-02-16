"use client";

import PageHeader from "@/components/PageHeader";

export default function TermsOfService() {
  return (
    <div className="container">
      <PageHeader
        title="Terms of Service"
        description="Terms and conditions for using our services"
      />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2>Terms of Service</h2>
              <p className="text-muted">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h3 className="mt-4">Acceptance of Terms</h3>
              <p>
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>

              <h3 className="mt-4">Use of Services</h3>
              <p>
                Our astrological services are provided for informational and
                entertainment purposes. You agree to use our services
                responsibly and not for any unlawful purpose.
              </p>

              <h3 className="mt-4">Accuracy of Information</h3>
              <p>
                While we strive to provide accurate astrological calculations,
                we make no guarantees about the accuracy or completeness of
                predictions and interpretations.
              </p>

              <h3 className="mt-4">Intellectual Property</h3>
              <p>
                All content, features, and functionality on this site are owned
                by us and are protected by international copyright, trademark,
                and other intellectual property laws.
              </p>

              <h3 className="mt-4">Limitation of Liability</h3>
              <p>
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of
                our services.
              </p>

              <h3 className="mt-4">Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the service constitutes acceptance of modified
                terms.
              </p>

              <h3 className="mt-4">Contact Us</h3>
              <p>
                If you have any questions about these Terms of Service, please
                contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
