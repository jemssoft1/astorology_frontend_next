"use client";

import Iconify from "./Iconify";

interface Props {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
  href?: string;
  isNewTab?: boolean;
  maxWidth?: string;
}

export default function InfoBox({
  title,
  description,
  icon,
  href,
  isNewTab,
  maxWidth = "365px",
}: Props) {
  const content = (
    <div
      className="card h-100 hover-shadow border bg-white"
      style={{ maxWidth: maxWidth }}
    >
      <div className="card-body hstack gap-3 align-items-center">
        <div className="flex-shrink-0">
          <Iconify icon={icon} width={45} height={45} />
        </div>
        <div>
          <h5 className="card-title mb-1 fw-bold">{title}</h5>
          <p
            className="card-text text-muted mb-0"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
        </div>
        <div className="ms-auto">
          <Iconify
            icon="bi:chevron-right"
            width={20}
            height={20}
            className="text-muted"
          />
        </div>
      </div>
      <style jsx>{`
        .hover-shadow {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          border-color: var(--bs-primary) !important;
        }
      `}</style>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={isNewTab ? "_blank" : undefined}
        rel={isNewTab ? "noopener noreferrer" : undefined}
        className="text-decoration-none text-dark d-block mb-3"
      >
        {content}
      </a>
    );
  }

  return <div className="mb-3">{content}</div>;
}
