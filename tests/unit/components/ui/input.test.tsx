import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "@/components/ui/input";
import { createRef } from "react";

describe("Input", () => {
  it("renders with default styling", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("border");
    expect(input).toHaveClass("rounded-md");
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("handles value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    expect(handleChange).toHaveBeenCalled();
  });

  it("works as controlled input", async () => {
    const user = userEvent.setup();
    const ControlledInput = () => {
      const [value, setValue] = React.useState("");
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="controlled"
        />
      );
    };
    // Need to import React for controlled component test
    const React = await import("react");
    const { useState } = React;

    const TestComponent = () => {
      const [value, setValue] = useState("");
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="controlled"
        />
      );
    };

    render(<TestComponent />);
    const input = screen.getByTestId("controlled");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
  });

  it("handles uncontrolled input with defaultValue", () => {
    render(<Input defaultValue="initial" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");
  });

  it("applies type attribute for text", () => {
    render(<Input type="text" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "text");
  });

  it("applies type attribute for email", () => {
    render(<Input type="email" placeholder="email" />);
    const input = screen.getByPlaceholderText("email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("applies type attribute for password", () => {
    render(<Input type="password" placeholder="password" />);
    const input = screen.getByPlaceholderText("password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("applies type attribute for number", () => {
    render(<Input type="number" />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("type", "number");
  });

  it("applies placeholder", () => {
    render(<Input placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("applies disabled state", () => {
    render(<Input disabled placeholder="disabled" />);
    const input = screen.getByPlaceholderText("disabled");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
  });

  it("applies readOnly state", () => {
    render(<Input readOnly defaultValue="readonly" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });

  it("applies aria-invalid for errors", () => {
    render(<Input aria-invalid="true" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("spreads additional props", () => {
    render(<Input data-testid="custom-input" aria-label="Custom" />);
    const input = screen.getByTestId("custom-input");
    expect(input).toHaveAttribute("aria-label", "Custom");
  });

  it("handles focus events", async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("has accessible focus styles", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("focus-visible:ring-1");
    expect(input).toHaveClass("focus-visible:outline-none");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-class");
  });
});
