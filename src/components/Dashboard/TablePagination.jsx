import React, { useEffect } from 'react';
import styles from './TablePagination.module.css';

const TablePagination = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <nav
      className={styles.tablePagination}
      role="navigation"
      aria-label="Pagination navigation"
    >
      <ul>
        {range.map((el, index) => (
          <li
            key={index}
            aria-label={`Goto Page ${el}`}
            className={`${styles.page} ${
              page === el ? styles.activeButton : styles.inactiveButton
            }`}
            aria-current={page === el}
            onClick={() => setPage(el)}
          >
            {el}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TablePagination;
