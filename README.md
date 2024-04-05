# Virtual Labs Workflow

## Introduction

The Virtual Labs Workflow tool simplifies the lab deployment process for hosting engineers, providing an efficient interface for configuring and triggering multiple lab deployments. Previously, this process was manual and required separate deployment for each lab through GitHub.

## Target Audience

The Virtual Labs Workflow tool is designed for hosting engineers responsible for deploying labs. The primary user group includes those involved in the deployment process, seeking a streamlined solution to deploy multiple labs with minimal effort.

## Feature List

### 1. Lab Deployment Workflow

- **Lab Configuration:**

  - Hosting engineers can commit and trigger workflows for multiple labs with a single click.
  - The tool provides an interface to commit and trigger workflows, saving time and effort compared to manual GitHub processes.

- **Search and Save Descriptors:**

  - Users can search for labs by name or institute, and the tool displays corresponding lab descriptors.
  - Lab descriptors are editable and can be saved with a "Save" button.
  - The tool validates the descriptor against the schema, providing feedback on its validity.

- **Adding Labs to Deploy:**

  - Hosting engineers can add labs to the deployment list and provide necessary information about Hosting Request URL, Requester, and Request date.

- **Deploying Labs:**

  - Verification of lab details before deployment.
  - One-click deployment for selected labs.

- **Hosting Information:**
  - View deployed labs information, apply filters on columns and time.
  - This tool also helps to maintain complete history of all deployments and helps user gather statistics about the deployments.

## DOCS

| DOCUMENT                                      | DESCRIPTION                                                                                                           |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [User Documentation](./docs/user_doc.md)      | Comprehensive user documentation for Virtual Labs Workflow, guiding hosting engineers through the deployment process. |
| [Technical Documentation](./docs/tech_doc.md) | Detailed technical documentation providing insights into the architecture, technologies, and API details of the tool. |
