import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle,
  LoaderCircle,
  X,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 50;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");

function getAuthHeaders() {
  const token = localStorage.getItem("cvision_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function CVUpload() {
  const fileInputRef = useRef(null);

  // -----------------------------
  // Jobs
  // -----------------------------

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  // -----------------------------
  // CV files
  // -----------------------------

  const [files, setFiles] = useState([]);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // -----------------------------
  // Fetch jobs
  // -----------------------------

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError("");

        const response = await fetch(`${API_BASE_URL}/jobs`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Your session has expired. Please sign in again.");
          }
          throw new Error("Failed to fetch job postings");
        }

        const data = await response.json();

        setJobs(data);

        if (data.length > 0) {
          setSelectedJob(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobsError(error.message);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // -----------------------------
  // File validation
  // -----------------------------

  const validateFile = (file) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF files are allowed";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File exceeds the 5MB limit";
    }

    return null;
  };

  // -----------------------------
  // Add files
  // -----------------------------

  const addFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles);

    if (incomingFiles.length === 0) {
      return;
    }

    if (files.length >= MAX_FILES) {
      return;
    }

    const availableSlots = MAX_FILES - files.length;

    const filesToAdd = incomingFiles.slice(0, availableSlots);

    const newFiles = filesToAdd.map((file) => {
      const error = validateFile(file);

      return {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,

        // 0 until real upload starts
        progress: 0,

        // ready = valid but not uploaded
        // failed = validation failed
        // uploading = upload request in progress
        // uploaded = successfully stored in backend
        status: error ? "failed" : "ready",

        error: error || null,

        // MongoDB CV ID will be stored here
        cvId: null,
      };
    });

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // -----------------------------
  // Browse files
  // -----------------------------

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    addFiles(event.target.files);

    // Allow selecting the same file again later
    event.target.value = "";
  };

  // -----------------------------
  // Drag and Drop
  // -----------------------------

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    addFiles(event.dataTransfer.files);
  };

  // -----------------------------
  // Remove file
  // -----------------------------

  const removeFile = (fileId) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  // -----------------------------
  // Clear all files
  // -----------------------------

  const clearAllFiles = () => {
    if (isUploading) {
      return;
    }

    setFiles([]);
  };

  // -----------------------------
  // Upload CVs to backend
  // -----------------------------

  const uploadCVs = async () => {
    if (!selectedJob) {
      alert("Please select a job posting.");
      return;
    }

    const validFiles = files.filter(
      (file) => file.status === "ready"
    );

    if (validFiles.length === 0) {
      alert("Please add at least one valid CV.");
      return;
    }

    try {
      setIsUploading(true);

      // -----------------------------------
      // Mark files as uploading
      // -----------------------------------

      setFiles((prevFiles) =>
        prevFiles.map((item) =>
          item.status === "ready"
            ? {
                ...item,
                status: "uploading",
                progress: 20,
              }
            : item
        )
      );

      // -----------------------------------
      // Create FormData
      // -----------------------------------

      const formData = new FormData();

      validFiles.forEach((item) => {
        formData.append("cvs", item.file);
      });

      // -----------------------------------
      // Send to backend
      // -----------------------------------

      const response = await fetch(
        `${API_BASE_URL}/cvs/upload-multiple/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to upload CVs"
        );
      }

      if (!data.cvs || !Array.isArray(data.cvs)) {
        throw new Error(
          "Invalid response received from CV upload API"
        );
      }

      // -----------------------------------
      // Match backend CV records
      // with frontend files
      // -----------------------------------

      setFiles((prevFiles) =>
        prevFiles.map((item) => {
          if (item.status !== "uploading") {
            return item;
          }

          const uploadedCV = data.cvs.find(
            (cv) => cv.originalName === item.name
          );

          if (!uploadedCV) {
            return {
              ...item,
              status: "failed",
              progress: 0,
              error:
                "CV was uploaded but its backend record could not be matched.",
            };
          }

          return {
            ...item,
            status: "uploaded",
            progress: 100,
            cvId: uploadedCV._id,
            error: null,
          };
        })
      );

      console.log("CV upload successful:");
      console.log(data);

    } catch (error) {
      console.error("CV upload error:", error);

      setFiles((prevFiles) =>
        prevFiles.map((item) =>
          item.status === "uploading"
            ? {
                ...item,
                status: "failed",
                progress: 0,
                error: error.message,
              }
            : item
        )
      );

      alert(error.message);

    } finally {
      setIsUploading(false);
    }
  };

  // -----------------------------
  // Counts
  // -----------------------------

  const uploadedCount = files.filter(
    (file) => file.status === "uploaded"
  ).length;

  const failedCount = files.filter(
    (file) => file.status === "failed"
  ).length;

  const readyCount = files.filter(
    (file) =>
      file.status === "ready" ||
      file.status === "uploaded"
  ).length;

  const canUpload =
    files.length > 0 &&
    files.some((file) => file.status === "ready") &&
    !isUploading;

  // -----------------------------
  // Format file size
  // -----------------------------

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // -----------------------------
  // Selected job title
  // -----------------------------

  const selectedJobData = jobs.find(
    (job) => job._id === selectedJob
  );

  return (
    <div className="w-full pb-10">

      {/* -------------------------------- */}
      {/* Page Header */}
      {/* -------------------------------- */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          CV Upload
        </h1>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Select a job posting, then upload candidate CVs for AI
          screening.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Job Posting Select */}
      {/* -------------------------------- */}

      <div className="mx-auto mb-6 w-[calc(100%-140px)] rounded-[14px] border border-slate-200 bg-white px-11 py-7 shadow-sm">

        <label
          htmlFor="job-posting"
          className="mb-3 block text-sm font-medium text-slate-900"
        >
          Job posting
        </label>

        <div className="relative">

          <select
            id="job-posting"
            value={selectedJob}
            onChange={(event) =>
              setSelectedJob(event.target.value)
            }
            disabled={jobsLoading || isUploading}
            className="h-10 w-full appearance-none rounded-lg border border-slate-900 bg-white px-4 pr-10 text-[13px] text-slate-900 outline-none focus:border-blue-600 disabled:bg-slate-100"
          >

            {jobsLoading && (
              <option value="">
                Loading job postings...
              </option>
            )}

            {!jobsLoading && jobs.length === 0 && (
              <option value="">
                No job postings available
              </option>
            )}

            {!jobsLoading &&
              jobs.map((job) => (
                <option
                  key={job._id}
                  value={job._id}
                >
                  {job.title}
                </option>
              ))}
          </select>

          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-900"
          />

        </div>

        {/* Job loading error */}

        {jobsError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle size={15} />
            {jobsError}
          </div>
        )}

        {/* Selected job information */}

        {selectedJobData && (
          <div className="mt-3 text-xs text-slate-500">
            Selected:{" "}
            <span className="font-medium text-slate-700">
              {selectedJobData.title}
            </span>
          </div>
        )}

      </div>

      {/* -------------------------------- */}
      {/* Upload Area */}
      {/* -------------------------------- */}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mx-auto mb-6 flex min-h-[315px] w-[calc(100%-140px)] flex-col items-center justify-center rounded-[14px] border-[1.5px] border-dashed transition ${
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-slate-500 bg-white"
        }`}
      >

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <UploadCloud size={36} />
        </div>

        <h2 className="text-base font-medium leading-6 text-slate-900">
          Drag & Drop or Browse Files to Upload
        </h2>

        <p className="mt-1.5 mb-4 text-[13px] leading-5 text-slate-500">
          PDF only, up to 5MB each, maximum 50 files
        </p>

        <button
          type="button"
          onClick={handleBrowse}
          disabled={isUploading}
          className="h-[38px] rounded-lg cursor-pointer bg-[#19295F] px-6 text-[13px] font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Browse Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          hidden
          onChange={handleFileSelect}
        />

      </div>

      {/* -------------------------------- */}
      {/* File List */}
      {/* -------------------------------- */}

      {files.length > 0 && (
        <div className="mx-auto w-[calc(100%-140px)] overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm">

          {/* File list header */}

          <div className="flex h-[53px] items-center justify-between border-b border-slate-200 px-7 text-[13px] font-medium text-slate-900">

            <span>
              {files.length}{" "}
              {files.length === 1
                ? "file"
                : "files"}{" "}
              selected
            </span>

            <span>
              {uploadedCount} of {files.length} uploaded
            </span>

          </div>

          {/* Files */}

          <div className="px-[15px]">

            {files.map((item) => (
              <div
                key={item.id}
                className="flex min-h-[86px] items-center gap-4 border-b border-slate-200 px-3 py-3"
              >

                {/* File icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-slate-900">
                  <FileText size={24} />
                </div>

                {/* File information */}

                <div className="min-w-0 flex-1">

                  <div className="mb-1.5 truncate text-[13px] font-medium text-slate-900">
                    {item.name}
                  </div>

                  <div className="flex items-center gap-2.5">

                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.status === "failed"
                            ? "bg-red-600"
                            : item.status === "uploaded"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        }`}
                        style={{
                          width: `${item.progress}%`,
                        }}
                      />

                    </div>

                    <span className="w-9 text-right text-xs text-slate-500">
                      {item.progress}%
                    </span>

                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {formatFileSize(item.size)}
                  </div>

                  {/* Error */}

                  {item.status === "failed" && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600">
                      <AlertCircle size={14} />
                      {item.error}
                    </div>
                  )}

                </div>

                {/* Status */}

                <div
                  className={`flex w-[110px] shrink-0 items-center gap-1 text-xs font-medium ${
                    item.status === "uploaded"
                      ? "text-green-600"
                      : item.status === "failed"
                        ? "text-red-600"
                        : item.status === "uploading"
                          ? "text-blue-600"
                          : "text-slate-500"
                  }`}
                >

                  {item.status === "uploaded" && (
                    <>
                      <CheckCircle size={16} />
                      Uploaded
                    </>
                  )}

                  {item.status === "uploading" && (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Uploading...
                    </>
                  )}

                  {item.status === "ready" && (
                    <>
                      <FileText size={16} />
                      Ready
                    </>
                  )}

                  {item.status === "failed" && (
                    <>
                      <AlertCircle size={16} />
                      Failed
                    </>
                  )}

                </div>

                {/* Remove file */}

                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  disabled={isUploading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={22} />
                </button>

              </div>
            ))}

          </div>

          {/* -------------------------------- */}
          {/* Footer */}
          {/* -------------------------------- */}

          <div className="flex min-h-[67px] items-center justify-between px-7 py-3">

            <button
              type="button"
              onClick={clearAllFiles}
              disabled={isUploading}
              className="py-2 text-[13px] text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear All Files
            </button>

            <div className="flex items-center gap-3">

              {failedCount > 0 && (
                <span className="text-xs text-red-600">
                  {failedCount} failed
                </span>
              )}

              <button
                type="button"
                disabled={!canUpload}
                onClick={uploadCVs}
                className={`h-[38px] rounded-lg px-[18px] text-[13px] font-medium transition ${
                  canUpload
                    ? "bg-[#19295F] text-white hover:bg-blue-900"
                    : "cursor-not-allowed bg-slate-300 text-slate-500"
                }`}
              >
                {isUploading
                  ? "Uploading..."
                  : uploadedCount > 0 &&
                      !files.some(
                        (file) => file.status === "ready"
                      )
                    ? "Uploaded"
                    : "Upload CVs"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
