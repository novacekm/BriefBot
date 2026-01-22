import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadZone } from "@/components/features/upload/upload-zone";

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;
});

function createFile(
  name: string,
  type: string,
  sizeInMB: number = 0.001
): File {
  const sizeInBytes = Math.ceil(sizeInMB * 1024 * 1024);
  const content = new Array(sizeInBytes).fill("a").join("");
  return new File([content], name, { type });
}

describe("UploadZone", () => {
  describe("Rendering", () => {
    it("should render default state with upload instructions", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      expect(
        screen.getByText(/drop file here or click to upload/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/jpeg, png, webp, or pdf/i)).toBeInTheDocument();
    });

    it("should render with custom max size", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} maxSizeMB={5} />);

      expect(screen.getByText(/5mb/i)).toBeInTheDocument();
    });

    it("should have accessible button role", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      expect(screen.getByRole("button", { name: /upload zone/i })).toBeInTheDocument();
    });
  });

  describe("File Validation", () => {
    it("should accept valid JPEG file", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.jpg", "image/jpeg");

      await user.upload(input, file);

      expect(onFileSelect).toHaveBeenCalledWith(file);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should accept valid PNG file", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.png", "image/png");

      await user.upload(input, file);

      expect(onFileSelect).toHaveBeenCalledWith(file);
    });

    it("should accept valid WebP file", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.webp", "image/webp");

      await user.upload(input, file);

      expect(onFileSelect).toHaveBeenCalledWith(file);
    });

    it("should accept valid PDF file", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.pdf", "application/pdf");

      await user.upload(input, file);

      expect(onFileSelect).toHaveBeenCalledWith(file);
    });

    it("should reject invalid file type", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.exe", "application/octet-stream");

      // Use fireEvent to bypass browser's accept attribute filtering
      Object.defineProperty(input, "files", {
        value: [file],
        writable: false,
      });
      fireEvent.change(input);

      expect(onFileSelect).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(/invalid file type/i);
    });

    it("should reject oversized files", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} maxSizeMB={1} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("large.jpg", "image/jpeg", 2);

      await user.upload(input, file);

      expect(onFileSelect).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(/file too large/i);
    });

    it("should use custom accepted types", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <UploadZone
          onFileSelect={onFileSelect}
          acceptedTypes={["image/jpeg"]}
        />
      );

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const pngFile = createFile("test.png", "image/png");

      await user.upload(input, pngFile);

      expect(onFileSelect).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("File Preview", () => {
    it("should show image preview for image files", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.jpg", "image/jpeg");

      await user.upload(input, file);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(screen.getByRole("img", { name: /preview/i })).toBeInTheDocument();
    });

    it("should show file icon for PDF files", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.pdf", "application/pdf");

      await user.upload(input, file);

      expect(screen.getByText("test.pdf")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should show filename and size", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test-document.jpg", "image/jpeg", 1);

      await user.upload(input, file);

      expect(screen.getByText("test-document.jpg")).toBeInTheDocument();
      expect(screen.getByText(/mb/i)).toBeInTheDocument();
    });
  });

  describe("Remove File", () => {
    it("should clear file when remove button is clicked", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.jpg", "image/jpeg");

      await user.upload(input, file);
      expect(screen.getByText("test.jpg")).toBeInTheDocument();

      const removeButton = screen.getByRole("button", { name: /remove/i });
      await user.click(removeButton);

      expect(screen.queryByText("test.jpg")).not.toBeInTheDocument();
      expect(
        screen.getByText(/drop file here or click to upload/i)
      ).toBeInTheDocument();
    });

    it("should revoke object URL when removing image", async () => {
      const onFileSelect = vi.fn();
      const user = userEvent.setup();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile("test.jpg", "image/jpeg");

      await user.upload(input, file);

      const removeButton = screen.getByRole("button", { name: /remove/i });
      await user.click(removeButton);

      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  describe("Disabled State", () => {
    it("should not allow file selection when disabled", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} disabled />);

      const zone = screen.getByRole("button", { name: /upload zone/i });
      expect(zone).toHaveAttribute("aria-disabled", "true");
    });

    it("should not allow file selection when uploading", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} isUploading />);

      const zone = screen.getByRole("button", { name: /upload zone/i });
      expect(zone).toHaveAttribute("aria-disabled", "true");
    });

    it("should show uploading state", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} isUploading />);

      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });

  describe("Keyboard Accessibility", () => {
    it("should open file dialog on Enter key", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");

      const zone = screen.getByRole("button", { name: /upload zone/i });
      fireEvent.keyDown(zone, { key: "Enter" });

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should open file dialog on Space key", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");

      const zone = screen.getByRole("button", { name: /upload zone/i });
      fireEvent.keyDown(zone, { key: " " });

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should not open dialog when disabled", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} disabled />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");

      const zone = screen.getByRole("button", { name: /upload zone/i });
      fireEvent.keyDown(zone, { key: "Enter" });

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe("Drag and Drop", () => {
    it("should show drag over state", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const zone = screen.getByRole("button", { name: /upload zone/i });
      fireEvent.dragOver(zone);

      expect(screen.getByText(/drop file here$/i)).toBeInTheDocument();
    });

    it("should handle drop event", async () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} />);

      const zone = screen.getByRole("button", { name: /upload zone/i });
      const file = createFile("test.jpg", "image/jpeg");

      fireEvent.drop(zone, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(onFileSelect).toHaveBeenCalledWith(file);
    });

    it("should not accept drop when disabled", () => {
      const onFileSelect = vi.fn();
      render(<UploadZone onFileSelect={onFileSelect} disabled />);

      const zone = screen.getByRole("button", { name: /upload zone/i });
      const file = createFile("test.jpg", "image/jpeg");

      fireEvent.drop(zone, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(onFileSelect).not.toHaveBeenCalled();
    });
  });
});
