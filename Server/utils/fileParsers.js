import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

function normalizeExtractedText(text = "") {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export async function parseUploadedFile(file) {
  if (!file) {
    throw new Error("No file received");
  }

  const mimeType = file.mimetype;
  const filename = file.originalname;

  if (mimeType === "text/plain") {
    const content = normalizeExtractedText(file.buffer.toString("utf-8"));
    if (!content) {
      throw new Error("The TXT file did not contain readable text.");
    }

    return {
      title: filename.replace(/\.[^.]+$/, ""),
      content,
    };
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    const content = normalizeExtractedText(result.value);
    if (!content) {
      throw new Error("The DOCX file did not contain readable text.");
    }

    return {
      title: filename.replace(/\.[^.]+$/, ""),
      content,
    };
  }

  if (mimeType === "application/pdf" || filename.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: file.buffer });

    try {
      const result = await parser.getText();
      const content = normalizeExtractedText(result.text);
      if (!content) {
        throw new Error("The PDF did not contain extractable text. It may be scanned or image-only.");
      }

      return {
        title: filename.replace(/\.[^.]+$/, ""),
        content,
      };
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported file type. Upload TXT, DOCX, or PDF.");
}
