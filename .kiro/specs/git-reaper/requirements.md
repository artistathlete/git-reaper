# Requirements Document

## Introduction

The Git Reaper is a web application that analyzes public GitHub repositories to identify and visualize "dead" branches - branches that have been merged into the main branch but not deleted. The application presents these dead branches in a graveyard-themed interface, with each branch represented as a tombstone displaying its name and last commit date.

## Glossary

- **Git Reaper**: The web application system that analyzes Git repositories and displays dead branches
- **Dead Branch**: A Git branch that has been merged into the main branch (master or main)
- **Tombstone Component**: A UI element representing a dead branch in the graveyard display
- **Main Branch**: The primary branch of a repository, typically named "master" or "main"
- **GitHub URL**: A valid URL pointing to a public GitHub repository
- **Bare Clone**: A Git clone operation that creates a repository without a working directory, used for efficiency

## Requirements

### Requirement 1

**User Story:** As a repository maintainer, I want to input a GitHub repository URL, so that I can analyze its dead branches.

#### Acceptance Criteria

1. WHEN the Git Reaper loads THEN the system SHALL display an input field for entering a GitHub repository URL
2. WHEN a user enters a URL THEN the system SHALL validate that the URL matches the GitHub repository URL format
3. WHEN the input field is empty or contains an invalid URL THEN the system SHALL prevent the analysis from starting
4. WHEN a valid URL is entered THEN the system SHALL enable the "Reap" button for user interaction

### Requirement 2

**User Story:** As a repository maintainer, I want to trigger the analysis with a button, so that I can see the dead branches in my repository.

#### Acceptance Criteria

1. WHEN a user clicks the "Reap" button with a valid URL THEN the system SHALL send a POST request to the `/api/reap` endpoint with the GitHub URL
2. WHEN the analysis is in progress THEN the system SHALL provide visual feedback indicating the operation is ongoing
3. WHEN the analysis completes successfully THEN the system SHALL display the results in the graveyard interface
4. IF the analysis fails THEN the system SHALL display an error message explaining the failure reason

### Requirement 3

**User Story:** As a repository maintainer, I want to see dead branches displayed as tombstones in a graveyard theme, so that the visualization is engaging and intuitive.

#### Acceptance Criteria

1. WHEN dead branches are returned from the API THEN the system SHALL display them in a graveyard-themed interface with a nighttime aesthetic
2. WHEN displaying dead branches THEN the system SHALL render each branch as a tombstone component in a grid layout
3. WHEN rendering a tombstone THEN the system SHALL display the branch name and the date of its last commit
4. WHEN no dead branches exist THEN the system SHALL display a message indicating the repository has no dead branches

### Requirement 4

**User Story:** As a repository maintainer, I want the backend to validate GitHub URLs, so that only valid repositories are analyzed.

#### Acceptance Criteria

1. WHEN the `/api/reap` endpoint receives a request THEN the system SHALL validate that the githubUrl field is present in the request body
2. WHEN validating a URL THEN the system SHALL verify it matches the pattern of a valid GitHub repository URL
3. IF the URL is invalid THEN the system SHALL return an error response with HTTP status 400 and a descriptive error message
4. WHEN the URL is valid THEN the system SHALL proceed with the repository analysis

### Requirement 5

**User Story:** As a repository maintainer, I want the backend to efficiently clone and analyze repositories, so that results are returned quickly.

#### Acceptance Criteria

1. WHEN analyzing a repository THEN the system SHALL clone the repository using the bare clone option to a temporary directory
2. WHEN the clone operation completes THEN the system SHALL execute Git commands to retrieve all remote branches
3. WHEN retrieving branches THEN the system SHALL identify which branches have been merged into the main branch
4. WHEN the analysis completes or fails THEN the system SHALL clean up the temporary directory
5. WHEN determining the main branch THEN the system SHALL check for both "main" and "master" branch names

### Requirement 6

**User Story:** As a repository maintainer, I want the backend to extract commit information for dead branches, so that I can see when each branch was last active.

#### Acceptance Criteria

1. WHEN a merged branch is identified THEN the system SHALL retrieve the date of its last commit
2. WHEN formatting branch data THEN the system SHALL create a DeadBranch object containing the branch name and last commit date as a string
3. WHEN all branches are processed THEN the system SHALL return a JSON array of DeadBranch objects to the frontend
4. WHEN formatting dates THEN the system SHALL use a consistent, human-readable date format

### Requirement 7

**User Story:** As a repository maintainer, I want the system to handle errors gracefully, so that I understand what went wrong when analysis fails.

#### Acceptance Criteria

1. IF the repository cannot be cloned THEN the system SHALL return an error indicating the repository is inaccessible or does not exist
2. IF Git commands fail during analysis THEN the system SHALL capture the error and return a descriptive error message
3. IF the repository has no main branch THEN the system SHALL return an error indicating the repository structure is unsupported
4. WHEN any error occurs THEN the system SHALL ensure temporary resources are cleaned up before returning the error response

### Requirement 8

**User Story:** As a repository maintainer, I want the analysis to complete within a reasonable timeframe, so that I don't wait indefinitely for results.

#### Acceptance Criteria

1. IF repository analysis takes longer than 90 seconds THEN the system SHALL stop the process and return a timeout error

### Requirement 9

**User Story:** As a repository maintainer, I want to quickly investigate a dead branch, so that I can understand its history on GitHub.

#### Acceptance Criteria

1. WHEN a user clicks a tombstone THEN the system SHALL open the corresponding last commit URL of that branch on GitHub in a new browser tab
