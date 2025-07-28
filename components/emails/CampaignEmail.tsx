import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
  Preview,
} from "@react-email/components";

interface CampaignEmailProps {
  campaignName: string;
  category: string;
  companyName?: string;
  recipientName?: string;
  subject?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  logoUrl?: string;
}

export default function CampaignEmail({
  campaignName,
  category,
  companyName = "Your Company",
  recipientName = "Valued Customer",
  subject = "Important Update",
  content = "We have exciting news to share with you about our latest campaign.",
  ctaText = "Learn More",
  ctaLink = "https://example.com",
  logoUrl,
}: CampaignEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        {campaignName} - {subject}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            {logoUrl && (
              <Img
                src={logoUrl}
                alt={companyName}
                width="120"
                height="40"
                style={logoStyle}
              />
            )}
            <Text style={companyNameStyle}>{companyName}</Text>
          </Section>

          <Section style={mainStyle}>
            <Text style={greetingStyle}>Hello {recipientName},</Text>

            <Text style={subjectStyle}>{subject}</Text>

            <Text style={contentStyle}>{content}</Text>

            <Section style={ctaSection}>
              <Button href={ctaLink} style={buttonStyle}>
                {ctaText}
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={campaignInfoStyle}>
              <strong>Campaign:</strong> {campaignName}
            </Text>
            <Text style={campaignInfoStyle}>
              <strong>Category:</strong> {category}
            </Text>
            <Text style={footerTextStyle}>
              This email was sent as part of the {campaignName} campaign.
            </Text>
            <Text style={footerTextStyle}>
              © 2024 {companyName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const headerStyle = {
  padding: "32px",
  textAlign: "center" as const,
};

const logoStyle = {
  margin: "0 auto",
};

const companyNameStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "16px 0 0 0",
};

const mainStyle = {
  padding: "0 32px",
};

const greetingStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
  color: "#374151",
};

const subjectStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "32px",
  margin: "32px 0 24px 0",
  color: "#1f2937",
};

const contentStyle = {
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  color: "#374151",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  border: "none",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footerStyle = {
  padding: "0 32px",
};

const campaignInfoStyle = {
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
  color: "#6b7280",
};

const footerTextStyle = {
  fontSize: "12px",
  lineHeight: "16px",
  margin: "8px 0",
  color: "#9ca3af",
};
