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

interface ModernNewsletterProps {
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

export default function ModernNewsletter({
  campaignName,
  category,
  companyName = "Your Company",
  recipientName = "Valued Customer",
  subject = "Your Weekly Update",
  content = "Stay informed with the latest updates and insights from our team.",
  ctaText = "Read More",
  ctaLink = "https://example.com",
  logoUrl,
}: ModernNewsletterProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        {campaignName} Newsletter - {subject}
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
            <Text style={newsletterStyle}>Newsletter</Text>
          </Section>

          <Section style={mainContentStyle}>
            <Text style={greetingStyle}>Hello {recipientName}! 👋</Text>

            <Text style={subjectStyle}>{subject}</Text>

            <Text style={contentStyle}>{content}</Text>

            <Section style={featuredCampaignStyle}>
              <Text style={featuredTitleStyle}>
                Featured Campaign: {campaignName}
              </Text>
              <Text style={categoryStyle}>Category: {category}</Text>
              <Text style={featuredContentStyle}>
                Don&apos;t miss out on our latest {category} campaign featuring
                exclusive content and special offers just for you.
              </Text>
            </Section>

            <Section style={ctaSectionStyle}>
              <Button href={ctaLink} style={buttonStyle}>
                {ctaText}
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerSectionStyle}>
            <table
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              style={{ marginBottom: "24px" }}
            >
              <tr>
                <td width="48%" style={{ verticalAlign: "top" }}>
                  <Section style={statBoxStyle}>
                    <Text style={statNumberStyle}>5K+</Text>
                    <Text style={statLabelStyle}>Active Users</Text>
                  </Section>
                </td>
                <td width="4%"></td>
                <td width="48%" style={{ verticalAlign: "top" }}>
                  <Section style={statBoxGreenStyle}>
                    <Text style={statNumberGreenStyle}>98%</Text>
                    <Text style={statLabelStyle}>Satisfaction</Text>
                  </Section>
                </td>
              </tr>
            </table>

            <Text style={disclaimerStyle}>
              This newsletter was sent as part of the {campaignName} campaign.
            </Text>
            <Text style={copyrightStyle}>
              © 2024 {companyName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: "#f9fafb",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0",
};

const headerStyle = {
  backgroundColor: "#6366f1",
  padding: "48px 32px",
  textAlign: "center" as const,
};

const logoStyle = {
  margin: "0 auto 16px auto",
  display: "block",
};

const companyNameStyle = {
  fontSize: "30px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0",
  lineHeight: "36px",
};

const newsletterStyle = {
  fontSize: "18px",
  color: "#ddd6fe",
  margin: "8px 0 0 0",
  lineHeight: "24px",
};

const mainContentStyle = {
  padding: "32px",
};

const greetingStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0 0 16px 0",
  lineHeight: "32px",
};

const subjectStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#6366f1",
  margin: "0 0 16px 0",
  lineHeight: "28px",
};

const contentStyle = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
  margin: "0 0 24px 0",
};

const featuredCampaignStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
};

const featuredTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 8px 0",
  lineHeight: "24px",
};

const categoryStyle = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0 0 16px 0",
  lineHeight: "20px",
};

const featuredContentStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0",
  lineHeight: "24px",
};

const ctaSectionStyle = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  border: "none",
  cursor: "pointer",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footerSectionStyle = {
  padding: "0 32px 32px 32px",
};

const statBoxStyle = {
  backgroundColor: "#eff6ff",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
};

const statBoxGreenStyle = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
};

const statNumberStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#6366f1",
  margin: "0 0 4px 0",
  lineHeight: "32px",
};

const statNumberGreenStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#16a34a",
  margin: "0 0 4px 0",
  lineHeight: "32px",
};

const statLabelStyle = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0",
  lineHeight: "20px",
};

const disclaimerStyle = {
  fontSize: "14px",
  color: "#64748b",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  lineHeight: "20px",
};

const copyrightStyle = {
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
  margin: "0",
  lineHeight: "16px",
};
