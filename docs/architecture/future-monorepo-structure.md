# Future Monorepo Structure

## Goal

Support:
- existing web app
- future React Native app
- shared business logic

Without duplicating architecture.

---

## Planned Structure

/apps
  /web
  /mobile

/packages
  /core

/docs

---

## Shared Core Responsibilities

/packages/core should contain:

- types
- validators
- API services
- business rules
- utilities
- shared domain logic

---

## Web App Responsibilities

/apps/web should contain:

- React web UI
- web navigation
- web-specific interactions
- web layouts

---

## Mobile App Responsibilities

/apps/mobile should contain:

- React Native UI
- mobile navigation
- native interactions
- mobile-specific UX flows

---

## Important Rules

- Share logic
- Do NOT share UI
- Keep domains isolated
- Preserve feature boundaries
- Avoid giant global stores