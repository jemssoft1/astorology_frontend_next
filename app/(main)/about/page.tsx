"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Iconify from "@/components/Iconify";
import Link from "next/link";

export default function About() {
  const [age, setAge] = useState<string>("...");

  useEffect(() => {
    // Calculate age
    const currentDate = new Date();
    const pastDate = new Date(2014, 8, 1); // September 2014
    const differenceInMilliseconds = currentDate.getTime() - pastDate.getTime();
    const millisecondsInYear = 31536000000;
    const yearsDifference = differenceInMilliseconds / millisecondsInYear;
    setAge(yearsDifference.toFixed(2));
  }, []);

  return (
    <div className="container">
      <div className="row flex-md-nowrap">
        <div className="col mt-0 mt-md-0">
          <div
            className="fw-bold hstack gap-2 d-flex"
            style={{ maxWidth: "667px" }}
          >
            <h1 className="mt-2 me-auto">About </h1>
            <Link
              href="/made-on-earth"
              className="hstack gap-2 btn btn-primary mb-2 align-self-end text-decoration-none"
              style={{ height: "37.1px", width: "fit-content" }}
            >
              <Iconify icon="clarity:factory-line" width={25} height={25} />
              Made In
            </Link>
            <Link
              href="/contact-us"
              className="hstack gap-2 btn btn-primary mb-2 align-self-end text-decoration-none"
              style={{ height: "37.1px", width: "fit-content" }}
            >
              <Iconify icon="carbon:pedestrian-family" width={25} height={25} />
              Join Us
            </Link>
          </div>
          <hr className="mt-1 mb-2" />

          <div className="vstack gap-2" style={{ maxWidth: "667.5px" }}>
            <p>
              <img
                src="/images/dropcap-a.svg"
                style={{
                  width: "99px",
                  height: "116px",
                  float: "left",
                  marginRight: "6px",
                }}
                alt="..."
              />
              nybody who has studied Vedic Astrology knows well how accurate it
              can be. But also how complex it can get to make accurate
              predictions. It takes decades of experience to be able to make
              accurate prediction. Thus, this knowledge only reaches a limited
              people. This project is an effort to change that.
            </p>
            <div>
              <h4 className="fw-bold">Goal</h4>
              <p className="text-justify">
                Our goal is to make Vedic Astrology easily accessible to
                anybody. So that people can use it in their daily lives for
                their benefit. Vedic Astrology in Sanskrit means{" "}
                <strong>"Light"</strong> and that is exactly what it is. It
                lights our future so we can change it. And it lights our past,
                to understand our mistakes.
              </p>
            </div>
            <div>
              <h4 className="fw-bold">How</h4>
              <p className="text-justify">
                Using modern computational technologies & methods we can{" "}
                <strong>simplify the complexity</strong> of Vedic Astrology. For
                example, calculating planet strength (Bhava Bala) used to take
                hours, now with computers we can calculate it in
                <strong>milliseconds</strong>. Combining databases & innovative
                programming methods. There's no need to remember thousands of
                planetary combinations, allowing you to make{" "}
                <strong>accurate predictions</strong> with little to no
                knowledge.
              </p>
            </div>
            <div className="py-2">
              <div className="">
                <div className="fw-bold hstack gap-2 d-flex">
                  <Iconify
                    icon="emojione:birthday-cake"
                    width={38}
                    height={38}
                  />
                  <h4 id="ageOutputHeader" className="mt-2 me-auto">
                    {age} Years Old
                  </h4>
                </div>
                <hr className="mt-1 mb-2" />
              </div>
              <p>
                The first line of code for this project was written in late{" "}
                <strong>2014</strong> at Itä-Pasila. Back then it was a simple
                desktop software, with no UI and only text display. With
                continued support from users, this project has steadily
                developed to what it is today. Helping people from all over the
                world.
              </p>
            </div>
            <div className="py-2">
              <div className="">
                <div className="fw-bold hstack gap-2 d-flex">
                  <Iconify icon="emojione:books" width={38} height={38} />
                  <h4 className="mt-2 me-auto">Credits & Reference </h4>
                </div>
                <hr className="mt-1 mb-2" />
              </div>
              <p>
                Thanks to{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-primary fw-bold text-decoration-none"
                  href="https://en.wikipedia.org/wiki/B._V._Raman"
                >
                  B.V. Raman
                </a>{" "}
                and his grandfather B. Suryanarain Rao for pioneering easy to
                read astrology books. Credit also goes to{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-primary fw-bold text-decoration-none"
                  href="https://en.wikipedia.org/wiki/Jean-Baptiste_de_La_Salle"
                >
                  St. Jean-Baptiste de La Salle
                </a>
                for proving the efficacy of free and open work for the benefit
                all.
              </p>
              <img
                src="/images/bv-raman-rao.png"
                className="img-thumbnail my-1 align-self-center"
                alt="..."
              />
              <p className="mt-3">
                Astronomical calculation was made possible by{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-primary fw-bold text-decoration-none"
                  href="https://naif.jpl.nasa.gov/pipermail/spice_announce/2007-August/000055.html"
                >
                  NASA JPL
                </a>
                data via "SWISS EPHEMERIS" ported by "SwissEphNet". Last but not
                least, we thank users like you who keep this project going.
              </p>
            </div>
            <div className="py-2">
              <div className="">
                <div className="fw-bold hstack gap-2 d-flex">
                  <Iconify icon="emojione:scroll" width={38} height={38} />
                  <h4 className="mt-2 me-auto">Myth & Philosophy </h4>
                </div>
                <hr className="mt-1 mb-2" />
              </div>
              <p className="text-justify">
                It is told in the stories of old, that a heathen god moved by
                the plight of a child. Gave onto him the knowledge of the stars
                as compensation for the tears. The child in turn passed that
                gift to every soul he knew, with no check on price or pedigree.
                And so astrology was born.
              </p>
              <p className="text-justify">
                As such this knowledge stands as an opportunity for every soul
                to realize that even though we play a role in the world, we are
                not made of it. That we are <strong>souls</strong> first! And
                the planets do not have a say on it.
              </p>
              <p className="text-justify" style={{ marginBottom: "50px" }}>
                A means of escape from the thralldom of cosmic illusion, is what
                it really is. And so for this reason the masters have continued
                to bring this out in every age.
                <br />
                It's their gift to us, the <strong>"world folk"</strong>.
              </p>

              <div style={{ cursor: "pointer", marginTop: "60.1px" }}>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p style={{ fontFamily: "'Homemade Apple', serif" }}>
                      Mechanical features in the law of karma,
                      <br /> can be skillfully adjusted by the fingers of
                      wisdom.
                    </p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Yukteswar
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
