import React from 'react';
import styles from './Loading.module.css'

function Loading() {
  return (
    <div className="text-center">
        <div className={styles["loading-area"]}>
      <div className={styles.loader}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    </div>
    // <img width={"100%"} src="https://res.cloudinary.com/beeshoes/image/upload/v1693305212/common/nyan-cat_e6me4f.gif" alt="" />
  )
}

export default Loading