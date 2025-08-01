import { pretty, render } from "@react-email/render";
import { Doc } from "@/convex/_generated/dataModel";
import CampaignEmail from "../emails/CampaignEmail";
import ModernNewsletter from "../emails/ModernNewsletter";
import PromotionalNewsletter from "../emails/PromotionalNewsletter";
import { EmailTemplate } from "../types/email-template";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

export const getEmailTemplates = (
  campaign: Doc<"campaigns">,
): EmailTemplate[] => [
  {
    id: "announcement",
    name: "Product Announcement",
    subject: `🚀 ${campaign.campaignName} is Live!`,
    content: `We're excited to announce the launch of ${campaign.campaignName}! This ${campaign.category} campaign brings you exclusive opportunities and benefits. Join thousands of satisfied customers who are already experiencing the amazing results.`,
    ctaText: "Get Started Now",
    ctaLink: "https://example.com/campaign",
    type: "campaign",
  },
  {
    id: "exclusive",
    name: "Exclusive Offer",
    subject: `Exclusive: ${campaign.campaignName} Launch`,
    content: `Limited time offer! Get early access to ${campaign.campaignName} and be among the first to experience our latest ${campaign.category} innovations. This exclusive opportunity won't last long.`,
    ctaText: "Claim Your Spot",
    ctaLink: "https://example.com/campaign",
    type: "campaign",
  },
  {
    id: "urgency",
    name: "Urgency Template",
    subject: `Don't Miss Out: ${campaign.campaignName}`,
    content: `Time is running out! ${campaign.campaignName} is gaining momentum and spots are filling up fast. Don't let this ${campaign.category} opportunity pass you by. Act now to secure your place.`,
    ctaText: "Join Now",
    ctaLink: "https://example.com/campaign",
    type: "campaign",
  },
  {
    id: "welcome",
    name: "Welcome Series",
    subject: `Welcome to ${campaign.campaignName}`,
    content: `Thank you for your interest in ${campaign.campaignName}! We're thrilled to have you join our ${campaign.category} community. Here's everything you need to know to get started on your journey with us.`,
    ctaText: "Start Your Journey",
    ctaLink: "https://example.com/campaign",
    type: "campaign",
  },
  {
    id: "modern",
    name: "Modern Newsletter",
    subject: `Your Weekly Update from ${campaign.campaignName}`,
    content: `Stay informed with the latest updates and insights from our ${campaign.category} campaign. Discover what's new, what's coming, and exclusive member benefits.`,
    ctaText: "Read More",
    ctaLink: "https://example.com/campaign",
    type: "modern",
  },
  {
    id: "promotional",
    name: "Promotional Newsletter",
    subject: `Exclusive 50% OFF - ${campaign.campaignName}`,
    content: `Limited time promotional offer! Get exclusive access to our premium ${campaign.category} features at unbeatable prices. Don't miss this incredible opportunity.`,
    ctaText: "Claim Offer",
    ctaLink: "https://example.com/campaign",
    type: "promotional",
  },
];

export const generateEmailHTML = async (
  template: EmailTemplate,
  campaign: Doc<"campaigns">,
): Promise<string> => {
  try {
    let emailComponent;

    const commonProps = {
      campaignName: campaign.campaignName,
      category: campaign.category,
      subject: template.subject,
      content: template.content,
      ctaText: template.ctaText,
      ctaLink: template.ctaLink,
    };

    switch (template.type) {
      case "modern":
        emailComponent = <ModernNewsletter {...commonProps} />;
        break;
      case "promotional":
        emailComponent = <PromotionalNewsletter {...commonProps} />;
        break;
      case "campaign":
      default:
        emailComponent = <CampaignEmail {...commonProps} />;
        break;
    }

    const html = await render(emailComponent, {
      plainText: false,
    });

    return html;
  } catch (error) {
    console.error(`Failed to render email template ${template.id}:`, error);
    return `<div style="padding: 20px; text-align: center; color: #666;">
      <p>Failed to render email preview</p>
      <p style="font-size: 12px;">Template: ${template.name}</p>
    </div>`;
  }
};

export const generateAllEmailHTMLs = async (
  templates: EmailTemplate[],
  campaign: Doc<"campaigns">,
): Promise<string[]> => {
  try {
    const htmlPromises = templates.map(async (template) => {
      try {
        return await generateEmailHTML(template, campaign);
      } catch (error) {
        console.error(
          `Failed to generate HTML for template ${template.id}:`,
          error,
        );
        return `<div style="padding: 20px; text-align: center; color: #666;">
          <p>Preview unavailable for ${template.name}</p>
          <p style="font-size: 12px;">Please try again</p>
        </div>`;
      }
    });

    const htmls = await Promise.all(htmlPromises);
    return htmls;
  } catch (error) {
    console.error("Failed to generate email HTMLs:", error);
    return templates.map(
      () =>
        `<div style="padding: 20px; text-align: center; color: #999;">
        <p>Preview loading failed</p>
      </div>`,
    );
  }
};

export const generateEmailHTMLFromData = async (
  emailData: FunctionReturnType<typeof api.emails.getEmailFromNodeId>,
) => {
  if (!emailData) return "";

  const commonProps = {
    subject: emailData.subjectLine,
    content: emailData.body,
    ctaText: emailData.ctaText,
  };

  console.log("commonProps", emailData.templateId);

  switch (emailData.templateId) {
    case "modern":
      return await pretty(
        await render(<ModernNewsletter {...commonProps} />, {
          plainText: false,
        }),
      );
    case "promotional":
      return await pretty(
        await render(<PromotionalNewsletter {...commonProps} />, {
          plainText: false,
        }),
      );
    case "campaign":
      return await pretty(
        await render(<CampaignEmail {...commonProps} />, {
          plainText: false,
        }),
      );
    default:
      return await pretty(
        await render(<CampaignEmail {...commonProps} />, {
          plainText: false,
        }),
      );
  }
};
