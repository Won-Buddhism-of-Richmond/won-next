import React, { Component } from "react";
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";
import Head from "next/head";
import sanity from "../lib/sanity"

import { getSchedule } from "../api/schedule"
import { getEvents } from "../api/events"

import Introduction from "../components/sections/Home/Introduction/";
import Activities from "../components/sections/Home/Activities/";
import About from "../components/sections/Home/About/";
import Footer from "../components/sections/Home/Footer/";

import "./index.css";
import "./header.css";

import t from "../locale";


class Home extends Component {
  state = {
    locale: "en",
    schedule: [],
    events: []
  };

  changeState = (key, value) => {
    this.setState({ [key]: value }, () =>
      window.localStorage.setItem("won-rva", JSON.stringify(this.state)),
    );
  };

  async componentDidMount() {
    configureAnchors({ offset: -116, scrollDuration: 400 });

    if (typeof window !== "undefined") {
      const localStorageState = JSON.parse(
        window.localStorage.getItem("won-rva"),
      );

      if (typeof localStorageState === "object") {
        this.setState({ ...localStorageState });
      }
    }
  }

  render() {
    const { locale, schedule, events } = this.state;
    const { special, header, intro, about, footer } = t[locale];

    return (
      <ScrollableAnchor id={"home"}>
        <div className="Home">
          <Head>
            <title>Home | Won Buddhism of Richmond</title>
          </Head>
          <nav>
            <ul className="header-links">
              <li>
                <a href="#home">{header.home}</a>
              </li>
              <li>
                <a href="#activities">{header.activities}</a>
              </li>
              <li>
                <a href="#about">{header.about}</a>
              </li>
              {/* <li>
                <button
                  className="no-button"
                  onClick={() => {
                    this.changeState("locale", locale === "en" ? "kr" : "en");
                  }}>
                  <img
                    className="flag"
                    src={locale === "en" ? "/static/usa.png" : "/static/sk.png"}
                    alt={`Flag for the country of ${
                      locale === "en" ? "America" : "South Korea"
                      }`}
                  />
                </button>
              </li> */}
            </ul>
          </nav>

          <Introduction
            header={header}
            intro={intro}
            locale={locale}
            changeState={this.changeState}
          />
          <Activities schedule={schedule} events={events} />
          <About about={about} />
          <div className="special-notice-banner">
            <p>{special.move}</p>
            <p>
              <a
                about="_blank"
                href="https://www.google.com/maps/@37.6179084,-77.3496596,15z"
                className="button-link">
                Visit Our Location!
              </a>
            </p>
          </div>
          <Footer footer={footer} />
        </div>
      </ScrollableAnchor>
    );
  }
}

Home.getInitialProps = async function () {
  return {
    events: await sanity.fetch("*[0]"),
    schedule: await sanity.fetch("*[0]")
  }
}

export default Home;