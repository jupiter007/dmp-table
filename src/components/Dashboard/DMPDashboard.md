# DMPDashboard Component

This component uses `immer` to manage state locally. It also uses a global state that originates from the App.js parent component.

A user can edit a row when they click the "Edit" button for that row. When the user clicks the "Save" button, then the changes are merged with the rest of the dmp object item in order to send the correct metadata to the API, per this defined "bare minimum" example:

```js{
  "dmp": {
    "title": "Example Research Project",
    "modified": "2022-11-14T22:18:18Z",
    "created":"2021-11-08T19:06:04Z",
    "contact": {
      "name": "Doe PhD., Jane A.",
      "dmproadmap_affiliation": {
        "name": "California Digital Library (cdlib.org)",
        "affiliation_id": {
          "type": "ror",
          "identifier": "https://ror.org/03yrm5c26"
        }
      },
      "mbox": "jane.doe@example.com",
      "contact_id":{
        "type": "orcid",
        "identifier": "https://orcid.org/0000-0000-0000-000X"
      }
    },
    "dmp_id": {
      "identifier": "https://example.com/data_management_plans/u9345ht9h35",
      "type": "url"
    },
    "project": [
      {
        "title": "Example Research Project"
      }
    ],
    "dataset": [
      {
        "title": "Recordings of the great horned owl"
      }
    ]
  }
}
```

## Mocked data

Currently, the call to POST the data is mocked, using the `msw` library. The mock files can be found in the "./mocks" directory.

## Accessibility

The sortable columns, "Title" and "Last Updated" are marked with diamond icons next to the header titles to indicate that they can be sorted. Also, the sortable headers are placed in a button to indicate to screen readers that they are sortable, and <caption> content was added to let screen readers know that headers with a <button> are sortable. Also, the `aria-sort` attribute is used on the `<th>` headers and are dynamically updated based on whether they are `asc` or `desc`.

Colors used on the dashboard were checked using the "Wave" tool to make sure we have sufficient contrast. Also a quick test was done to check that the dashboard is navigable using only the keyboard.

The pagination buttons have the role of `navigation` assigned to them with dynamic `aria-current` values based on which one is selected.
