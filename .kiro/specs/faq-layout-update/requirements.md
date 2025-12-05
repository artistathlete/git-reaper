# Requirements Document

## Introduction

This feature updates the landing page layout to reposition the FAQ section below the Popular Repositories grid and reduce its visual footprint. The goal is to prioritize the interactive repository selection experience while keeping helpful information accessible.

## Glossary

- **FAQ Section**: The collapsible accordion component displaying frequently asked questions and answers
- **Popular Repositories Grid**: The grid of clickable repository cards that allow quick repository selection
- **Landing Page**: The main home page displayed when no analysis is in progress

## Requirements

### Requirement 1

**User Story:** As a user, I want to see popular repositories prominently displayed, so that I can quickly start analyzing a repository without scrolling.

#### Acceptance Criteria

1. WHEN the landing page loads THEN the system SHALL display the Popular Repositories grid above the FAQ section
2. WHEN the landing page renders THEN the system SHALL position the FAQ section as the last content element before the footer area

### Requirement 2

**User Story:** As a user, I want a compact FAQ section, so that it doesn't dominate the page while still being accessible.

#### Acceptance Criteria

1. WHEN the FAQ section renders THEN the system SHALL display with reduced vertical spacing compared to the current implementation
2. WHEN the FAQ section renders THEN the system SHALL use a more compact typography scale for content
3. WHEN the FAQ accordion is collapsed THEN the system SHALL occupy minimal vertical space on the page

### Requirement 3

**User Story:** As a user, I want a compact token input section, so that it doesn't distract from the main repository input experience.

#### Acceptance Criteria

1. WHEN the token section renders THEN the system SHALL display with reduced vertical spacing and smaller typography
2. WHEN the token section is collapsed THEN the system SHALL occupy minimal vertical space on the page
