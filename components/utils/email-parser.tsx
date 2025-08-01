/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Section,
  Text,
  Heading,
  Button,
  Html,
  Head,
  Body,
  Container,
  Hr,
  Img,
  Preview,
} from "@react-email/components";

// Type definitions for React Email components
type ReactEmailComponent =
  | "Section"
  | "Text"
  | "Heading"
  | "Button"
  | "Html"
  | "Head"
  | "Body"
  | "Container"
  | "Hr"
  | "Img"
  | "Preview";

interface ParsedElement {
  type: ReactEmailComponent;
  props: Record<string, any>;
  children: (ParsedElement | string)[];
}

export function parseJSXString(jsxString: string): React.ReactNode {
  try {
    // Clean up the string
    const cleanedString = jsxString
      .replace(/\\\'/g, "'") // Handle escaped quotes
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Parse the JSX string into elements
    const parsed = parseElement(cleanedString);

    // Convert parsed elements to React components
    return renderParsedElement(parsed);
  } catch (error) {
    console.error("Error parsing JSX string:", error);
    return <Text>Error parsing content</Text>;
  }
}

function parseElement(jsxString: string): ParsedElement | string {
  // If it's just text content, return it as is
  if (!jsxString.includes("<")) {
    return jsxString.trim();
  }

  // Find the first opening tag
  const openTagMatch = jsxString.match(/<(\w+)([^>]*)>/);
  if (!openTagMatch) {
    return jsxString.trim();
  }

  const tagName = openTagMatch[1] as ReactEmailComponent;
  const attributesString = openTagMatch[2];
  const openTagEnd = openTagMatch.index! + openTagMatch[0].length;

  // Self-closing tag
  if (attributesString.endsWith("/")) {
    const props = parseAttributes(attributesString.slice(0, -1));
    return {
      type: tagName,
      props,
      children: [],
    };
  }

  // Find the matching closing tag
  const closingTag = `</${tagName}>`;
  let depth = 1;
  let searchIndex = openTagEnd;
  let closingTagIndex = -1;

  while (depth > 0 && searchIndex < jsxString.length) {
    const nextOpenTag = jsxString.indexOf(`<${tagName}`, searchIndex);
    const nextCloseTag = jsxString.indexOf(closingTag, searchIndex);

    if (nextCloseTag === -1) break;

    if (nextOpenTag !== -1 && nextOpenTag < nextCloseTag) {
      // Check if it's actually an opening tag, not just text containing the tag name
      const afterTag = jsxString.charAt(nextOpenTag + tagName.length + 1);
      if (afterTag === " " || afterTag === ">" || afterTag === "/") {
        depth++;
        searchIndex = nextOpenTag + tagName.length + 1;
      } else {
        searchIndex = nextOpenTag + 1;
      }
    } else {
      depth--;
      if (depth === 0) {
        closingTagIndex = nextCloseTag;
      }
      searchIndex = nextCloseTag + closingTag.length;
    }
  }

  if (closingTagIndex === -1) {
    throw new Error(`No matching closing tag found for <${tagName}>`);
  }

  // Extract content between tags
  const content = jsxString.slice(openTagEnd, closingTagIndex);
  const props = parseAttributes(attributesString);
  const children = parseChildren(content);

  return {
    type: tagName,
    props,
    children,
  };
}

function parseChildren(content: string): (ParsedElement | string)[] {
  if (!content.trim()) return [];

  const children: (ParsedElement | string)[] = [];
  let currentIndex = 0;

  while (currentIndex < content.length) {
    const nextTagIndex = content.indexOf("<", currentIndex);

    if (nextTagIndex === -1) {
      // No more tags, add remaining text
      const remainingText = content.slice(currentIndex).trim();
      if (remainingText) {
        children.push(remainingText);
      }
      break;
    }

    // Add text before the tag
    if (nextTagIndex > currentIndex) {
      const textContent = content.slice(currentIndex, nextTagIndex).trim();
      if (textContent) {
        children.push(textContent);
      }
    }

    // Find the end of this element
    const tagMatch = content.slice(nextTagIndex).match(/<(\w+)([^>]*)>/);
    if (!tagMatch) {
      currentIndex = nextTagIndex + 1;
      continue;
    }

    const tagName = tagMatch[1];
    const attributesString = tagMatch[2];

    // Self-closing tag
    if (attributesString.endsWith("/")) {
      const props = parseAttributes(attributesString.slice(0, -1));
      children.push({
        type: tagName as ReactEmailComponent,
        props,
        children: [],
      });
      currentIndex = nextTagIndex + tagMatch[0].length;
      continue;
    }

    // Find matching closing tag
    const closingTag = `</${tagName}>`;
    let depth = 1;
    let searchIndex = nextTagIndex + tagMatch[0].length;
    let closingTagIndex = -1;

    while (depth > 0 && searchIndex < content.length) {
      const nextOpenTag = content.indexOf(`<${tagName}`, searchIndex);
      const nextCloseTag = content.indexOf(closingTag, searchIndex);

      if (nextCloseTag === -1) break;

      if (nextOpenTag !== -1 && nextOpenTag < nextCloseTag) {
        const afterTag = content.charAt(nextOpenTag + tagName.length + 1);
        if (afterTag === " " || afterTag === ">" || afterTag === "/") {
          depth++;
          searchIndex = nextOpenTag + tagName.length + 1;
        } else {
          searchIndex = nextOpenTag + 1;
        }
      } else {
        depth--;
        if (depth === 0) {
          closingTagIndex = nextCloseTag;
        }
        searchIndex = nextCloseTag + closingTag.length;
      }
    }

    if (closingTagIndex === -1) {
      currentIndex = nextTagIndex + 1;
      continue;
    }

    // Parse this element
    const elementContent = content.slice(
      nextTagIndex + tagMatch[0].length,
      closingTagIndex,
    );
    const props = parseAttributes(attributesString);
    const elementChildren = parseChildren(elementContent);

    children.push({
      type: tagName as ReactEmailComponent,
      props,
      children: elementChildren,
    });

    currentIndex = closingTagIndex + closingTag.length;
  }

  return children;
}

function parseAttributes(attributesString: string): Record<string, any> {
  const props: Record<string, any> = {};
  if (!attributesString.trim()) return props;

  // Handle style prop specially - need to find the complete style object
  const styleRegex = /style=\{(\{[^}]*\})\}/;
  const styleMatch = attributesString.match(styleRegex);

  if (styleMatch) {
    try {
      let styleString = styleMatch[1];

      // Convert JavaScript object notation to JSON
      styleString = styleString
        .replace(/(\w+):/g, '"$1":') // Add quotes around property names
        .replace(/'/g, '"') // Convert single quotes to double quotes
        .replace(/\\\"/g, '"') // Handle escaped quotes
        .replace(/,\s*}/, "}") // Remove trailing commas
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      console.log("Parsing style string:", styleString);
      props.style = JSON.parse(styleString);
    } catch (error) {
      console.warn("Error parsing style, trying manual parsing:", error);

      // Manual parsing fallback for common patterns
      const styleObj: Record<string, string> = {};
      const styleContent = styleMatch[1].replace(/[{}]/g, ""); // Remove braces

      // Split by comma and parse each property
      const properties = styleContent.split(",");
      properties.forEach((prop) => {
        const colonIndex = prop.indexOf(":");
        if (colonIndex > 0) {
          const key = prop.substring(0, colonIndex).trim().replace(/"/g, "");
          const value = prop
            .substring(colonIndex + 1)
            .trim()
            .replace(/['"]/g, "");
          if (key && value) {
            styleObj[key] = value;
          }
        }
      });

      if (Object.keys(styleObj).length > 0) {
        props.style = styleObj;
      } else {
        // Last resort - extract common properties
        const fontSizeMatch = attributesString.match(/fontSize:\s*"([^"]+)"/);
        const lineHeightMatch = attributesString.match(
          /lineHeight:\s*"([^"]+)"/,
        );

        if (fontSizeMatch || lineHeightMatch) {
          props.style = {};
          if (fontSizeMatch) props.style.fontSize = fontSizeMatch[1];
          if (lineHeightMatch) props.style.lineHeight = lineHeightMatch[1];
        }
      }
    }
  }

  // Handle other attributes (excluding style)
  const otherAttrsString = attributesString
    .replace(/style=\{[^}]*\}/, "")
    .trim();
  const attrMatches = otherAttrsString.match(
    /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g,
  );

  if (attrMatches) {
    attrMatches.forEach((attr) => {
      const match = attr.match(/(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
      if (match) {
        const [, name, doubleQuoted, singleQuoted, braced] = match;
        if (name && name !== "style") {
          const value = doubleQuoted || singleQuoted || braced;

          // Handle common React Email props
          if (
            name === "as" ||
            name === "href" ||
            name === "src" ||
            name === "alt" ||
            name === "width" ||
            name === "height"
          ) {
            props[name] = value;
          } else if (braced) {
            // Try to parse braced values
            try {
              props[name] = JSON.parse(value);
            } catch {
              props[name] = value;
            }
          } else {
            props[name] = value;
          }
        }
      }
    });
  }

  return props;
}

function renderParsedElement(
  element: ParsedElement | string,
  key?: number,
): React.ReactNode {
  if (typeof element === "string") {
    return element;
  }

  const { type, props, children } = element;

  const renderedChildren = children.map((child, index) =>
    renderParsedElement(child, index),
  );

  // Handle each component type explicitly to avoid TypeScript issues
  switch (type) {
    case "Section":
      return (
        <Section {...props} key={key}>
          {renderedChildren}
        </Section>
      );
    case "Text":
      return (
        <Text {...props} key={key}>
          {renderedChildren}
        </Text>
      );
    case "Heading":
      return (
        <Heading {...props} key={key}>
          {renderedChildren}
        </Heading>
      );
    case "Button":
      return (
        <Button {...props} key={key}>
          {renderedChildren}
        </Button>
      );
    case "Html":
      return (
        <Html {...props} key={key}>
          {renderedChildren}
        </Html>
      );
    case "Head":
      return (
        <Head {...props} key={key}>
          {renderedChildren}
        </Head>
      );
    case "Body":
      return (
        <Body {...props} key={key}>
          {renderedChildren}
        </Body>
      );
    case "Container":
      return (
        <Container {...props} key={key}>
          {renderedChildren}
        </Container>
      );
    case "Hr":
      return <Hr {...props} key={key} />;
    case "Img":
      return <Img {...props} key={key} />;
    case "Preview":
      // Preview component expects string | string[] as children
      const previewContent = children
        .filter((child): child is string => typeof child === "string")
        .join(" ");
      return (
        <Preview {...props} key={key}>
          {previewContent}
        </Preview>
      );
    default:
      console.warn(`Unknown component: ${type}`);
      return <Text key={key}>{renderedChildren}</Text>;
  }
}

// Usage example
export function ExampleUsage() {
  const jsxString = `<Section><Text style={{ fontSize: "16px", lineHeight: "1.5" }}>Hi {name},</Text><Text style={{ fontSize: "16px", lineHeight: "1.5" }}>We're excited to announce the upcoming launch of our new product! We've been working hard to bring you the best possible experience, and we can't wait for you to see what we've created.</Text><Text style={{ fontSize: "16px", lineHeight: "1.5" }}>Stay tuned for more updates soon!</Text></Section>`;

  return (
    <div>
      <h3>Original JSX String:</h3>
      <pre>{jsxString}</pre>

      <h3>Parsed Result:</h3>
      <div
        style={{ border: "1px solid #ccc", padding: "16px", marginTop: "16px" }}
      >
        {parseJSXString(jsxString)}
      </div>
    </div>
  );
}
