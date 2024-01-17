import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TablePagination from './TablePagination';

describe('TablePagination component', () => {
  it('renders correctly with given props', () => {
    const range = [1, 2, 3, 4, 5];
    const setPage = jest.fn();
    const page = 2;
    const slice = [];

    render(
      <TablePagination
        range={range}
        setPage={setPage}
        page={page}
        slice={slice}
      />
    );

    // Assert that the navigation is rendered
    const navigation = screen.getByRole('navigation', {
      name: /pagination navigation/i,
    });
    expect(navigation).toBeInTheDocument();

    // Assert that each page button is rendered with correct styling
    range.forEach((el) => {
      const pageButton = screen.getByText(el.toString());
      expect(pageButton).toBeInTheDocument();

      if (page === el) {
        expect(pageButton).toHaveClass('activeButton');
      } else {
        expect(pageButton).toHaveClass('inactiveButton');
      }
    });
  });

  it('calls setPage with the correct value when a page button is clicked', () => {
    const range = [1, 2, 3, 4, 5];
    const setPage = jest.fn();
    const page = 2;
    const slice = [];

    render(
      <TablePagination
        range={range}
        setPage={setPage}
        page={page}
        slice={slice}
      />
    );

    // Click on a page button
    const pageButton = screen.getByText('3');
    fireEvent.click(pageButton);

    // Assert that setPage is called with the correct value
    expect(setPage).toHaveBeenCalledWith(3);
  });
});
