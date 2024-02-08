# Technical Documentation: Virtual Labs Workflow

## Table of Contents

- [Introduction](#introduction)
- [Architecture and Technologies](#architecture-and-technologies)
- [Dependencies](#dependencies)
- [Backend Infrastructure](#backend-infrastructure)
- [API Endpoints and Methods](#api-endpoints-and-methods)
- [Security Measures](#security-measures)
- [Authentication and Authorization](#authentication-and-authorization)
- [Deployment Process](#deployment-process)

## Introduction

The Virtual Labs Workflow tool streamlines lab deployment processes for hosting engineers. It provides an interface to configure and trigger multiple lab deployments with ease.

## Architecture and Technologies

- The web app consists of three components: frontend, backend, and a Google Sheet for lab and deployment information.
- Backend: Node.js + Express.js with secret credentials (Google Service Account Secret, GitHub OAuth App Client Secret).
- Frontend: ReactJS.

## Dependencies

- Backend and frontend dependencies with versions can be found in their respective package.json files.

## Backend Infrastructure

- Handles connections to Google Sheet and GitHub using Googleapis and Octokit libraries.
- OAuth authorization for secure access.
- GitHub access token stored on frontend and sent with requests to the backend.
- Lab and deployment data stored in Google Sheet.

## API Endpoints and Methods

1. **Get Labs:**

   - **API Endpoint:** `/`
   - **HTTP Method:** GET
   - **Functionality:** Retrieves information about labs.

2. **Get Lab Descriptor:**

   - **API Endpoint:** `/get_descriptor`
   - **HTTP Method:** GET
   - **Functionality:** Retrieves the descriptor for a specific lab.

3. **Commit Descriptor:**

   - **API Endpoint:** `/commit_descriptor`
   - **HTTP Method:** POST
   - **Functionality:** Commits a lab descriptor. Expects the descriptor data in the request body.

4. **Add Lab:**

   - **API Endpoint:** `/add_lab`
   - **HTTP Method:** POST
   - **Functionality:** Adds a lab to the system. Expects lab details in the request body.

5. **Deploy Lab:**

   - **API Endpoint:** `/deploy`
   - **HTTP Method:** POST
   - **Functionality:** Initiates the deployment of labs. Expects deployment details in the request body.

6. **Status Lab:**

   - **API Endpoint:** `/status`
   - **HTTP Method:** POST
   - **Functionality:** Retrieves the status of a lab. Expects lab details in the request body.

7. **Add Analytics:**

   - **API Endpoint:** `/add_analytics`
   - **HTTP Method:** POST
   - **Functionality:** Adds analytics data for a lab. Expects analytics data in the request body.

8. **Create Tag:**

   - **API Endpoint:** `/create_tag`
   - **HTTP Method:** POST
   - **Functionality:** Creates a tag for a lab. Expects tag details in the request body.

9. **Get Latest Tag:**

   - **API Endpoint:** `/get_latest_tag`
   - **HTTP Method:** GET
   - **Functionality:** Retrieves the latest tag for a lab.

10. **Get Deployed Lab List:**

    - **API Endpoint:** `/get_deployed_lab_list`
    - **HTTP Method:** GET
    - **Functionality:** Retrieves a list of deployed labs.

11. **Revert Tag:**

    - **API Endpoint:** `/revert_tag`
    - **HTTP Method:** POST
    - **Functionality:** Reverts a tag for a lab. Expects tag details in the request body.

12. **Get Deployed Labs:**
    - **API Endpoint:** `/get_deployed_labs`
    - **HTTP Method:** GET
    - **Functionality:** Retrieves information about deployed labs.

## Security Measures

- GitHub access token securely stored on the frontend.
- Google Service Account securely stored on the backend.

## Authentication and Authorization

- GitHub OAuth App used for user authorization.
- Setup Github OAuth App with the following details:
  - **Homepage URL:** `{frontendURL}`
  - **Authorization callback URL:** `{frontendURL}/callback`

## Secrets

- Google Service Account Secret

  - **Location:** `backend/secrets/service-account-secret.json`
  - **Purpose:** Used to authenticate the backend with Google Sheets.

- GitHub OAuth App Client Secret

  - **Location:** `backend/.env`
  - **Purpose:** Used to authenticate the frontend with GitHub.

  ```
  GITHUB_OWNER=virtual-labs
  GITHUB_CLIENT_ID=
  GITHUB_CLIENT_SECRET=
  GITHUB_CALLBACK_URL=
  GITHUB_DEPLOYMENT_WORKFLOW=
  ```

- Google Sheet ID

  - **Location:** `backend/secrets/spreadsheet.js`
  - **Purpose:** Used to access the Google Sheet.

  ```javascript
  const SPREADSHEET_ID = "";
  const SPREADSHEET_RANGE = "GA4 Lab List!A:Z";
  const SPREADSHEET_NAME = "GA4 Lab List";
  const SPREADSHEET_HOSTING_NAME = "Phase-III-Hosting info";
  const SPREADSHEET_HOSTING_RANGE = "Phase-III-Hosting info!A:Z";
  module.exports = {
    SPREADSHEET_ID,
    SPREADSHEET_RANGE,
    SPREADSHEET_NAME,
    SPREADSHEET_HOSTING_NAME,
    SPREADSHEET_HOSTING_RANGE,
  };
  ```

## Deployment Process

[Placeholder: Details about the deployment process are yet to be provided.]

```

```
