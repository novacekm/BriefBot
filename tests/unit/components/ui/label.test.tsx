import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createRef } from "react";

describe("Label", () => {
  it("renders with default styling", () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-medium");
    expect(label).toHaveClass("leading-none");
  });

  it("associates with input via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </>
    );
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "email");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Label with ref</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("spreads additional props", () => {
    render(
      <Label data-testid="custom-label" aria-describedby="hint">
        Custom Label
      </Label>
    );
    const label = screen.getByTestId("custom-label");
    expect(label).toHaveAttribute("aria-describedby", "hint");
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Styled Label</Label>);
    const label = screen.getByText("Styled Label");
    expect(label).toHaveClass("custom-class");
  });

  it("has peer-disabled styling class", () => {
    render(<Label>Label</Label>);
    const label = screen.getByText("Label");
    expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });

  it("works with disabled input using peer classes", () => {
    render(
      <div className="flex flex-col gap-2">
        <Input id="disabled-input" disabled className="peer" />
        <Label htmlFor="disabled-input">Disabled Input Label</Label>
      </div>
    );
    const label = screen.getByText("Disabled Input Label");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });

  it("renders children correctly", () => {
    render(
      <Label>
        <span>Nested</span> Content
      </Label>
    );
    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText(/Content/)).toBeInTheDocument();
  });
});
