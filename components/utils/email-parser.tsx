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

// Extended type definitions for React Email components + HTML elements
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
  | "Preview"
  | "br"
  | "strong"
  | "em"
  | "span"
  | "div"
  | "a";

interface ParsedElement {
  type: ReactEmailComponent;
  props: Record<string, any>;
  children: (ParsedElement | string)[];
}

export function parseJSXString(jsxString: string): React.ReactNode {
  try {
    // Clean up the string and handle common issues
    const cleanedString = jsxString
      .replace(/\\\'/g, "'") // Handle escaped quotes
      .replace(/\\\"/g, '"') // Handle escaped double quotes
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\n/g, " ") // Convert newlines to spaces
      .replace(/&quot;/g, '"') // Handle HTML entities
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    // Validate that we have proper JSX structure
    if (!isValidJSXStructure(cleanedString)) {
      throw new Error("Invalid JSX structure detected");
    }

    // Parse the JSX string into elements
    const parsed = parseElement(cleanedString);

    // Convert parsed elements to React components
    return renderParsedElement(parsed);
  } catch (error) {
    console.error("Error parsing JSX string:", error);
    console.error("Input string:", jsxString);
    return (
      <Text>
        Error parsing content:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </Text>
    );
  }
}

function isValidJSXStructure(jsxString: string): boolean {
  // Check for unclosed tags
  const tagStack: string[] = [];
  const tagRegex = /<\/?(\w+)[^>]*>/g;
  let match;

  while ((match = tagRegex.exec(jsxString)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1];

    if (fullMatch.endsWith("/>")) {
      // Self-closing tag, ignore
      continue;
    } else if (fullMatch.startsWith("</")) {
      // Closing tag
      if (tagStack.length === 0 || tagStack.pop() !== tagName) {
        return false; // Unmatched closing tag
      }
    } else {
      // Opening tag
      tagStack.push(tagName);
    }
  }

  return tagStack.length === 0; // All tags should be closed
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
      // Treat as text if we can't parse the tag
      const remainingText = content.slice(nextTagIndex).trim();
      if (remainingText) {
        children.push(remainingText);
      }
      break;
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
      // Treat as self-closing if no closing tag found
      console.warn(
        `No closing tag found for <${tagName}>, treating as self-closing`,
      );
      const props = parseAttributes(attributesString);
      children.push({
        type: tagName as ReactEmailComponent,
        props,
        children: [],
      });
      currentIndex = nextTagIndex + tagMatch[0].length;
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

  try {
    // Handle style prop specially - need to find the complete style object
    const styleRegex = /style=\{(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})\}/;
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

        props.style = JSON.parse(styleString);
      } catch (styleError) {
        console.warn("Error parsing style, trying manual parsing:", styleError);
        props.style = parseStyleManually(styleMatch[1]);
      }
    }

    // Handle other attributes (excluding style)
    const otherAttrsString = attributesString
      .replace(/style=\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/, "")
      .trim();

    // More robust attribute parsing
    const attrMatches = otherAttrsString.match(
      /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\})/g,
    );

    if (attrMatches) {
      attrMatches.forEach((attr) => {
        const match = attr.match(
          /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\})/,
        );
        if (match) {
          const [, name, doubleQuoted, singleQuoted, braced] = match;
          if (name && name !== "style") {
            const value = doubleQuoted || singleQuoted || braced;
            props[name] = parseAttributeValue(name, value, !!braced);
          }
        }
      });
    }
  } catch (error) {
    console.warn("Error parsing attributes:", error);
  }

  return props;
}

function parseStyleManually(styleString: string): Record<string, string> {
  const styleObj: Record<string, string> = {};
  try {
    const styleContent = styleString.replace(/[{}]/g, ""); // Remove braces

    // Split by comma, but handle nested objects
    const properties: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < styleContent.length; i++) {
      const char = styleContent[i];
      if (char === "{") depth++;
      else if (char === "}") depth--;
      else if (char === "," && depth === 0) {
        if (current.trim()) properties.push(current.trim());
        current = "";
        continue;
      }
      current += char;
    }
    if (current.trim()) properties.push(current.trim());

    properties.forEach((prop) => {
      const colonIndex = prop.indexOf(":");
      if (colonIndex > 0) {
        const key = prop.substring(0, colonIndex).trim().replace(/['"]/g, "");
        const value = prop
          .substring(colonIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, ""); // Remove surrounding quotes
        if (key && value) {
          styleObj[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn("Manual style parsing failed:", error);
  }

  return styleObj;
}

function parseAttributeValue(
  name: string,
  value: string,
  isBraced: boolean,
): any {
  if (!isBraced) {
    return value;
  }

  // Handle common React Email props
  if (name === "width" || name === "height") {
    const numValue = parseInt(value, 10);
    return isNaN(numValue) ? value : numValue;
  }

  // Try to parse as JSON for braced values
  try {
    return JSON.parse(value);
  } catch {
    // If JSON parsing fails, return as string
    return value;
  }
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

  // Handle each component type explicitly
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
      const previewContent = children
        .filter((child): child is string => typeof child === "string")
        .join(" ");
      return (
        <Preview {...props} key={key}>
          {previewContent}
        </Preview>
      );
    // Handle HTML elements that might be used in email content
    case "br":
      return <br key={key} />;
    case "strong":
      return (
        <strong {...props} key={key}>
          {renderedChildren}
        </strong>
      );
    case "em":
      return (
        <em {...props} key={key}>
          {renderedChildren}
        </em>
      );
    case "span":
      return (
        <span {...props} key={key}>
          {renderedChildren}
        </span>
      );
    case "div":
      return (
        <div {...props} key={key}>
          {renderedChildren}
        </div>
      );
    case "a":
      return (
        <a {...props} key={key}>
          {renderedChildren}
        </a>
      );
    default:
      console.warn(`Unknown component: ${type}`);
      return <Text key={key}>{renderedChildren}</Text>;
  }
}
