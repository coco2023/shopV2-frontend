import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ForumPage.css";
import ReactPaginate from "react-paginate";

const ForumPage = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [error, setError] = useState(null);
  // const [visibleForumPosts, setVisibleForumPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pageCount, setPageCount] = useState(1); // 初始总页数设为1
  const postsPerPage = 20; // 4 columns * 6 rows

  useEffect(() => {
    fetchForumPosts();
  }, [currentPage, postsPerPage]); // 当currentPage或itemsPerPage变化时重新获取产品

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchForumPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/forumPosts`,
        {
          params: {
            page: currentPage,
            size: postsPerPage,
          },
        }
      );
      setForumPosts(response.data.content);
      setTotalPage(response.data.totalPages);
      setPageCount(response.data.totalPages); // 更新总页数

      // setVisibleForumPosts((prevPost) => [
      //   ...prevPost,
      //   ...response.data.content, // Assuming the product data is in the 'content' field
      // ]);

      // setCurrentPage((prevPage) => prevPage + 1); // 更新当前页码，为下一次加载做准备
      // setTotalPage(response.data.totalPages);
      // const newPage = response.data.number + 1;
      // if (newPage >= response.data.totalPages) {
      //   console.log("reach to the end!!");
      // }
    } catch (error) {
      setError(error.toString());
    }
  };

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
              <td>{post.forumTopicId}</td>
              <td>{post.userId}</td>
              <td>{post.floor}+</td>
              <td>{post.publishTimestamp}</td>
            </tr>
          ))}
          {/* {currentPage < totalPage && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={fetchForumPosts}>
                Load More
              </button>
            </div>
          )} */}
        </tbody>
      </table>

      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"page-link-disabled"}
          activeClassName={"page-link-active"}
        />
      </div>

    </div>
  );
};

export default ForumPage;
