import React from 'react';
import './ForumPage.css'; // Ensure you have a corresponding CSS file

const forumData = [
  // This is a mock; replace it with your actual forum data fetching logic
  {
    title: 'meta product ds electric face test',
    section: 'Mathematics face-to-face',
    author: 'huangracer',
    replies: 3,
    views: '17265',
    lastPost: '12 minutes ago',
  },
  // ... add more threads
];

const ForumPage = () => {
  return (
    <div className="forum-container">
      <div className="tabs">
        <div className="tab active">up to date</div>
        <div className="tab">Popular</div>
      </div>
      {forumData.map((thread, index) => (
        <div key={index} className="thread-item">
          <div className="thread-title">{thread.title}</div>
          <div className="thread-details">
            <span className="thread-section">{thread.section}</span>
            <span className="thread-author">{thread.author}</span>
            <span className="thread-replies">{thread.replies} replies</span>
            <span className="thread-views">{thread.views} views</span>
            <span className="thread-last-post">{thread.lastPost}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPage;
