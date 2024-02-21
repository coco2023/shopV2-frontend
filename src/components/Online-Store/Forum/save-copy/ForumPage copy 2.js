import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is installed
import "./ForumPage.css"; // Your CSS file for styling

const ForumPage = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/forumPosts`
        );
        setForumPosts(response.data);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForumPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="forum-container">
      <div className="tabs">
        <div className="tab active">up to date</div>
        <div className="tab">Popular</div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="forum-posts">
        {forumPosts.map((post, index) => (
          <div key={index} className="forum-post">
            <span className="post-content">{post.content}</span>
            <span className="user-info">User ID: {post.userId}</span>
            <span className="post-timestamp">{post.publishTimestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
