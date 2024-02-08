# User Documentation: Virtual Labs Workflow

## Introduction

The Virtual Labs Workflow tool streamlines the process of configuring and triggering the deployment of multiple labs. Previously, this was done manually through GitHub, requiring hosting engineers to deploy each lab separately.

## Target User

This tool is designed for hosting engineers of virtual labs responsible for deploying labs efficiently.

## Lab Deployment Process

Lab deployment involves committing descriptors, selecting workflows, and triggering processes. The Virtual Labs Workflow tool simplifies this by providing an interface for committing and triggering workflows for multiple labs with a single click. Additionally, it displays hosting information for deployed labs.

## 4. User Interface

### Searching Labs and Saving Descriptors

- **Login:**

  - Users must log in using their GitHub credentials.
  - Upon successful login, the dashboard is displayed.

  <img src="./img/dashboard.png">

- **Lab Search:**

  - Users can search for labs by name, institute, etc.
  - Clicking on a result loads the lab descriptor on the right half of the container.
  - The descriptor is editable and can be saved using the "Save" button.
  - The "Valid Descriptor" label indicates whether the loaded descriptor is valid.

  <img src="./img/dashboard-2.png">

### Adding a Lab

- **Add Lab:**

  - Click on "Add Lab" in the Navbar.
  - In the "Add Lab" modal, enter the lab repository link and click "Load" to load the lab.
  - Click "Add" to include the lab in the "GA4 Lab List."

  <img src="./img/add-lab.png">

### Deploying Labs

- **Adding Labs to Deploy:**

  - Click on "Add to deploy" to select labs for deployment.

  - Provide necessary information about Hosting Request URL, Hosting Requester, and Hosting Request date.

  <img src="./img/deploy-1.png">
  <img src="./img/deploy-2.png">
  <img src="./img/deploy-3.png">

- **Deployment:**
  - Click on "Go to deploy" in the Navbar.
    <img src="./img/deploy-4.png">
  - Verify details and click "Deploy Labs."
    <img src="./img/deploy-5.png">
    <img src="./img/deploy-6.png">

### Hosting Information

- **Viewing Hosting Information:**

  - Click on "Hosting Info" in the Navbar to access deployed labs' information.
  - Apply filters on columns and time to refine the view.

    <img src="./img/hosting.png">

## Logging Out

- Click on "Logout" in the Navbar to log out of the application.

<img src="./img/dashboard
.png">
