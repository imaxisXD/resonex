# Resonex - AI-Powered Newsletter Automation Platform

Resonex is an AI-powered newsletter automation platform built for the Convex + Resend Hackathon. It enables users to generate newsletter content from prompts using LLMs, automatically create and schedule A/B tested campaigns, send newsletters via Resend, and track campaign performance with real-time analytics.

## Features

- **AI-Powered Content Generation**: Generate newsletter content from natural language prompts using OpenAI
- **A/B Testing**: Automatically create and test two subject line variants for optimal performance
- **Smart Scheduling**: Get recommendations for optimal send times based on historical engagement data
- **Real-Time Analytics**: Track opens, clicks, bounces, and other engagement metrics via webhooks
- **Campaign Management**: Create, edit, schedule, and monitor newsletter campaigns
- **Recipient Management**: Import recipient lists via CSV upload
- **Performance Insights**: View detailed analytics and A/B test results

## Tech Stack

### Frontend

- **Next.js 15** - React framework with app router
- **TypeScript** - Type safety and better developer experience
- **TailwindCSS** - Utility-first CSS framework
- **React Calendar** - Calendar component for scheduling

### Backend

- **Convex** - Real-time backend with database, server functions, and scheduling
- **OpenAI API** - AI content generation
- **Resend** - Email delivery service
- **Webhooks** - Real-time event tracking

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Resend API key

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd resonex
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
CONVEX_DEPLOYMENT=<your-convex-deployment>
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
OPENAI_API_KEY=<your-openai-api-key>
RESEND_API_KEY=<your-resend-api-key>
```

4. Set up Convex:

```bash
npx convex dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Campaign

1. Click "Create Campaign" from the dashboard
2. Enter a prompt describing your newsletter content (e.g., "Weekly fintech digest covering latest trends")
3. Select a category for better recommendations
4. Review and edit the AI-generated content and subject lines
5. Upload recipient list via CSV
6. Schedule the A/B test send times
7. Launch your campaign!

### Monitoring Performance

- View real-time analytics on the dashboard
- Track A/B test performance and winner selection
- Monitor engagement metrics (opens, clicks, bounces)
- Get recommendations for optimal send times

### Setting Up Webhooks

Configure your Resend webhook endpoint to point to:

```
https://your-convex-deployment.convex.cloud/webhooks/resend
```

This enables real-time tracking of email events.

## Database Schema

### Campaigns

- Campaign metadata, content, subject lines, recipients
- Send scheduling and status tracking
- A/B test configuration

### Events

- Email delivery, open, click, and bounce tracking
- Campaign and variant association
- Real-time webhook processing

### Recommendations

- Time-based engagement scoring
- User and category-specific optimization
- Historical performance analysis

## API Endpoints

### Convex Functions

#### Public Queries

- `api.campaigns.getCampaigns` - Get user's campaigns
- `api.campaigns.getCampaignAnalytics` - Get campaign performance data
- `api.events.getUserAnalytics` - Get overall user analytics
- `api.recommendations.getRecommendations` - Get optimal send time recommendations

#### Public Mutations

- `api.campaigns.createCampaign` - Create new campaign
- `api.campaigns.updateCampaign` - Update campaign details
- `api.campaigns.scheduleCampaign` - Schedule campaign for sending

#### Public Actions

- `api.campaigns.generateNewsletterContent` - Generate AI content
- `api.emails.sendTestEmail` - Send test email
- `api.emails.importRecipients` - Import recipient CSV

### HTTP Endpoints

- `POST /webhooks/resend` - Resend webhook handler

## Development

### Project Structure

```
resonex/
├── app/                    # Next.js app directory
│   ├── create-campaign/    # Campaign creation page
│   ├── page.tsx           # Dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── icons/            # Icon components
│   ├── CampaignCard.tsx  # Campaign display
│   ├── MetricDashboard.tsx # Analytics dashboard
│   └── ...
├── convex/               # Convex backend functions
│   ├── campaigns.ts      # Campaign management
│   ├── emails.ts         # Email sending
│   ├── events.ts         # Event tracking
│   ├── recommendations.ts # Send time optimization
│   ├── webhooks.ts       # Webhook handlers
│   ├── schema.ts         # Database schema
│   ├── crons.ts          # Scheduled jobs
│   └── http.ts           # HTTP router
└── public/               # Static assets
```

### Adding New Features

1. **Backend Functions**: Add new functions in the `convex/` directory
2. **Frontend Components**: Create components in the `components/` directory
3. **Database Schema**: Update schema in `convex/schema.ts`
4. **Scheduling**: Add cron jobs in `convex/crons.ts`

## Deployment

### Convex Deployment

Deploy your Convex backend:

```bash
npx convex deploy
```

### Frontend Deployment

Deploy to Vercel or your preferred platform:

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for the Convex + Resend Hackathon
- Powered by OpenAI for content generation
- Uses Convex for real-time backend functionality
- Email delivery by Resend

## Support

For support, email support@resonex.com or open an issue on GitHub.
