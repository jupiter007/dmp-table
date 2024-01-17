import React, { useEffect, useState, useMemo, useContext } from 'react';
import DMPDashboard from './DMPDashboard.jsx';
import LoadingDotsIcon from '../LoadingDotsIcon.jsx';
import Page from '../Page.jsx';
import DispatchContext from '../../DispatchContext.js';

const Dashboard = React.memo(() => {
  const appDispatch = useContext(DispatchContext);
  const [dmpData, setDMPData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchData = async (id) => {
    try {
      const response = await fetch(`/dmps/${id}`, {
        method: 'GET',
        mode: 'cors',
      });
      const data = await response.json();
      if (data.errors.length > 0) {
        appDispatch({ type: 'setErrors', value: data.errors });
      }
      if (data) {
        return data;
      }
    } catch (e) {
      console.log(`There was a problem ${e.message}`);
    }
  };
  useEffect(() => {
    const fetchAll = async () => {
      if (Object.keys(dmpData).length === 0) {
        const dmp_ids = [
          '10.48321/D1J31B',
          '10.48321/D1R316',
          '10.48321/D10601',
          '10.48321/D1CW23',
          '10.48321/D1930S',
          '10.48321/D1DW5J',
          '10.48321/D1ERROR',
        ];
        const newDataArray = [];
        //Wait for all requests to complete
        await Promise.all(
          dmp_ids.map(async (dmp_id) => {
            const data = await fetchData(dmp_id);
            if (data.items[0] === null) {
              const id = data.requested.match(/\/(\d+\.\d+)\//)[1];
              appDispatch({
                type: 'setErrors',
                value: `The data for ${id} was not available`,
              });
            } else {
              newDataArray.push(data.items[0]);
            }
          })
        );

        setIsFetching(false);
        setDMPData(newDataArray);
      }
    };

    fetchAll();
  }, []);

  // Memoize the component to prevent unnecessary re-renders
  const memoizedDMPDashboard = useMemo(() => {
    return <DMPDashboard data={dmpData} rowsPerPage={dmpData.per_page} />;
  }, [dmpData]);

  if (isFetching) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  return <>{Object.keys(dmpData).length > 0 && memoizedDMPDashboard}</>;
});

export default Dashboard;
