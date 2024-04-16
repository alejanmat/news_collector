import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = (props) => {
  const { topic } = props;
  console.log(" ", props);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async (t) => {
    const { token } = JSON.parse(localStorage.getItem("user"));
    const res = await axios.get(`http://localhost:4000/posts?topic=${t}`, {
      method: "GET",
      headers: {
        ["jwt-token"]: token,
      },
    });
    setPosts(res.data?.posts);
  };

  useEffect(() => {
    console.log("postlist", topic);
    if (topic) {
      fetchPosts(topic);
    }
  }, [topic]);

  const renderedPosts = useMemo(
    () =>
      (posts || []).map((post) => {
        return (
          <li className="post" key={post.id}>
            <div className="card-body">
              <h2 className="postTitle">{post.title}</h2>
              <h3 className="postDescription">{post.description}</h3>
              <Link to={`${post.link}`} target="_blank" rel="noreferrer">
                See more
              </Link>
              {/* <h6>{post.topic}</h6> */}
            </div>
          </li>
        );
      }),
    [posts]
  );

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      <ul>{renderedPosts}</ul>
    </div>
  );
};

export default PostList;
