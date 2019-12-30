import React, { PureComponent } from 'react';
import { Pagination } from 'react-bootstrap';

class Paginator extends PureComponent {
  render() {
    let { handlePrevious, handleNext, handlePageClick, numberOfPages, currentPage } = this.props;

    let paginatorPages = [];

    for (let page = 1; page <= numberOfPages; page++) {
      paginatorPages.push(
        <Pagination.Item
          active={page - 1 === currentPage}
          onClick={handlePageClick(page - 1)}
          key={`paginator-page-${page}`}
        >
          {page}
        </Pagination.Item>,
      );
    }

    return (
      <Pagination>
        <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 0} />

        {paginatorPages}
        <Pagination.Next onClick={handleNext} disabled={currentPage === paginatorPages.length - 1} />
      </Pagination>
    );
  }
}

export default Paginator;
