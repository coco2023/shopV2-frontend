import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ForumPage.css';

const ForumPage = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/forumPosts`);
        setForumPosts(response.data);
      } catch (error) {
        setError(error.toString());
      }
    };

    fetchForumPosts();
  }, []);

  return (
    <div className="forum-container">
      <div className="tabs">
        <div className="tab active">up to date</div>
        <div className="tab">Popular</div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="forum-header">
        <span className="header-section-name">Section name</span>
        <span className="header-author">author</span>
        <span className="header-replies">Reply</span>
        <span className="header-views">View</span>
        <span className="header-last-post">final post</span>
      </div>
      <div className="forum-posts">
        {forumPosts.map((post, index) => (
          <div key={index} className="forum-post">
            <span className="post-section-name">{post.content}</span>
            <span className="post-author">{post.userId}</span>
            <span className="post-replies">{10}+</span>
            <span className="post-views">{1000}+</span>
            <span className="post-last-post">{post.publishTimestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
