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

interface PromotionalNewsletterProps {
  companyName?: string;
  recipientName?: string;
  subject?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  logoUrl?: string;
}

export default function PromotionalNewsletter({
  companyName = "Resonex",
  recipientName = "Valued Customer",
  subject = "Exclusive Offer Inside!",
  content = "Limited time offer - Get exclusive access to our premium features at unbeatable prices.",
  ctaText = "Claim Offer",
  ctaLink = "https://www.resonex.cc",
  logoUrl,
}: PromotionalNewsletterProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{companyName} - Exclusive Promotional Offer</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Section style={limitedTimeBadgeStyle}>
              <Text style={badgeTextStyle}>LIMITED TIME</Text>
            </Section>

            {logoUrl && (
              <Img
                src={"/resonex-logo.webp"}
                alt={companyName}
                width="100"
                height="32"
                style={logoStyle}
              />
            )}
            <Text style={companyNameStyle}>{companyName}</Text>
          </Section>

          <Section style={flashSaleStyle}>
            <Text style={flashSaleTextStyle}>🔥 FLASH SALE - 50% OFF 🔥</Text>
          </Section>

          <Section style={mainContentStyle}>
            <Text style={greetingStyle}>Hello {recipientName}!</Text>

            <Text style={subjectStyle}>{subject}</Text>

            <Text style={contentStyle}>{content}</Text>

            <Section style={campaignSpotlightStyle}>
              <Text style={spotlightTitleStyle}>⚡ Campaign Spotlight</Text>
              <Text style={spotlightContentStyle}>
                Join thousands of satisfied customers who have already taken
                advantage of this exclusive offer.
              </Text>
            </Section>

            <Section style={whatYouGetStyle}>
              <Text style={whatYouGetTitleStyle}>🎯 What You Get:</Text>
              <Section>
                <Text style={featureItemStyle}>
                  ✅ Premium access to all features
                </Text>
                <Text style={featureItemStyle}>
                  ✅ Priority customer support
                </Text>
                <Text style={featureItemStyle}>
                  ✅ Exclusive member benefits
                </Text>
                <Text style={featureItemLastStyle}>
                  ✅ 30-day money-back guarantee
                </Text>
              </Section>
            </Section>

            <Section style={ctaSectionStyle}>
              <Section style={savingsBoxStyle}>
                <Text style={savingsAmountStyle}>Save $299</Text>
                <Text style={originalPriceStyle}>Original Price: $599</Text>
              </Section>

              <Button href={ctaLink} style={buttonStyle}>
                {ctaText} - Only $300!
              </Button>

              <Text style={urgencyStyle}>⏰ Offer expires in 48 hours!</Text>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerMessageStyle}>
              Don&apos;t miss out on this incredible opportunity!
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
  backgroundColor: "#fef2f2",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
};

const headerStyle = {
  backgroundColor: "#dc2626",
  padding: "24px 32px",
  textAlign: "center" as const,
  position: "relative" as const,
  overflow: "hidden",
};

const limitedTimeBadgeStyle = {
  position: "absolute" as const,
  top: "0",
  right: "0",
  backgroundColor: "#f59e0b",
  transform: "rotate(12deg) translate(16px, -8px)",
  padding: "4px 12px",
};

const badgeTextStyle = {
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "16px",
};

const logoStyle = {
  margin: "0 auto 12px auto",
  display: "block",
};

const companyNameStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0",
  lineHeight: "32px",
};

const flashSaleStyle = {
  backgroundColor: "#f59e0b",
  padding: "16px 32px",
  textAlign: "center" as const,
};

const flashSaleTextStyle = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "24px",
};

const mainContentStyle = {
  padding: "24px 32px",
};

const greetingStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
  lineHeight: "32px",
};

const subjectStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#dc2626",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  lineHeight: "28px",
};

const contentStyle = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#374151",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const campaignSpotlightStyle = {
  backgroundColor: "#fecaca",
  borderLeft: "4px solid #dc2626",
  padding: "24px",
  margin: "0 0 24px 0",
};

const spotlightTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#dc2626",
  margin: "0 0 8px 0",
  lineHeight: "24px",
};

const spotlightContentStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0",
  lineHeight: "24px",
};

const whatYouGetStyle = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
};

const whatYouGetTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1f2937",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
  lineHeight: "24px",
};

const featureItemStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0 0 8px 0",
  lineHeight: "24px",
};

const featureItemLastStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0",
  lineHeight: "24px",
};

const ctaSectionStyle = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const savingsBoxStyle = {
  backgroundColor: "#16a34a",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "0 auto 16px auto",
  display: "inline-block",
};

const savingsAmountStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "32px",
};

const originalPriceStyle = {
  fontSize: "14px",
  margin: "0",
  lineHeight: "20px",
};

const buttonStyle = {
  backgroundColor: "#dc2626",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 48px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  margin: "0 0 8px 0",
};

const urgencyStyle = {
  fontSize: "14px",
  color: "#dc2626",
  fontWeight: "600",
  margin: "8px 0 0 0",
  lineHeight: "20px",
};

const hrStyle = {
  borderColor: "#d1d5db",
  margin: "0",
};

const footerStyle = {
  backgroundColor: "#f9fafb",
  padding: "24px 32px",
};

const footerMessageStyle = {
  fontSize: "14px",
  color: "#6b7280",
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
