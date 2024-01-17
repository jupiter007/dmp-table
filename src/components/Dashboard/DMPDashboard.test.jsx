import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Optional, for additional matchers
import DMPDashboard from './DMPDashboard';
import data from '../../db/data.json';

jest.mock('../../DispatchContext');
describe('DMPDashboard', () => {
  it('should render page title', () => {
    const mockDispatch = jest.fn();

    jest.spyOn(React, 'useContext').mockReturnValue({
      appDispatch: mockDispatch,
    });

    render(<DMPDashboard data={data} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/DMP Data Table/);
  });

  it('renders correct number of rows based on pagination', () => {
    const mockDispatch = jest.fn();

    jest.spyOn(React, 'useContext').mockReturnValue({
      appDispatch: mockDispatch,
    });

    render(<DMPDashboard data={data} />);

    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(3);
  });

  it('should sort correctly', async () => {
    const mockDispatch = jest.fn();

    jest.spyOn(React, 'useContext').mockReturnValue({
      appDispatch: mockDispatch,
    });

    render(<DMPDashboard data={data} />);
    const titleColumnHeader = screen.getByTestId('title');
    fireEvent.click(titleColumnHeader);

    const rows = screen.getAllByRole('row');
    const firstRow = rows[1];
    const cells = within(firstRow).queryAllByRole('cell');
    expect(cells[2].textContent).toBe(
      'Coastal Ocean Processes of North Greenland'
    );

    fireEvent.click(titleColumnHeader);

    const rows2 = screen.getAllByRole('row');
    const firstRow2 = rows2[1];
    const cells2 = within(firstRow2).queryAllByRole('cell');
    expect(cells2[2].textContent).toBe('Test plan');
  });
});
