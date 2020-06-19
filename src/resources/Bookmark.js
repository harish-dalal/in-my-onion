import React from "react";
import './bookmark.css'

function Bookmark(props) {
  return (
    <svg
      className = 'bookmark noselect'
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width = "30px"
      height = "30px"
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      onClick = {props.click}
    >
      <path className = {props.bookmarked ? '' : 'not-active-lower'}
        fill="#2196F3"
        d="M384 0H149.333c-41.237 0-74.667 33.429-74.667 74.667v426.667a10.668 10.668 0 006.592 9.856c1.291.538 2.676.813 4.075.811a10.663 10.663 0 007.552-3.115l120.448-120.619C260.48 434.795 325.44 499.2 332.416 507.136c3.261 4.906 9.882 6.24 14.788 2.979a10.67 10.67 0 003.964-4.835 6.53 6.53 0 00.832-3.947v-448c0-17.673 14.327-32 32-32 5.891 0 10.667-4.776 10.667-10.667S389.891 0 384 0z"
      ></path>
      <path className = {props.bookmarked ? '' : 'not-active-upper'}
        fill="#004284"
        d="M394.667 0c23.564 0 42.667 19.103 42.667 42.667v32c0 5.891-4.776 10.667-10.667 10.667H352V42.667C352 19.103 371.103 0 394.667 0z"
      ></path>
    </svg>
  );
}

export default Bookmark;