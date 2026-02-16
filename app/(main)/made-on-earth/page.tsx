"use client";

import PageHeader from "@/components/PageHeader";

export default function MadeOnEarth() {
  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: "412.5px" }}>
          <img
            src="/images/made-on-earth.jpg"
            width="412.5px"
            className="img-thumbnail"
            alt="Made on Earth"
          />

          <figure
            className="text-center mt-1"
            style={{ maxWidth: "412.5px", cursor: "pointer" }}
          >
            <blockquote className="blockquote">
              <p style={{ fontSize: "25px" }}>
                There is not a single person in the world who could make a
                pencil.
              </p>
            </blockquote>
            <figcaption
              className="blockquote-footer"
              style={{ fontSize: "16px" }}
            >
              Milton Freedman <cite title="Source Title">Nobel Prize '76</cite>
            </figcaption>
          </figure>

          <div>
            <h4 className="fw-bold text-center mt-4">Made On Earth Movement</h4>
            <div>
              <p
                className="text-justify"
                style={{
                  fontFamily: "'Gowun Dodum', serif",
                  fontSize: "18px",
                  lineBreak: "auto",
                }}
              >
                Everywhere on so many things we see "Made in USA", "Made in
                Great Britain", "Made in China", "Made in Sweden", made here &
                made there. I would love to put such a label on this project,
                but where to begin?
              </p>
              <p
                style={{ fontFamily: "'Gowun Dodum', serif", fontSize: "18px" }}
              >
                As the genius{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecorationLine: "none" }}
                  href="https://youtu.be/67tHtpac5ws"
                  className="link-primary fw-bold"
                >
                  M. Freedman put it
                </a>
                , even to manufacture a humble <strong>"pencil"</strong> it
                takes the accumulated might of industry spread across the earth.
                From graphite mines in Brazil to rubber trees in Indonesia, just
                to make a pencil!
              </p>
              <p
                style={{ fontFamily: "'Gowun Dodum', serif", fontSize: "18px" }}
              >
                The point we're trying to make here is this. astroweb is only
                possible because of people and resources from many countries
                spread across the earth and time. As such, the only valid label
                for this project is, <br />
              </p>
            </div>
            <strong
              style={{
                marginLeft: "153px",
                fontFamily: "'Gowun Dodum', serif",
                fontSize: "18px",
              }}
            >
              "Made on Earth"
            </strong>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
