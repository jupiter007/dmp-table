# DMP Dashboard

This application will display a list of Data Management Plans (DMPs). This web application is intended to run in a desktop browser. Users can perform the following actions on the dashboard:

- Sort the DMPs by `title` or by `modified` fields
- Edit `Title`, `Contact Email`, `Abstract` or `Opportunity ID` fields
- Save any changes

This application was created as part of a technical interview challenge for the California Digital Library. Documentation about the challenge can be found here: https://github.com/CDLUC3/DMP-frontend-coding-exercise?tab=readme-ov-file. The GET requests are coming from actual records retrieved from `api.dmphub.uc3dev.cdlib.net/dmps/{dmp_id}` per this documentation: https://github.com/CDLUC3/dmsp_aws_prototype/wiki/api-overview#data-management-plans

The POST requests have been mocked in this application using `msw`. Mock files can be found in `./mocks` folder.

The font used in this application is Google's Public Sans, and the css is a mix of Bootstrap along with custom css.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It installs many commonly used tools for web apps and configures webpack to use standard configurations.

## Setup

Download or clone the respository.

In the project directory, you can run:

### `npm install`

This will add the node modules specified in package.json

### `node version`

Please use the latest node version. If you have `nvm`, you can run `nvm use node` before you start

### `npm start`

This will run the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view the DMP Dashboard in your browser.

When you make changes in the app while the app is running, the page will automatically reload.

You may also see any lint errors in the console.

Make sure you are using a more current version of node.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Credits

List of contributors:

- Juliet Shin
