# Campaign Platform for Anonymous User Upload

A JAMstack campaign platform initially built for an organisation running a mobile poster print shop ahead of the 2026 Swedish elections. The platform lets anonymous visitors submit poster motives for review and potential publication, subscribe to a newsletter, and browse upcoming events. Admins manage submissions and content through Sanity Studio.

---

## What makes this repository different

Most Next.js + Sanity projects are straightforward content sites. This one has a specific set of constraints that shaped every architectural decision:

**Anonymous contributions by design.** Visitors upload poster motives without creating an account. No authentication, no tracking, and the lowest possible barrier to participation.

**Personal data never enters Sanity.** If a visitor provides an email address (entirely optional), it is sent directly to Brevo via an API route and never written to the CMS. This is a deliberate GDPR decision, not an oversight. Sanity holds zero PII.

**Pseudonymised contributor tracking.** The only link between a Sanity submission and a Brevo contact is a 12-character SHA-256 hash of the email address (`contributorId`). The hash is one-way and irreversible. If a contributor emails Skyddsrummet about their submission, an admin can cross-reference via Brevo's CSV export, without exposing personal data in the CMS.

**Free-tier constraints drove architecture.** Sanity's free plan does not support private assets. Uploaded files are technically reachable via CDN URL if someone knows the link. This is documented as a known limitation. Privatising assets is listed as a priority for production use and requires upgrading to a paid Sanity plan.

**Approval and publishing are separate steps.** Submissions go through a physical test print before being approved. `status` (`pending` / `approved` / `rejected`) tracks the review decision. A separate `isPublished` boolean controls gallery visibility, since an approved motive isn't necessarily printed and added to the gallery yet. This mirrors the organisation's actual workflow: review and print happen at different times.

**Newsletter opt-in requires explicit consent.** Subscribing requires checking a consent checkbox in addition to providing an email address, validated client- and server-side.

---

## Tech stack

| Layer          | Technology            | Why                                                                            |
| -------------- | --------------------- | ------------------------------------------------------------------------------ |
| Frontend + API | Next.js 16 / React 19 | App Router, built-in API routes, SSG/ISR                                       |
| CMS + assets   | Sanity                | Headless, hosted CDN, Studio for moderation, free plan sufficient              |
| Email / opt-in | Brevo                 | EU data storage, GDPR-compliant double opt-in, unlimited contacts on free plan |
| Hosting        | Vercel                | Standard Next.js configuration, manual production deploy via script            |
| Forms          | React Hook Form + Zod | Minimal boilerplate, shared schema between client and API route                |
| Testing        | Jest + next/jest      | SWC compilation, no Babel, minimal config                                      |

---

## Architecture

The platform follows a JAMstack pattern: a statically generated frontend, a headless CMS for content and assets, and serverless API routes for write operations.

```mermaid
%%{init: {'theme':'base'}}%%
graph TD
    Visitor([Visitor])
    Admin([Admin])

    Next["Next.js\nApp + API routes"]
    Sanity["Sanity\nCMS + asset CDN"]
    Brevo["Brevo\nEmail + opt-in"]
    Vercel["Vercel\nHosting"]

    Visitor -->|"uploads / views"| Next
    Admin -->|"moderates in Studio"| Sanity
    Next -->|"reads / writes"| Sanity
    Next -->|"opt-in contact"| Brevo
    Next -->|"hosted on"| Vercel

    classDef actor fill:#ECECFF,stroke:#9370DB,stroke-width:1px
    classDef app fill:#E8F4FD,stroke:#4A90D9,stroke-width:1px
    classDef sanity fill:#FFF4E0,stroke:#E8A33D,stroke-width:1px
    classDef brevo fill:#E3F6E8,stroke:#3DA563,stroke-width:1px
    classDef vercel fill:#F0F0F0,stroke:#666666,stroke-width:1px

    class Visitor,Admin actor
    class Next app
    class Sanity sanity
    class Brevo brevo
    class Vercel vercel
```

---

## Upload flow

The upload flow is the core of the platform's GDPR design. Personal data and image data travel separate paths and are never co-located.

```mermaid
%%{init: {'theme':'base'}}%%
flowchart TD
    A([Visitor submits form])
    B["Server-side validation\nPNG / JPG · max 5 MB"]
    C["Asset → Sanity CDN\nstatus: pending · isPublished: false"]
    D{Email provided?}
    E["contributorId =\n'Har ej angett kontaktuppgifter'"]
    F["SHA-256 hash of email\n→ 12-char contributorId\none-way · irreversible"]
    G["Contact created in Brevo\nemail + contributorId\n— never written to Sanity —"]

    A --> B --> C --> D
    D -->|No| E
    D -->|Yes| F --> G

    classDef actor fill:#ECECFF,stroke:#9370DB,stroke-width:1px
    classDef app fill:#E8F4FD,stroke:#4A90D9,stroke-width:1px
    classDef sanity fill:#FFF4E0,stroke:#E8A33D,stroke-width:1px
    classDef brevo fill:#E3F6E8,stroke:#3DA563,stroke-width:1px
    classDef neutral fill:#F0F0F0,stroke:#666666,stroke-width:1px

    class A actor
    class B,C app
    class D neutral
    class E neutral
    class F sanity
    class G brevo
```

Once a motive is approved, the organisation can identify the contributor by matching the `contributorId` on the Sanity document against the `CONTRIBUTOR_ID` attribute on the Brevo contact. No personal data needs to leave Brevo to make this connection.

```mermaid
%%{init: {'theme':'base'}}%%
flowchart LR
    A["Sanity document\ncontributorId: a3f9c2d1e4b8"]
    B["Brevo contact\nCONTRIBUTOR_ID: a3f9c2d1e4b8"]
    C([Admin matches the two records])

    A -->|same hash| C
    B -->|same hash| C

    classDef sanity fill:#FFF4E0,stroke:#E8A33D,stroke-width:1px
    classDef brevo fill:#E3F6E8,stroke:#3DA563,stroke-width:1px
    classDef actor fill:#ECECFF,stroke:#9370DB,stroke-width:1px

    class A sanity
    class B brevo
    class C actor
```

---

## GDPR summary

| Data                       | Where it lives   | Notes                                           |
| -------------------------- | ---------------- | ----------------------------------------------- |
| Uploaded image             | Sanity CDN       | No personal data attached                       |
| `contributorId`            | Sanity document  | SHA-256 hash, cannot be reversed                |
| Email address              | Brevo only       | Never written to Sanity                         |
| First name                 | Brevo only       | Optional, never written to Sanity               |
| Newsletter consent          | Required at signup | Explicit checkbox, validated client + server  |
| Double opt-in confirmation | Brevo automation | Two-automation pattern for instant confirmation |

### Contributor matching

If the organisation needs to identify who submitted a specific motive, for example to notify a contributor that their design was selected, an admin cross-references the `contributorId` stored on the Sanity document against the matching contact in Brevo. No personal data ever needs to leave Brevo to make this connection.

```mermaid
%%{init: {'theme':'base'}}%%
flowchart LR
    A["Sanity document
contributorId: a3f9c2d1e4b8"]
    B["Brevo contact
CONTRIBUTOR_ID: a3f9c2d1e4b8"]
    C([Admin matches the two records])

    A -->|same hash| C
    B -->|same hash| C

    classDef sanity fill:#FFF4E0,stroke:#E8A33D,stroke-width:1px
    classDef brevo fill:#E3F6E8,stroke:#3DA563,stroke-width:1px
    classDef actor fill:#ECECFF,stroke:#9370DB,stroke-width:1px

    class A sanity
    class B brevo
    class C actor
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A Sanity project (free plan is sufficient)
- A Brevo account with a configured list and double opt-in automation
- A Vercel account for deployment

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2025-05-18
SANITY_API_WRITE_TOKEN=

BREVO_API_KEY=
BREVO_PENDING_LIST_ID=
BREVO_NEWSLETTER_LIST_ID=
BREVO_CONTRIBUTORS_LIST_ID=
```

**Vercel's Environment Variables dashboard is not the source of truth for this project.** Deploys are built locally (see "Deployments run via CLI" below), and Next.js loads `.env.local` directly from the filesystem during that build, independent of whatever is configured in Vercel's dashboard. In practice this means the values that end up live in production are whatever is in the local `.env.local` file at the time someone runs `yarn deploy`, not what's set in Vercel's project settings. The dashboard may be empty or outdated and production can still work correctly. This is a known single-point-of-failure: if `.env.local` is lost, or a deploy is ever run from a different machine without it, production secrets go missing silently. There is no redundant copy of these values in Vercel itself.

`.env.test` is committed to the repository and contains mock values used by Jest. No setup needed to run the test suite.

### Run locally

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/studio](http://localhost:3000/studio) for Sanity Studio.

### Commands

```bash
yarn dev        # Start development server
yarn build      # Production build
yarn start      # Start production server
yarn test       # Run Jest test suite
yarn lint       # ESLint
yarn ts         # TypeScript type-check (no emit)
yarn deploy     # Build locally and deploy prebuilt output to Vercel
```

---

## Constraints & decisions

**Deployments run via CLI, not git push.** `yarn deploy` runs `vercel build --prod && vercel deploy --prebuilt --prod`. The build happens locally and only the output is uploaded. Vercel never runs a build on their end. This keeps the project well within Vercel Hobby's 200 build execution hours per month, which is consumed by every git-push-triggered build. Deployments via CLI typically complete in ~13 seconds. A direct consequence: production environment variables come from the local `.env.local` file at build time, not from Vercel's dashboard. See "Environment variables" above.

**Asset visibility.** Sanity's free plan does not support private assets (`visibility: private`). Uploaded files are accessible via CDN URL if someone knows the link. This is an accepted trade-off for the current scope. Privatising assets is a priority for production use and requires a [paid Sanity plan](https://www.sanity.io/pricing).

**Vercel bandwidth.** Cap is 100 GB/month on the free plan. Static pages served from CDN handle high traffic efficiently, but a viral campaign could exceed the cap. Upgrade path is [Vercel Pro](https://vercel.com/pricing) (~$20/month).

**Brevo sending limit.** ~9,000 emails/month on the free plan. Sufficient for a campaign newsletter but worth monitoring if the subscriber list grows quickly. See [Brevo pricing](https://www.brevo.com/pricing/).

**Homepage uses a reserved slug, not a singleton.** The homepage is a regular `page` document with the reserved slug `"home"`, rendered at the index route (`/`). This was a deliberate choice over a dedicated `homepage` singleton: it allows drafting multiple homepage variants and switching the active one by changing the slug, which suits a campaign platform that may want to test different landing pages. The trade-off is that nothing in the schema prevents an admin from accidentally renaming the `home` slug; this is mitigated with a field description in Studio. The URL `/home` itself returns a 404, since it would otherwise collide with `/`.

**Gallery page uses the same dynamic route as content pages.** There is no dedicated `/gallery` route. The gallery is a `galleryPage` document type, matched by `[slug]/page.tsx` alongside regular `page` documents, with a `documentId`-locked singleton in Studio. If no slug is set, it falls back to `"galleri"`.

---

## Project structure

```
app/
  (main)/          # Public-facing pages
    page.tsx       # Home, content driven by Sanity slug "home"
    [slug]/        # Dynamic pages and the gallery (galleryPage doc type)
  api/
    upload/        # POST: validates file, creates Sanity doc, calls Brevo
    newsletter/    # POST: subscribes contact to Brevo newsletter list
  studio/          # Embedded Sanity Studio

components/
  sections/        # Section components rendered by SectionRenderer

lib/
  brevo.ts         # saveUploadContact, subscribeNewsletter
  upload.ts        # Shared file validation constants
  utils.ts         # slugify and other shared helpers
  schemas/         # Zod schemas, shared between client and API routes

sanity/
  schemaTypes/     # documents/, sections/, singletons/, ui/
  structure.ts     # Studio structure: Pending / Approved / Rejected nodes, singletons
  lib/queries.ts   # All GROQ queries, no query logic in components

__tests__/         # Jest tests for API routes
```
