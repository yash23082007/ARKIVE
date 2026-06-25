const API_BASE = "http://localhost:8000";

export const api = {
  async getStatus() {
    const res = await fetch(`${API_BASE}/`);
    return res.json();
  },

  async ingestKnowledge(title, text, url, file) {
    const formData = new FormData();
    formData.append("title", title);
    if (text) formData.append("text", text);
    if (url) formData.append("url", url);
    if (file) formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/ingest`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to ingest content.");
    }
    return res.json();
  },

  async encodeArchive(title, text, hasRedundancy, isHardwareAgnostic) {
    const res = await fetch(`${API_BASE}/api/encode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        text,
        has_redundancy: hasRedundancy,
        is_hardware_agnostic: isHardwareAgnostic,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to encode archive.");
    }
    return res.json();
  },

  async listArchives() {
    const res = await fetch(`${API_BASE}/api/archives`);
    if (!res.ok) throw new Error("Failed to load archive list.");
    return res.json();
  },

  async getArchiveDetails(archiveId) {
    const res = await fetch(`${API_BASE}/api/archives/${archiveId}`);
    if (!res.ok) throw new Error("Failed to load archive details.");
    return res.json();
  },

  getDownloadUrl(archiveId) {
    return `${API_BASE}/api/archives/${archiveId}/download`;
  },

  async simulateReconstruction(archiveId) {
    const res = await fetch(`${API_BASE}/api/archives/${archiveId}/simulate`);
    if (!res.ok) throw new Error("Failed to generate simulation.");
    return res.json();
  },

  async getSurvivalReport(archiveId) {
    const res = await fetch(`${API_BASE}/api/archives/${archiveId}/survival`);
    if (!res.ok) throw new Error("Failed to generate survival report.");
    return res.json();
  },

  async decodeUploadedFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/decode-file`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to decode uploaded .arkive file.");
    }
    return res.json();
  },

  async deleteArchive(archiveId) {
    const res = await fetch(`${API_BASE}/api/archives/${archiveId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete archive.");
    return res.json();
  }
};
