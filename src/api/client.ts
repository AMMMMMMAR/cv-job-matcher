import axios, { AxiosError } from "axios";
import type { UploadResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 90000,   // 90 seconds — backend upload is slow
});

export async function uploadCV(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await client.post<UploadResponse>(
      "/api/cv/upload",
      formData
      // DO NOT set Content-Type manually — axios sets the multipart boundary
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    // Re-throw with a user-friendly message
    if (error.code === "ECONNABORTED") {
      throw new Error("The upload took too long. Please try again.");
    }
    if (error.response?.status === 400) {
      throw new Error("Invalid PDF. Please upload a valid CV.");
    }
    if (error.response?.status && error.response.status >= 500) {
      throw new Error("Server error. Please try again in a moment.");
    }
    if (!error.response) {
      throw new Error("Cannot reach the server. Is the backend running?");
    }
    throw new Error("Something went wrong. Please try again.");
  }
}
