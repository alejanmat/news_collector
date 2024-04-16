import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import PostList from "./PostList";
const topics = ["markets", "technology"];
const Home = (props) => {
  const { loggedIn, email, setLoggedIn } = props;
  const navigate = useNavigate();
  const [topicSelected, setTopic] = useState(topics[0]);
  const onLoginClick = () => {
    navigate("/login");
  };

  const onLogoutClick = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
  };
  const renderNav = useMemo(
    () =>
      topics.map((topic) => {
        return (
          <Link
            className="nav-item nav-link"
            href="#"
            onClick={() => setTopic(topic)}
          >
            {topic}
          </Link>
        );
      }),
    []
  );

  return (
    <div className="mainContainer">
      {loggedIn ? (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">
              News
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                {renderNav}
                <Link
                  className="nav-item nav-link"
                  href="#"
                  onClick={onLogoutClick}
                >
                  Logout
                </Link>
              </div>
            </div>
          </nav>
          <div>Hi! There are your news</div>
          {topicSelected && <PostList topic={topicSelected}></PostList>}
        </>
      ) : (
        <>
          <div>Login to read news!</div>
          <div className={"buttonContainer"}>
            <input
              className={"inputButton"}
              type="button"
              onClick={onLoginClick}
              value={"Log in"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
