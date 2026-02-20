# Specification: Divisional Charts Page

> Status: FINALIZED
> Owner: User

## 1. Overview

Implement and verify the "Divisional Charts" page (Page 5) of the Basic Horoscope PDF report. This page displays a 3x3 grid of divisional charts (D2, D3, etc.) tailored to the user's birth details.

## 2. User Stories

- As a user, I want to see a clear 3x3 grid of divisional charts in my PDF report.
- As a user, I want accurate planetary positions in each chart.
- As a user, I want the charts to be labeled correctly in English or Hindi.

## 3. Functional Requirements

- **Data Fetching:** Retrieve D1-D12, SUN, MOON, and Chalit charts from the backend.
- **Rendering:** Render 9 specific charts in a grid on Page 5.
- **Styling:** Match existing North Indian chart style (diamond layout).
- **Localization:** Support English and Hindi titles/subtitles.

## 4. Technical Constraints

- Use `jspdf` and `jspdf-autotable`.
- Reuse `drawNorthIndianChart` helper.
- handle varied API response formats (Array vs Object).

## 5. Non-Functional Requirements

- **Performance:** Rendering should not significantly slow down PDF generation.
- **Error Handling:** Gracefully handle missing or malformed chart data (show empty chart or placeholder).
