import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ForumPage.css";

const ForumPage = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/forumPosts`
        );
        setForumPosts(response.data);
      } catch (error) {
        setError(error.toString());
      }
    };

    fetchForumPosts();
  }, []);

  return (
    <div className="forum-container">
      {/* <div className="tabs">
        <div className="tab active">up to date</div>
        <div className="tab">Popular</div>
      </div> */}
      {error && <div className="error">{error}</div>}
      <table className="forum-table">
        <thead>
          <tr>
            <th style={{ width: "60%" }}>Content</th>
            <th style={{ width: "10%" }}>Author</th>
            <th style={{ width: "10%" }}>Reply</th>
            <th style={{ width: "10%" }}>View</th>
            <th style={{ width: "10%" }}>Last post</th>
          </tr>
        </thead>
        <tbody>
          {forumPosts.map((post, index) => (
            <tr key={index}>
              <td>{post.content}</td>
              <td>{post.forumTopicId}+</td>
              <td>{post.userId}</td>
              <td>{post.floor}+</td>
              <td>{post.publishTimestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForumPage;
