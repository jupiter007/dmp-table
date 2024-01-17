import React, { useEffect, useState, useContext } from 'react';
import { useImmerReducer } from 'use-immer';
import styles from './DMPDashboard.module.css';
import Page from '../Page.jsx';
import useTable from '../../hooks/useTable.js';
import TablePagination from './TablePagination.jsx';
import DispatchContext from '../../DispatchContext.js';
import { sanitize } from '../../utils/index.js';

function DMPDashboard({ data, rowsPerPage = 2 }) {
  const appDispatch = useContext(DispatchContext);
  const originalState = {
    title: {
      value: '',
      hasError: false,
      message: '',
    },
    email: {
      value: '',
      hasError: false,
      message: '',
    },
    description: {
      value: '',
      hasError: false,
      message: '',
    },
    opportunityId: {
      value: '',
      hasError: false,
      message: '',
    },
    isFetching: false,
    isSaving: false,
    sendCount: 0,
    sortOrder: 'asc',
    sortField: 'modified',
    dmpData: data,
    editRowId: null,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'setEditRowValues':
        const selectedItem = draft.dmpData.find(
          (item) => item.dmp.dmp_id.identifier === action.value
        );

        if (selectedItem) {
          draft.title.value = selectedItem.dmp.title;
          draft.email.value = selectedItem.dmp.contact.mbox;
          draft.description.value = selectedItem.dmp.description;
          draft.opportunityId.value =
            selectedItem.dmp?.project[0]?.funding[0]?.dmproadmap_funding_opportunity_id?.identifier;
        }
        return;
      case 'setData':
        draft.dmpData = action.value;
        return;
      case 'setSortOrder':
        draft.sortOrder = action.value;
        return;
      case 'setSortField':
        draft.sortField = action.value;
        return;
      case 'setEditRowId':
        draft.editRowId = action.value;
        return;
      case 'fetchComplete':
        draft.data = action.value;
        draft.isFetching = false;
        return;
      case 'titleChange':
        draft.title.value = sanitize(action.value);
        draft.title.hasError = false;
        return;
      case 'emailChange':
        draft.email.value = sanitize(action.value);
        draft.email.hasError = false;
        return;
      case 'descriptionChange':
        draft.description.value = sanitize(action.value);
        draft.description.hasError = false;
        return;
      case 'opportunityIdChange':
        draft.opportunityId.value = sanitize(action.value);
        draft.opportunityId.hasError = false;
        return;
      case 'resetFieldErrors':
        draft.title.hasError = false;
        draft.email.hasError = false;
        draft.description.hasError = false;
        draft.opportunityId.hasError = false;
        return;
      case 'submitRequest':
        if (
          !draft.title.hasError &&
          !draft.email.hasError &&
          !draft.description.hasError &&
          !draft.opportunityId.hasError
        ) {
          draft.sendCount++;
        }
        return;
      case 'requestStatus':
        draft.isSaving = action.value;
        return;
      case 'saveRequestStarted':
        draft.isSaving = true;
        return;
      case 'saveRequestFinished':
        draft.isSaving = false;
        return;
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = 'You must provide a title.';
        }
        return;
      case 'emailRules':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!action.value.trim()) {
          draft.email.hasError = true;
          draft.email.message = 'You must provide an email.';
        } else if (!emailRegex.test(action.value.trim())) {
          draft.email.hasError = true;
          draft.email.message = 'You must provide a valid email.';
        }
        return;
      case 'descriptionRules':
        if (!action.value.trim()) {
          draft.description.hasError = true;
          draft.description.message = 'You must provide a description.';
        }
        return;
      case 'opportunityIdRules':
        if (!action.value) {
          draft.opportunityId.hasError = true;
          draft.opportunityId.message = 'You must provide an opportunityId.';
        }
        return;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(state.dmpData, page, rowsPerPage);

  const sortData = (field) => {
    const modifiedOrder = [...state.dmpData].sort((a, b) => {
      if (field === 'title') {
        const titleA = a.dmp.title.toLowerCase();
        const titleB = b.dmp.title.toLowerCase();
        return state.sortOrder === 'asc'
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      } else if (field === 'modified') {
        const dateA = new Date(a.dmp.modified);
        const dateB = new Date(b.dmp.modified);
        return state.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return undefined;
    });
    dispatch({ type: 'setData', value: modifiedOrder });
  };

  const handleSort = (field) => {
    //remove aria-sort from all headers
    document.querySelectorAll('th').forEach((item) => {
      item.removeAttribute('aria-sort');
      item.classList.remove(styles.asc, styles.desc);
    });
    if (field) {
      const element = document.getElementById(field);
      dispatch({
        type: 'setSortOrder',
        value: state.sortOrder === 'asc' ? 'desc' : 'asc',
      });
      const sortOrderClassName =
        state.sortOrder === 'asc' ? styles.asc : styles.desc;

      element.setAttribute('aria-sort', state.sortOrder);
      element.classList.add(sortOrderClassName);
      dispatch({ type: 'setSortField', value: field });
      sortData(field);
    }
  };

  /**
   * handleEditClick - sets the id and values for currently edited row
   * @param {*} id
   */
  const handleEditClick = (id) => {
    dispatch({ type: 'setEditRowId', value: id });
    dispatch({ type: 'setEditRowValues', value: id });
    appDispatch({ type: 'removeErrors' });
  };

  /**
   * handleCancelClick - empties all field-level errors when user clicks "Cancel" button
   */
  const handleCancelClick = () => {
    dispatch({ type: 'setEditRowId', value: null });
    dispatch({ type: 'resetFieldErrors' });
  };

  /**
   * handleSaveClick - when user clicks the "Save" button, we reset all of the field values in state
   * and check field values for errors before POSTing to API
   */
  const handleSaveClick = () => {
    dispatch({ type: 'titleRules', value: state.title.value });
    dispatch({ type: 'emailRules', value: state.email.value });
    dispatch({ type: 'descriptionRules', value: state.description.value });
    dispatch({ type: 'opportunityIdRules', value: state.opportunityId.value });
    dispatch({ type: 'submitRequest' });
  };

  useEffect(() => {
    //POST updated data to API
    if (state.sendCount) {
      dispatch({ type: 'requestStatus', value: true });
      async function fetchPost() {
        const selectedItem = data.find(
          (item) => item.dmp.dmp_id.identifier === state.editRowId
        );
        const id = state.editRowId.replace('https://doi.org/10.48321/', '');

        const editUpdates = {
          dmp: {
            title: state.title.value,
            description: state.description.value,
            contact: {
              mbox: state.email.value,
            },
          },
        };
        //merge data to meet the DMP JSON metadata requirement for the body
        const mergedData = {
          ...selectedItem,
          dmp: {
            ...selectedItem.dmp,
            ...editUpdates.dmp,
          },
        };
        try {
          const response = await fetch(`/dmps/${id}`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(mergedData),
          });
          if (!response.ok) {
            dispatch({ type: 'requestStatus', value: false });
            throw new Error('Something went wrong');
          } else {
            const responseData = await response.json();
            dispatch({ type: 'setEditRowId', value: null });
            dispatch({ type: 'requestStatus', value: false });
            appDispatch({
              type: 'flashMessage',
              value: 'You have successfully edited the table!',
            });

            dispatch({ type: 'setData', value: responseData });
          }
        } catch (e) {
          dispatch({ type: 'requestStatus', value: false });
          appDispatch({
            type: 'setError',
            value: `There was a problem: ${e.message}`,
          });
        }
      }
      fetchPost();
    }
  }, [state.sendCount]);

  if (state.isFetching) {
    return (
      <Page title="...">
        <p>Loading ...</p>
      </Page>
    );
  }
  return (
    <Page title="DMP Dashboard">
      <main>
        <h1>DMP Data Table</h1>
        <TablePagination
          range={range}
          slice={slice}
          setPage={setPage}
          page={page}
        />
        <table border="1" className="table table-striped">
          <caption>
            Table listing Data Management Plans{' '}
            <span className="hidden-accessibly">
              , column headers with buttons are sortable
            </span>
          </caption>
          <thead>
            <tr>
              <th onClick={() => handleSort(null)}>DMP ID</th>
              <th
                id="modified"
                onClick={() => handleSort('modified')}
                className={styles.sortable}
              >
                <button>
                  Last Updated{' '}
                  <span aria-hidden="true" className={styles.arrow}></span>
                </button>
              </th>
              <th
                id="title"
                data-testid="title"
                onClick={() => handleSort('title')}
                className={styles.sortable}
              >
                <button>
                  Title{' '}
                  <span aria-hidden="true" className={styles.arrow}></span>
                </button>
              </th>
              <th onClick={() => handleSort(null)}>Contact Email</th>
              <th onClick={() => handleSort(null)}>Contributor Count</th>
              <th onClick={() => handleSort(null)}>Abstract</th>
              <th onClick={() => handleSort(null)}>Funder</th>
              <th onClick={() => handleSort(null)}>Opportunity ID</th>
              <th onClick={() => handleSort(null)}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((item, index) => {
              const id = item.dmp.dmp_id.identifier;

              return (
                <tr key={index}>
                  <td>{id}</td>
                  <td className={styles.modified}>{item.dmp.modified}</td>
                  {state.editRowId === id ? (
                    <>
                      <td>
                        <textarea
                          name="title"
                          value={state.title.value}
                          className={state.title.hasError ? 'error' : ''}
                          onChange={(e) =>
                            dispatch({
                              type: 'titleChange',
                              value: e.target.value,
                            })
                          }
                        />
                        {state.title.hasError && (
                          <div className="alert alert-danger small liveValidateMessage">
                            {state.title.message}
                          </div>
                        )}
                      </td>
                      <td>
                        <textarea
                          name="email"
                          value={state.email.value}
                          className={state.email.hasError ? 'error' : ''}
                          onChange={(e) =>
                            dispatch({
                              type: 'emailChange',
                              value: e.target.value,
                            })
                          }
                        />
                        {state.email.hasError && (
                          <div className="alert alert-danger small liveValidateMessage">
                            {state.email.message}
                          </div>
                        )}
                      </td>
                      <td>{item.dmp.contributor?.length}</td>
                      <td>
                        <textarea
                          name="abstract"
                          value={state.description.value}
                          className={state.description.hasError ? 'error' : ''}
                          onChange={(e) =>
                            dispatch({
                              type: 'descriptionChange',
                              value: e.target.value,
                            })
                          }
                        />
                        {state.description.hasError && (
                          <div className="alert alert-danger small liveValidateMessage">
                            {state.description.message}
                          </div>
                        )}
                      </td>
                      <td>{item.dmp?.project[0]?.funding[0]?.name}</td>
                      <td>
                        <textarea
                          name="opportunityId"
                          value={state.opportunityId.value}
                          className={
                            state.opportunityId.hasError ? 'error' : ''
                          }
                          onChange={(e) =>
                            dispatch({
                              type: 'opportunityIdChange',
                              value: e.target.value,
                            })
                          }
                        />
                        {state.opportunityId.hasError && (
                          <div className="alert alert-danger small liveValidateMessage">
                            {state.opportunityId.message}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className={styles.buttonContainer}>
                          <button
                            className={`btn btn-sm btn-success mr-1 btn-save ${styles['btn-save']}`}
                            onClick={(e) => handleSaveClick(e, id)}
                            disabled={state.isSaving}
                          >
                            Save
                          </button>
                          <button
                            className={`btn btn-sm btn-info ${styles['btn-cancel']}`}
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.dmp.title}</td>
                      <td>{item.dmp.contact.mbox}</td>
                      <td className={styles.contributorCount}>
                        {item.dmp.contributor?.length}
                      </td>
                      <td>{item.dmp.description}</td>
                      <td>{item.dmp?.project[0]?.funding[0]?.name}</td>
                      <td className={styles.opportunityId}>
                        {
                          item.dmp?.project[0]?.funding[0]
                            ?.dmproadmap_funding_opportunity_id?.identifier
                        }
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm btn-success ${styles['btn-edit']} `}
                          onClick={() =>
                            handleEditClick(
                              item.dmp.dmp_id.identifier,
                              appDispatch
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <TablePagination
          range={range}
          slice={slice}
          setPage={setPage}
          page={page}
        />
      </main>
    </Page>
  );
}

export default DMPDashboard;
