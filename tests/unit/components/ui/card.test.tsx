import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createRef } from "react";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies default styling", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("bg-card");
    expect(card).toHaveClass("shadow");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-class");
  });

  it("spreads additional props", () => {
    render(
      <Card data-testid="card" aria-label="Test card">
        Content
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("aria-label", "Test card");
  });
});

describe("CardHeader", () => {
  it("renders with proper spacing", () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>);
    const header = screen.getByTestId("header");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("flex-col");
    expect(header).toHaveClass("space-y-1.5");
    expect(header).toHaveClass("p-6");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Header
      </CardHeader>
    );
    const header = screen.getByTestId("header");
    expect(header).toHaveClass("custom-header");
  });
});

describe("CardTitle", () => {
  it("renders with proper styling", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId("title");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("leading-none");
    expect(title).toHaveClass("tracking-tight");
  });

  it("renders as h3 element by default", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId("title");
    expect(title.tagName).toBe("H3");
  });

  it("renders as h1 when specified", () => {
    render(
      <CardTitle as="h1" data-testid="title">
        Title
      </CardTitle>
    );
    const title = screen.getByTestId("title");
    expect(title.tagName).toBe("H1");
  });

  it("renders as h2 when specified", () => {
    render(
      <CardTitle as="h2" data-testid="title">
        Title
      </CardTitle>
    );
    const title = screen.getByTestId("title");
    expect(title.tagName).toBe("H2");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it("applies custom className", () => {
    render(
      <CardTitle className="custom-title" data-testid="title">
        Title
      </CardTitle>
    );
    const title = screen.getByTestId("title");
    expect(title).toHaveClass("custom-title");
  });
});

describe("CardDescription", () => {
  it("renders with muted styling", () => {
    render(
      <CardDescription data-testid="desc">Description</CardDescription>
    );
    const desc = screen.getByTestId("desc");
    expect(desc).toHaveClass("text-sm");
    expect(desc).toHaveClass("text-muted-foreground");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardDescription ref={ref}>Description</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <CardDescription className="custom-desc" data-testid="desc">
        Description
      </CardDescription>
    );
    const desc = screen.getByTestId("desc");
    expect(desc).toHaveClass("custom-desc");
  });
});

describe("CardContent", () => {
  it("renders with padding", () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId("content");
    expect(content).toHaveClass("p-6");
    expect(content).toHaveClass("pt-0");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Content
      </CardContent>
    );
    const content = screen.getByTestId("content");
    expect(content).toHaveClass("custom-content");
  });
});

describe("CardFooter", () => {
  it("renders with flex layout", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveClass("flex");
    expect(footer).toHaveClass("items-center");
    expect(footer).toHaveClass("p-6");
    expect(footer).toHaveClass("pt-0");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Footer
      </CardFooter>
    );
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveClass("custom-footer");
  });
});

describe("Card composition", () => {
  it("composes all parts together", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });
});
