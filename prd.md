# Product Requirements Document (PRD) for Resonex

## 1. Document Control

- **Product Name:** Resonex
- **Version:** 1.0
- **Author:** Sunny
- **Last Updated:** 2025-07-18

---

## 2. Purpose

The purpose of this document is to define the product requirements for Resonex, an AI-powered newsletter automation platform built for the Convex + Resend Hackathon. The document outlines functional and non-functional requirements, system architecture, data models, key workflows, and success metrics.

---

## 3. Scope

Resonex enables users to:

- Generate newsletter content from a prompt using LLMs
- Automatically create and schedule A/B tested campaigns
- Send newsletters via Resend
- Track campaign performance (opens, bounces, clicks) via webhooks
- Recommend optimal send times based on historical engagement data

The system is optimized for small businesses, indie creators, and marketers aiming to automate and optimize newsletter campaigns.

---

## 4. Stakeholders

- **Product Owner:** Sunny
- **Technical Lead:** \[TBD]
- **Frontend Engineer:** \[TBD]
- **Backend Engineer:** \[TBD]
- **Designer:** \[TBD]

---

## 5. Functional Requirements

### 5.1 Prompt-Based Newsletter Generation

- Users input a natural language prompt (e.g., "Weekly fintech digest")
- System generates:
  - Email body (header, intro, main content, CTA)
  - Two subject line variants (A/B)
  - Recommended calendar slots

### 5.2 Campaign Review and Editing

- Users can review and edit:
  - Subject lines
  - Email body
  - Scheduled send time

### 5.3 A/B Testing and Scheduling

- The system schedules two batches of emails with subject line A and B
- Sends are managed via Convex cron jobs
- Uses Resend for email dispatch

### 5.4 Real-Time Event Tracking

- Listens for Resend webhook events:
  - `delivered`
  - `opened`
  - `bounced`
  - `clicked`

- Stores per-user and per-campaign metrics

### 5.5 Calendar-Based Recommendation Engine

- Logs all send-time windows and engagement rates
- Builds a preference model per user
- Recommends best time blocks (e.g., "Tuesdays 10 AM") for future campaigns

### 5.6 Dashboard and Analytics

- Graphs showing:
  - A/B open rates
  - Bounce rates
  - Click-through rates (if tracked)
  - Historical performance over time

- “Winner” subject line indicated clearly post-campaign

---

## 6. Non-Functional Requirements

### 6.1 Performance

- Email generation latency: < 2 seconds
- Email delivery scheduling: reliable up to 10k recipients per campaign

### 6.2 Reliability

- Webhook handling should be idempotent and durable
- Email send tasks must retry up to 3x with exponential backoff

### 6.3 Security

- Input prompts and email templates are stored securely and scoped per user
- Webhook endpoints should validate Resend signatures

### 6.4 Scalability

- System should support horizontal scaling to accommodate concurrent campaigns

### 6.5 Usability

- Simple and modern UI
- Real-time feedback and validation for user input

---

## 7. Technical Architecture

### Frontend

- Next.js + TailwindCSS
- React Calendar UI
- Toast/alerts for status feedback

### Backend

- Convex as primary backend (data, cron, background tasks)
- OpenAI API via Convex server actions
- Resend email API
- Convex HTTP Router for webhook ingestion

---

## 8. Data Models (Convex)

### 8.1 `campaigns`

```ts
{
  _id: string,
  userId: string,
  prompt: string,
  subjectLines: { A: string, B: string },
  body: string,
  recipients: string[],
  sendTimeA: datetime,
  sendTimeB: datetime,
  status: "draft" | "scheduled" | "sent",
  category: string
}
```

### 8.2 `events`

```ts
{
  emailId: string,
  campaignId: string,
  recipient: string,
  variant: "A" | "B",
  type: "delivered" | "opened" | "bounced" | "clicked",
  timestamp: datetime
}
```

### 8.3 `recommendations`

```ts
{
  userId: string,
  category: string,
  timeScores: Array<{ dayOfWeek: string, hour: number, score: number }>
}
```

---

## 9. Key Workflows

### 9.1 Newsletter Generation

1. User inputs a prompt
2. Backend calls OpenAI
3. Generated content, subject lines, and schedule suggestions returned
4. Stored in `campaigns`

### 9.2 Campaign Execution

1. User schedules campaign
2. Convex schedules two sends for A and B
3. Resend sends emails in two batches
4. Webhooks log engagement events in `events`
5. A/B winner determined

### 9.3 Calendar Optimization

1. After multiple campaigns, aggregate engagement data
2. Update `recommendations` scores per time slot
3. Use scores to highlight future best time slots

---

## 10. Metrics for Success

- Avg. open rate across campaigns
- Open rate uplift via A/B testing (>5%)
- Time-to-publish (prompt to schedule) < 3 minutes
- # of users with increased engagement from recommendations

---

## 11. Milestones

| Phase   | Deliverables                      | ETA     |
| ------- | --------------------------------- | ------- |
| Phase 1 | Prompt input, template generation | Day 1–2 |
| Phase 2 | Calendar UI, scheduling logic     | Day 2–3 |
| Phase 3 | A/B testing and webhook ingestion | Day 4–5 |
| Phase 4 | Dashboard, recommendations engine | Day 6–7 |
| Final   | Polish, test, submit demo         | Day 8   |

---

## 12. Open Questions

- Should recipients be imported/uploaded or managed natively?
- Should users be able to run multiple simultaneous campaigns?
- Is link click tracking within scope for MVP?

---

## 13. Appendix

- Resend Docs: [https://resend.com/docs](https://resend.com/docs)
- Convex Docs: [https://docs.convex.dev](https://docs.convex.dev)
- OpenAI Prompt Examples: \[TBD]

---
