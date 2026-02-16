"use client";

import PageHeader from "@/components/PageHeader";
import InfoBox from "@/components/InfoBox";

export default function ContactUs() {
  return (
    <div className="container">
      <PageHeader
        title="Contact us"
        description="Report a bug, suggest a feature or just say Hi"
        imageSrc="/images/stars-above-me-banner.png"
      />

      <div className="mt-md-0 mt-4 me-md-5">
        <div
          className="vstack gap-0 gap-md-2"
          style={{ maxWidth: "365px", margin: "0 auto" }}
        >
          <InfoBox
            title="WhatsApp"
            description="Say what's up in WA"
            icon="logos:whatsapp-icon"
            isNewTab={true}
            href="https://wa.me/601113395387?text=Hi"
          />
          <InfoBox
            title="Email"
            description="contact@astroweb.in <br> astroweb.in@gmail.com"
            icon="flat-color-icons:address-book"
          />
          <InfoBox
            title="Telegram"
            description="Call or chat with us."
            icon="logos:telegram"
            isNewTab={true}
            href="https://t.me/astroweb_in"
          />
          <InfoBox
            title="Skype"
            description="Give us a ring"
            icon="logos:skype"
            isNewTab={true}
            href="https://join.skype.com/invite/sPYi5V1ZjKRb"
          />
          <InfoBox
            title="Slack"
            description="Chat in team workspace"
            icon="logos:slack-icon"
            isNewTab={true}
            href="https://join.slack.com/t/astroweb/shared_invite/zt-1u7pdqjky-hrJZ7e3_vM2dZOmVY8FeHA"
          />
        </div>
      </div>
    </div>
  );
}
