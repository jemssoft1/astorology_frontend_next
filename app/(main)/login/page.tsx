"use client";

import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Iconify from "@/components/Iconify";
import Script from "next/script";

export default function Login() {
  useEffect(() => {
    // Load legacy Login.js features if not auto-loaded
    // Note: Login.js adds event listeners.
  }, []);

  return (
    <div className="container">
      <Script src="/js/Login.js" strategy="lazyOnload" />
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      />

      <div className="d-md-flex justify-content-between">
        <div>
          <div className="vstack gap-1 mb-4">
            <h2 className="align-self-center">Login</h2>
            <h5
              id="LoginHelperTextHolder"
              className="align-self-center"
              style={{ color: "#8f8f8f" }}
            ></h5>
          </div>

          <div className="vstack">
            <div
              className="align-self-center vstack gap-3 mb-4"
              style={{ width: "291.9px" }}
            >
              <div className="rounded p-4" style={{ background: "#caecff" }}>
                <div className="vstack gap-4">
                  <button
                    id="FacebookSignInButton"
                    className="btn btn-primary hstack gap-2 iconButton"
                    style={{ width: "100%" }}
                  >
                    <Iconify
                      icon="akar-icons:facebook-fill"
                      width={25}
                      height={25}
                    />{" "}
                    Sign In
                  </button>

                  <div
                    id="g_id_onload"
                    data-client_id="19638836771-oflt5g9mnkft6chkl04vp4m5qpu5h569.apps.googleusercontent.com"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-callback="OnGoogleSignInSuccessHandler"
                    data-auto_prompt="false"
                  ></div>
                  <div
                    className="g_id_signin"
                    data-type="standard"
                    data-shape="pill"
                    data-theme="outline"
                    data-text="signin"
                    data-size="large"
                    data-logo_alignment="center"
                    data-width="170"
                    id="GoogleSignInButton"
                    style={{ textAlign: "center" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-md-0 mt-4 me-md-5">
          <h4>Why login?</h4>
          <ul className="list-group">
            <li className="list-group-item">
              <Iconify icon="flat-color-icons:approval" />{" "}
              <strong>Secure</strong>: Safe & fast with Google/Facebook.
            </li>
            <li className="list-group-item">
              <Iconify icon="ic:baseline-cloud-done" /> <strong>Storage</strong>
              : Free cloud storage for charts.
            </li>
            <li className="list-group-item">
              <Iconify icon="flat-color-icons:privacy" />{" "}
              <strong>Privacy</strong>: We don't collect data.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
