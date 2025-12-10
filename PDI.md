# OT RACI Workshop App – PDI

## 1. Product Summary

The OT RACI Workshop App is a self-hosted web application that transforms a structured OT RACI Excel template into an interactive, workshop-ready tool for CIOs, CISOs, OT leadership, and plant operations. It guides stakeholders through clarifying who is Responsible, Accountable, Consulted, and Informed for key OT cyber and operational activities, automatically detecting gaps and misalignments and generating action-ready outputs.

## 2. Problem Statement

Organizations operating OT environments struggle with:

- Ambiguous ownership for OT cyber and operational controls.
- Overlap and conflict between IT, OT, vendors, and compliance teams.
- Difficulty translating frameworks and policies into clear decision rights.
- Workshops that generate slides but not structured, reusable data.

We need a tool that turns an OT RACI template into a guided workshop experience and persistent governance artifact.

## 3. Primary Users & Personas

1. **CIO / CISO / OT Executive**
   - Needs: Clear accountability, confidence that OT risk is owned and managed.
   - Uses app during workshops to agree on RACI, then review gap & action reports.

2. **OT Engineering / Plant Ops Leader**
   - Needs: Clarity on what their team is responsible for vs IT and vendors.
   - Uses app to negotiate realistic responsibilities and identify overload.

3. **Risk / Compliance / GRC Leader**
   - Needs: Mapped accountability to controls, frameworks, and policies.
   - Uses app output to feed into IRM/ServiceNow and assurance planning.

4. **Consultant / Facilitator (you)**
   - Needs: Repeatable, structured workshop method with strong visuals and exports.
   - Uses app end-to-end for preparation, facilitation, and follow-up.

## 4. Goals and Non-Goals

### Goals

- Ingest the OT RACI Excel template and map roles, activities, and recommended RACI.
- Support live workshops to capture and finalize RACI decisions per activity and role.
- Validate RACI structure (exactly one A, at least one R).
- Highlight gaps and conflicts, including deviations from recommended RACI.
- Generate exportable artifacts: RACI matrix, gap reports, and action plans.
- Run fully self-hosted (e.g., in a Docker container) with no dependency on external SaaS.

### Non-Goals

- Real-time multi-tenant SaaS platform (initially this is single-tenant/self-hosted).
- Full HR/role lifecycle management.
- Direct integration with ServiceNow in v1 (export files will support integration in later phases).

## 5. Success Metrics

- Workshop completion rate: ≥ 80% of in-scope activities have fully valid RACI by session end.
- Gap detection: 100% of activities with missing or conflicting RACI flagged.
- Executive satisfaction: ≥ 4/5 rating on “clarity of accountability” in post-workshop feedback.
- Adoption: App reused for at least 2+ follow-up workshops per customer.

## 6. Key Features

1. **RACI Template Import**
   - Upload Excel file.
   - Map sheets and columns to app fields.
   - Persist activities, domains, roles, and optional recommended RACI.

2. **Engagement/Workshop Setup**
   - Create named workshops linked to a specific customer/org.
   - Select which domains and activities are in scope.
   - Assign workshop participants to roles.

3. **Perception Check Mode**
   - Rapid capture of “who is accountable today?” for key activities.
   - Optional comparison against recommended RACI.

4. **Domain-based RACI Editor**
   - Tabbed or filterable view by domain.
   - Activity rows with RACI assignment controls.
   - Recommended vs. Workshop RACI comparison.
   - Validation rules (exactly one A, at least one R).

5. **Gap & Conflict Analytics**
   - Automatic detection of:
     - Missing A / multiple A.
     - No R.
     - Role overload (configurable thresholds).
     - Deviation from recommended RACI.

6. **Role Load and Summary Views**
   - Per-role breakdown of R/A/C/I counts.
   - Visual indicators of overload and misalignment.

7. **Action Plan Builder**
   - Convert flagged issues into structured actions with owners and due dates.
   - Allow adding custom actions.

8. **Export & Reporting**
   - Export full RACI matrix (CSV, Excel).
   - Export gap list and action plan.
   - Generate PDF summary pack.

9. **Self-hosting & Security**
   - Containerized deployment (Docker).
   - Local database (e.g., SQLite/PostgreSQL).
   - Basic authentication for workshop participants.
   - Data stored on customer-controlled infrastructure.

## 7. Data Model (Logical)

### Core Entities

- **Organization**
  - id
  - name
  - industry
  - notes

- **Workshop**
  - id
  - organization_id (FK)
  - name
  - date
  - description
  - status (planned / in-progress / completed)

- **Domain**
  - id
  - organization_id (FK) or global
  - name
  - description

- **Role**
  - id
  - organization_id (FK)
  - name (e.g., CIO, CISO, OT Engineering Manager)
  - category (IT, OT, Vendor, Compliance, Other)
  - description

- **Activity**
  - id
  - domain_id (FK)
  - code / reference_id (from template)
  - name
  - description
  - criticality (e.g., High/Medium/Low)
  - framework_refs (e.g., NIST CSF, IEC 62443, CIP mappings)

- **RecommendedRACI**
  - id
  - activity_id (FK)
  - role_id (FK)
  - value (R/A/C/I or None)

- **WorkshopRACI**
  - id
  - workshop_id (FK)
  - activity_id (FK)
  - role_id (FK)
  - value (R/A/C/I or None)

- **Issue (Gap/Conflict)**
  - id
  - workshop_id (FK)
  - activity_id (FK)
  - role_id (FK, nullable)
  - type (missing_A, multiple_A, no_R, deviation_from_recommended, role_overload)
  - severity (High/Medium/Low)
  - notes

- **ActionItem**
  - id
  - workshop_id (FK)
  - issue_id (FK, nullable)
  - summary
  - owner_role_id (FK)
  - owner_name (optional)
  - due_date
  - status (planned, in-progress, completed)
  - priority

## 8. User Flows (High-Level)

1. **Facilitator – Setup Flow**
   1. Log in.
   2. Create Organization (if new).
   3. Create Workshop.
   4. Upload RACI Template and map columns.
   5. Confirm imported domains, roles, and activities.
   6. Select scope (domains/activities) for this workshop.

2. **Workshop – Perception Check Flow**
   1. Open Workshop Overview page on big screen.
   2. Start Perception Check mode.
   3. For each key activity, select current accountable role.
   4. Optionally reveal recommended vs current.
   5. Save perception snapshot.

3. **Workshop – RACI Editing Flow**
   1. Choose domain and view activity list.
   2. For each activity:
      - Review description and context.
      - Assign A, then R, C, I.
   3. Resolve validation errors per activity.
   4. Mark domain as complete.

4. **Workshop – Gap & Action Flow**
   1. Go to Gap Report.
   2. Filter by gap type.
   3. For each issue, decide:
      - Change RACI immediately.
      - Or log an action.
   4. Build / refine action plan.
   5. Export outputs.

## 9. Risks & Mitigations

- **Risk:** Excel templates differ slightly between customers.
  - **Mitigation:** Flexible column mapping UI; clearly documented requirements.

- **Risk:** Workshop runs out of time before all activities are covered.
  - **Mitigation:** Allow partial completion; domain prioritization; quick “minimal viable RACI” mode for key activities.

- **Risk:** Overly complex UI for executives.
  - **Mitigation:** Clean, domain-based navigation; facilitator-centric controls; hide advanced options during workshop.

## 10. Roadmap (Future)

- Integrate with ServiceNow GRC/IRM via API (create roles, controls, ownership).
- Add per-person rather than per-role accountability (for operationalization).
- Add versioning and comparison between workshop iterations.

## 11. Workshop Flow Support

### Phase 0 – Pre-work (facilitator only)

Goal: Load their context and your template into the app.

The app should allow:
- Creating an engagement/workshop record with customer metadata.
- Importing the OT RACI template (activities, domains, roles, recommended RACI, criticality).
- Selecting which domains/activities are in scope for the upcoming workshop.

### Phase 1 – Executive framing (15–30 minutes)

Goal: Align on objectives and outputs.

- Workshop overview page summarizing objectives, scope, and participants.
- Visual counters for in-scope activities, completion status, and open issues.

### Phase 2 – Perception check (15–30 minutes)

Goal: Capture leadership’s current view before showing baseline.

- Quick poll mode for “who is accountable today?” on high-impact activities.
- Optional view comparing perception vs recommended A.

### Phase 3 – Domain-by-domain RACI working session (60–90+ minutes)

Goal: Finalize RACI decisions.

- Domain dashboard with progress and status.
- Activity RACI editor with validation (exactly one A, at least one R).
- Side-by-side recommended vs workshop RACI highlighting differences.
- Bulk options: mark out-of-scope, defer decisions, or mark complete per activity.

### Phase 4 – Gap & conflict review (30–45 minutes)

Goal: Turn gaps into decisions.

- Gap report with filters for missing A, multiple A, no R, role overload, deviation from recommended.
- Role load view for R/A/C/I counts per role with overload highlights.
- Decision notes per issue.

### Phase 5 – Action plan & export (15–30 minutes)

Goal: Leave with next steps.

- Action plan builder pre-populated from issues with owners, due dates, priority, and status.
- Export center for RACI matrix, gap list, action plan (Excel/CSV) and executive PDF pack.

## 12. Screen Wireframes (Textual)

- **Workshop List:** New Workshop button; table with name, org, date, status, and view link.
- **Workshop Overview:** Objectives, scope, participants; cards showing in-scope counts, completion, open issues; buttons for perception check, domains, gap report.
- **Perception Check:** Activity detail with accountable role selection, skip/back/next controls, optional recommended A toggle.
- **Domain RACI Editor:** Domain filter, status filter, progress indicator; grid of activities vs roles with R/A/C/I/None controls; sidebar with activity details, recommended RACI, and validation messages.
- **Gap Report:** Filters by gap type/domain/severity; rows with issue type, activity, description, and buttons to go to activity or create action.
- **Action Plan:** Add action button; table with summary, linked issue, domain, owner, due date, priority, status; export buttons for Excel/CSV/PDF.

## 13. Data Capture & Inputs

- **Template Import:** Upload Excel; map sheets/columns for activity metadata, criticality, recommended R/A/C/I, and role catalog; persist to domain, activity, role, and recommended RACI tables.
- **Workshop Setup:** Input organization/workshop metadata and select in-scope domains/activities.
- **Perception Check:** Store accountable role per selected activity (as perception snapshot or WorkshopRACI source).
- **RACI Editor:** Capture R/A/C/I/None per activity/role with validation; create issues for structural violations.
- **Gap Resolution & Actions:** Convert issues into actions with summary, owner, due date, priority, and status.

## 14. Tech Stack Suggestion (Self-hosted)

- Backend: FastAPI (Python) with SQLAlchemy and SQLite/PostgreSQL.
- Frontend: React (Vite) or Next.js with Tailwind CSS and motion/react for animations.
- Deployment: Docker Compose with web, API, and DB services; basic authentication; all data stored locally.

## 15. Success Criteria Checklist

- Workshop-ready with no manual spreadsheet editing during sessions.
- Spreadsheet-driven import of template (activities, domains, roles, recommended RACI).
- RACI decision capture with validation (one A, at least one R).
- Gap/conflict analysis (missing A, multiple A, no R, role overload, deviation from recommended).
- Structured workshop flow support (overview, perception check, domain walkthrough, gap review, action plan).
- Exports for RACI matrix, gap report, and action plan (CSV/Excel/PDF).
- Self-hosted deployment without external SaaS dependencies.
