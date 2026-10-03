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

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

function getAuthHeaders() {
  const token = localStorage.getItem("cvision_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function readApiResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
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
  const [isStartingScreening, setIsStartingScreening] =
    useState(false);
  const [isCancellingScreening, setIsCancellingScreening] =
    useState(false);

  // -----------------------------
  // Screening
  // -----------------------------

  const [screeningId, setScreeningId] = useState(null);
  const [screeningStatus, setScreeningStatus] = useState(null);

  // -----------------------------
  // Screening readiness
  // -----------------------------

  const [screeningReadiness, setScreeningReadiness] = useState({
    checked: false,
    ready: false,
    services: {
      database: false,
      redis: false,
      aiService: false,
      worker: false,
    },
    message: "",
  });

  // -----------------------------
  // Check screening readiness
  // -----------------------------

  const checkScreeningReadiness = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/screening/readiness`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const data = await response.json();

      if (!response.ok && !data) {
        throw new Error(
          "Unable to check screening services."
        );
      }

      if (data?.success) {
        let message = "";

        if (!data.ready) {
          if (!data.services?.database) {
            message =
              "Database service is unavailable.";
          } else if (!data.services?.redis) {
            message =
              "Redis service is unavailable.";
          } else if (!data.services?.aiService) {
            message =
              "AI service is unavailable. Please start the AI service.";
          } else if (!data.services?.worker) {
            message =
              "CV processing worker is not running. Please start the worker.";
          } else {
            message =
              "Screening services are not ready.";
          }
        }

        setScreeningReadiness({
          checked: true,
          ready: data.ready === true,
          services: {
            database:
              data.services?.database === true,
            redis:
              data.services?.redis === true,
            aiService:
              data.services?.aiService === true,
            worker:
              data.services?.worker === true,
          },
          message,
        });

        return data;
      }

      throw new Error(
        data?.message ||
          "Unable to check screening services."
      );
    } catch (error) {
      console.error(
        "Screening readiness check failed:",
        error
      );

      setScreeningReadiness({
        checked: true,
        ready: false,
        services: {
          database: false,
          redis: false,
          aiService: false,
          worker: false,
        },
        message:
          error.message ||
          "Unable to check screening services.",
      });

      return null;
    }
  };

  // -----------------------------
  // Check readiness on page load
  // -----------------------------

  useEffect(() => {
    checkScreeningReadiness();

    const readinessInterval = setInterval(
      () => {
        checkScreeningReadiness();
      },
      10000
    );

    return () => {
      clearInterval(readinessInterval);
    };
  }, []);

  // -----------------------------
  // Fetch jobs
  // -----------------------------

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError("");

        const response = await fetch(
          `${API_BASE_URL}/jobs`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session has expired. Please sign in again."
            );
          }

          throw new Error(
            "Failed to fetch job postings"
          );
        }

        const data = await response.json();

        setJobs(data);

        /*
         * Only select the first job automatically if there
         * is no active screening to restore.
         *
         * The active screening effect below can overwrite
         * this with the correct job.
         */
        if (data.length > 0) {
          setSelectedJob(
            (currentJob) =>
              currentJob || data[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error
        );

        setJobsError(error.message);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // -----------------------------
  // Restore active screening
  // -----------------------------

  useEffect(() => {
    const restoreActiveScreening = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/screening/active`,
          {
            headers: getAuthHeaders(),
          }
        );

        const data = await readApiResponse(
          response,
          "Failed to restore active screening"
        );

        /*
         * No active screening.
         *
         * This is the normal state when the user first
         * opens the CV Upload page.
         */
        if (!data.screening) {
          return;
        }

        const screening = data.screening;

        console.log(
          "Active screening restored:",
          screening
        );

        // -----------------------------
        // Restore screening information
        // -----------------------------

        setScreeningId(screening._id);

        setScreeningStatus(screening);

        // -----------------------------
        // Restore selected job
        // -----------------------------

        setSelectedJob(screening.jobId);

        // -----------------------------
        // Restore CV records
        // -----------------------------

        if (
          screening.cvIds &&
          screening.cvIds.length > 0
        ) {
          const cvIds =
            screening.cvIds.join(",");

          const cvResponse = await fetch(
            `${API_BASE_URL}/cvs/by-ids?ids=${encodeURIComponent(
              cvIds
            )}`,
            {
              headers: getAuthHeaders(),
            }
          );

          const cvData =
            await readApiResponse(
              cvResponse,
              "Failed to restore uploaded CVs"
            );

          if (
            cvData.cvs &&
            Array.isArray(
              cvData.cvs
            )
          ) {
            const restoredFiles =
              cvData.cvs.map(
                (cv) => ({
                  id: cv._id,
                  file: null,
                  name: cv.originalName,
                  size: cv.fileSize,
                  progress: 100,
                  status: "uploaded",
                  error: null,
                  cvId: cv._id,
                })
              );

            setFiles(
              restoredFiles
            );

            console.log(
              "Uploaded CVs restored:",
              restoredFiles
            );
          }
        }
      } catch (error) {
        console.error(
          "Error restoring active screening:",
          error
        );
      }
    };

    restoreActiveScreening();
  }, []);

  // -----------------------------
  // Poll screening status
  // -----------------------------

  useEffect(() => {
    if (!screeningId) {
      return;
    }

    let intervalId;

    const fetchScreeningStatus =
      async () => {
        try {
          const response =
            await fetch(
              `${API_BASE_URL}/screening/${screeningId}`,
              {
                headers:
                  getAuthHeaders(),
              }
            );

          const data =
            await readApiResponse(
              response,
              "Failed to fetch screening status"
            );

          setScreeningStatus(
            data.screening
          );

          console.log(
            "Screening status:",
            data.screening
          );

          // Stop polling when finished
          if (
            data.screening.status ===
              "complete" ||
            data.screening.status ===
              "failed" ||
            data.screening.status ===
              "cancelled"
          ) {
            clearInterval(
              intervalId
            );
          }
        } catch (error) {
          console.error(
            "Error fetching screening status:",
            error
          );
        }
      };

    // Fetch immediately
    fetchScreeningStatus();

    // Poll every 2 seconds
    intervalId = setInterval(
      fetchScreeningStatus,
      2000
    );

    // Cleanup when component unmounts
    return () => {
      clearInterval(
        intervalId
      );
    };
  }, [screeningId]);

  // -----------------------------
  // File validation
  // -----------------------------

  const validateFile = (file) => {
    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      return "Only PDF files are allowed";
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return "File exceeds the 5MB limit";
    }

    return null;
  };

  // -----------------------------
  // Add files
  // -----------------------------

  const addFiles = (
    selectedFiles
  ) => {
    const incomingFiles =
      Array.from(
        selectedFiles
      );

    if (
      incomingFiles.length ===
      0
    ) {
      return;
    }

    if (
      files.length >=
      MAX_FILES
    ) {
      return;
    }

    const availableSlots =
      MAX_FILES - files.length;

    const filesToAdd =
      incomingFiles.slice(
        0,
        availableSlots
      );

    const newFiles =
      filesToAdd.map(
        (file) => {
          const error =
            validateFile(
              file
            );

          return {
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            status: error
              ? "failed"
              : "ready",
            error:
              error || null,
            cvId: null,
          };
        }
      );

    setFiles(
      (prevFiles) => [
        ...prevFiles,
        ...newFiles,
      ]
    );
  };

  // -----------------------------
  // Browse files
  // -----------------------------

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (
    event
  ) => {
    addFiles(
      event.target.files
    );

    // Allow selecting the same file again later
    event.target.value = "";
  };

  // -----------------------------
  // Drag and Drop
  // -----------------------------

  const handleDragOver = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(false);

    addFiles(
      event.dataTransfer.files
    );
  };

  // -----------------------------
  // Remove file
  // -----------------------------

  const removeFile = (
    fileId
  ) => {
    if (
      isUploading ||
      isStartingScreening ||
      isCancellingScreening ||
      (
        screeningId &&
        screeningStatus?.status ===
          "processing"
      )
    ) {
      return;
    }

    setFiles(
      (prevFiles) =>
        prevFiles.filter(
          (file) =>
            file.id !==
            fileId
        )
    );
  };

  // -----------------------------
  // Clear all files
  // -----------------------------

  const clearAllFiles = () => {
    /*
     * Do not allow clearing while screening
     * is actively processing.
     */
    if (
      isUploading ||
      isStartingScreening ||
      isCancellingScreening ||
      (
        screeningId &&
        screeningStatus?.status ===
          "processing"
      )
    ) {
      return;
    }

    setFiles([]);
    setScreeningId(null);
    setScreeningStatus(null);
  };

  // -----------------------------
  // Upload CVs
  // -----------------------------

  const uploadCVs =
    async () => {
      if (!selectedJob) {
        alert(
          "Please select a job posting."
        );
        return;
      }

      const validFiles =
        files.filter(
          (file) =>
            file.status ===
            "ready"
        );

      if (
        validFiles.length ===
        0
      ) {
        alert(
          "Please add at least one valid CV."
        );
        return;
      }

      try {
        setIsUploading(
          true
        );

        // Mark files as uploading
        setFiles(
          (prevFiles) =>
            prevFiles.map(
              (item) =>
                item.status ===
                "ready"
                  ? {
                      ...item,
                      status:
                        "uploading",
                      progress: 20,
                    }
                  : item
            )
        );

        // Create FormData
        const formData =
          new FormData();

        validFiles.forEach(
          (item) => {
            formData.append(
              "cvs",
              item.file
            );
          }
        );

        // Send CVs to backend
        const response =
          await fetch(
            `${API_BASE_URL}/cvs/upload-multiple/`,
            {
              method: "POST",
              headers:
                getAuthHeaders(),
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to upload CVs"
          );
        }

        if (
          !data.cvs ||
          !Array.isArray(
            data.cvs
          )
        ) {
          throw new Error(
            "Invalid response received from CV upload API"
          );
        }

        // Match backend CV records
        setFiles(
          (prevFiles) =>
            prevFiles.map(
              (item) => {
                if (
                  item.status !==
                  "uploading"
                ) {
                  return item;
                }

                const uploadedCV =
                  data.cvs.find(
                    (cv) =>
                      cv.originalName ===
                      item.name
                  );

                if (
                  !uploadedCV
                ) {
                  return {
                    ...item,
                    status:
                      "failed",
                    progress: 0,
                    error:
                      "CV was uploaded but its backend record could not be matched.",
                  };
                }

                return {
                  ...item,
                  status:
                    "uploaded",
                  progress: 100,
                  cvId:
                    uploadedCV._id,
                  error: null,
                };
              }
            )
        );

        console.log(
          "CV upload successful:"
        );
        console.log(data);

        // Refresh service readiness after upload
        checkScreeningReadiness();
      } catch (error) {
        console.error(
          "CV upload error:",
          error
        );

        setFiles(
          (prevFiles) =>
            prevFiles.map(
              (item) =>
                item.status ===
                "uploading"
                  ? {
                      ...item,
                      status:
                        "failed",
                      progress: 0,
                      error:
                        error.message,
                    }
                  : item
            )
        );

        alert(
          error.message
        );
      } finally {
        setIsUploading(
          false
        );
      }
    };

  // -----------------------------
  // Start screening
  // -----------------------------

  const startScreening =
    async () => {
      if (!selectedJob) {
        alert(
          "Please select a job posting."
        );
        return;
      }

      const uploadedCVIds =
        files
          .filter(
            (file) =>
              file.status ===
                "uploaded" &&
              file.cvId
          )
          .map(
            (file) =>
              file.cvId
          );

      if (
        uploadedCVIds.length ===
        0
      ) {
        alert(
          "Please upload at least one CV first."
        );
        return;
      }

      try {
        setIsStartingScreening(
          true
        );

        /*
         * Refresh readiness immediately before
         * starting the screening.
         *
         * This protects against a worker/AI service
         * stopping after the periodic readiness check.
         */
        const readiness =
          await checkScreeningReadiness();

        if (
          !readiness ||
          !readiness.ready
        ) {
          throw new Error(
            screeningReadiness.message ||
              "Screening services are not ready. Please try again."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/screening/start`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({
                jobId:
                  selectedJob,
                cvIds:
                  uploadedCVIds,
              }),
            }
          );

        const data =
          await readApiResponse(
            response,
            "Failed to start screening"
          );

        console.log(
          "Screening started successfully:",
          data
        );

        setScreeningId(
          data.screeningId
        );

        setScreeningStatus({
          _id:
            data.screeningId,
          jobId:
            selectedJob,
          cvIds:
            uploadedCVIds,
          totalCVs:
            data.totalCVs,
          completedCVs: 0,
          failedCVs: 0,
          status:
            "processing",
        });

        alert(
          `Screening started for ${data.totalCVs} CV(s).`
        );
      } catch (error) {
        console.error(
          "Screening error:",
          error
        );

        /*
         * Refresh readiness so the UI immediately
         * reflects the current service state.
         */
        await checkScreeningReadiness();

        alert(
          error.message
        );
      } finally {
        setIsStartingScreening(
          false
        );
      }
    };

  // -----------------------------
  // Restart failed screening
  // -----------------------------

  const restartScreening =
    async () => {
      if (!selectedJob) {
        alert(
          "Please select a job posting."
        );
        return;
      }

      const uploadedCVIds =
        files
          .filter(
            (file) =>
              file.status ===
                "uploaded" &&
              file.cvId
          )
          .map(
            (file) =>
              file.cvId
          );

      if (
        uploadedCVIds.length ===
        0
      ) {
        alert(
          "No uploaded CVs are available to restart screening."
        );
        return;
      }

      try {
        setIsStartingScreening(
          true
        );

        /*
         * Check readiness before restarting.
         */
        const readiness =
          await checkScreeningReadiness();

        if (
          !readiness ||
          !readiness.ready
        ) {
          throw new Error(
            screeningReadiness.message ||
              "Screening services are not ready. Please try again."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/screening/start`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                ...getAuthHeaders(),
              },
              body: JSON.stringify({
                jobId:
                  selectedJob,
                cvIds:
                  uploadedCVIds,
              }),
            }
          );

        const data =
          await readApiResponse(
            response,
            "Failed to restart screening"
          );

        console.log(
          "Screening restarted successfully:",
          data
        );

        // Replace old failed screening
        // with the new screening ID
        setScreeningId(
          data.screeningId
        );

        setScreeningStatus({
          _id:
            data.screeningId,
          jobId:
            selectedJob,
          cvIds:
            uploadedCVIds,
          totalCVs:
            data.totalCVs,
          completedCVs: 0,
          failedCVs: 0,
          status:
            "processing",
        });

        alert(
          `Screening restarted for ${data.totalCVs} CV(s).`
        );
      } catch (error) {
        console.error(
          "Restart screening error:",
          error
        );

        await checkScreeningReadiness();

        alert(
          error.message
        );
      } finally {
        setIsStartingScreening(
          false
        );
      }
    };

  // -----------------------------
  // Stop / Cancel screening
  // -----------------------------

  const handleStopScreening =
    async () => {
      if (!screeningId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to stop this screening?\n\nRemaining CVs will not be processed."
        );

      if (!confirmed) {
        return;
      }

      try {
        setIsCancellingScreening(
          true
        );

        const response =
          await fetch(
            `${API_BASE_URL}/screening/${screeningId}/cancel`,
            {
              method: "POST",
              headers:
                getAuthHeaders(),
            }
          );

        const data =
          await readApiResponse(
            response,
            "Failed to stop screening"
          );

        console.log(
          "Screening cancelled:",
          data
        );

        /*
         * Clear the active screening from the UI.
         *
         * Uploaded CVs are intentionally kept so the
         * user can start another screening.
         */
        setScreeningId(null);
        setScreeningStatus(null);

        alert(
          "Screening stopped successfully."
        );
      } catch (error) {
        console.error(
          "Stop screening error:",
          error
        );

        alert(
          error.message
        );
      } finally {
        setIsCancellingScreening(
          false
        );
      }
    };

  // -----------------------------
  // Counts
  // -----------------------------

  const uploadedCount =
    files.filter(
      (file) =>
        file.status ===
        "uploaded"
    ).length;

  const failedCount =
    files.filter(
      (file) =>
        file.status ===
        "failed"
    ).length;

  const readyCount =
    files.filter(
      (file) =>
        file.status ===
        "ready"
    ).length;

  // -----------------------------
  // Screening progress
  // -----------------------------

  const completedCVs =
    screeningStatus?.completedCVs ||
    0;

  const failedScreeningCVs =
    screeningStatus?.failedCVs ||
    0;

  const totalScreeningCVs =
    screeningStatus?.totalCVs ||
    uploadedCount;

  const processedCVs =
    completedCVs +
    failedScreeningCVs;

  const screeningProgress =
    totalScreeningCVs > 0
      ? Math.round(
          (processedCVs /
            totalScreeningCVs) *
            100
        )
      : 0;

  const screeningComplete =
    screeningStatus?.status ===
    "complete";

  const screeningFailed =
    screeningStatus?.status ===
    "failed";

  const screeningCancelled =
    screeningStatus?.status ===
    "cancelled";

  const screeningProcessing =
    screeningStatus?.status ===
    "processing";

  // -----------------------------
  // Button state
  // -----------------------------

  const hasUploadedFiles =
    uploadedCount > 0;

  const canUpload =
    files.length > 0 &&
    files.some(
      (file) =>
        file.status ===
        "ready"
    ) &&
    !isUploading &&
    !isStartingScreening &&
    !isCancellingScreening &&
    !screeningId;

  /*
   * Start Screening is only available when:
   *
   * 1. At least one CV is uploaded
   * 2. No CV is waiting to be uploaded
   * 3. No active screening exists
   * 4. The system readiness check has completed
   * 5. All required services are ready
   */
  const canStartScreening =
    uploadedCount > 0 &&
    readyCount === 0 &&
    !isUploading &&
    !isStartingScreening &&
    !isCancellingScreening &&
    !screeningId &&
    screeningReadiness.checked &&
    screeningReadiness.ready;

  // -----------------------------
  // Format file size
  // -----------------------------

  const formatFileSize = (
    bytes
  ) => {
    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  // -----------------------------
  // Selected job
  // -----------------------------

  const selectedJobData =
    jobs.find(
      (job) =>
        job._id ===
        selectedJob
    );

  // -----------------------------
  // Main UI
  // -----------------------------

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
          Select a job posting, then upload candidate CVs
          for AI screening.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Job Posting */}
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
              setSelectedJob(
                event.target.value
              )
            }
            disabled={
              jobsLoading ||
              isUploading ||
              isStartingScreening ||
              isCancellingScreening ||
              hasUploadedFiles ||
              !!screeningId
            }
            className="h-10 w-full appearance-none rounded-lg border border-slate-900 bg-white px-4 pr-10 text-[13px] text-slate-900 outline-none focus:border-blue-600 disabled:bg-slate-100"
          >

            {jobsLoading && (
              <option value="">
                Loading job postings...
              </option>
            )}

            {!jobsLoading &&
              jobs.length ===
                0 && (
                <option value="">
                  No job postings available
                </option>
              )}

            {!jobsLoading &&
              jobs.map(
                (job) => (
                  <option
                    key={
                      job._id
                    }
                    value={
                      job._id
                    }
                  >
                    {job.title}
                  </option>
                )
              )}

          </select>

          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-900"
          />

        </div>

        {jobsError && (
          <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle size={15} />
            {jobsError}
          </div>
        )}

        {selectedJobData && (
          <div className="mt-3 text-xs text-slate-500">
            Selected:{" "}
            <span className="font-medium text-slate-700">
              {
                selectedJobData.title
              }
            </span>
          </div>
        )}

      </div>

      {/* -------------------------------- */}
      {/* Screening Service Status */}
      {/* -------------------------------- */}

      {screeningReadiness.checked &&
        !screeningReadiness.ready && (
          <div className="mx-auto mb-6 w-[calc(100%-140px)] rounded-[14px] border border-red-200 bg-red-50 px-6 py-4">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div className="flex-1">

                <p className="text-sm font-semibold text-red-800">
                  Screening services are not ready
                </p>

                <p className="mt-1 text-xs text-red-700">
                  {
                    screeningReadiness.message
                  }
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs">

                  <span
                    className={
                      screeningReadiness.services.database
                        ? "font-medium text-green-700"
                        : "font-medium text-red-700"
                    }
                  >
                    Database{" "}
                    {screeningReadiness.services.database
                      ? "✓"
                      : "✕"}
                  </span>

                  <span
                    className={
                      screeningReadiness.services.redis
                        ? "font-medium text-green-700"
                        : "font-medium text-red-700"
                    }
                  >
                    Redis{" "}
                    {screeningReadiness.services.redis
                      ? "✓"
                      : "✕"}
                  </span>

                  <span
                    className={
                      screeningReadiness.services.aiService
                        ? "font-medium text-green-700"
                        : "font-medium text-red-700"
                    }
                  >
                    AI Service{" "}
                    {screeningReadiness.services.aiService
                      ? "✓"
                      : "✕"}
                  </span>

                  <span
                    className={
                      screeningReadiness.services.worker
                        ? "font-medium text-green-700"
                        : "font-medium text-red-700"
                    }
                  >
                    CV Worker{" "}
                    {screeningReadiness.services.worker
                      ? "✓"
                      : "✕"}
                  </span>

                </div>

              </div>

            </div>

          </div>
        )}

      {/* -------------------------------- */}
      {/* Upload Area */}
      {/* -------------------------------- */}

      <div
        onDragOver={
          handleDragOver
        }
        onDragLeave={
          handleDragLeave
        }
        onDrop={handleDrop}
        className={`mx-auto mb-6 flex min-h-[315px] w-[calc(100%-140px)] flex-col items-center justify-center rounded-[14px] border-[1.5px] border-dashed transition ${
          isDragging
            ? "border-blue-600 bg-blue-50"
            : "border-slate-500 bg-white"
        }`}
      >

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <UploadCloud
            size={36}
          />
        </div>

        <h2 className="text-base font-medium leading-6 text-slate-900">
          Drag & Drop or Browse Files to Upload
        </h2>

        <p className="mt-1.5 mb-4 text-[13px] leading-5 text-slate-500">
          PDF only, up to 5MB each, maximum 50 files
        </p>

        <button
          type="button"
          onClick={
            handleBrowse
          }
          disabled={
            isUploading ||
            isStartingScreening ||
            isCancellingScreening ||
            !!screeningId
          }
          className="h-[38px] cursor-pointer rounded-lg bg-[#19295F] px-6 text-[13px] font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Browse Files
        </button>

        <input
          ref={
            fileInputRef
          }
          type="file"
          accept=".pdf,application/pdf"
          multiple
          hidden
          onChange={
            handleFileSelect
          }
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
              {files.length ===
              1
                ? "file"
                : "files"}{" "}
              selected
            </span>

            <span>
              {uploadedCount} of{" "}
              {files.length}{" "}
              uploaded
            </span>

          </div>

          {/* Files */}

          <div className="px-[15px]">

            {files.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="flex min-h-[86px] items-center gap-4 border-b border-slate-200 px-3 py-3"
                >

                  {/* File icon */}

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-slate-900">
                    <FileText
                      size={24}
                    />
                  </div>

                  {/* File information */}

                  <div className="min-w-0 flex-1">

                    <div className="mb-1.5 truncate text-[13px] font-medium text-slate-900">
                      {
                        item.name
                      }
                    </div>

                    <div className="flex items-center gap-2.5">

                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.status ===
                            "failed"
                              ? "bg-red-600"
                              : item.status ===
                                  "uploaded"
                                ? "bg-green-500"
                                : "bg-blue-500"
                          }`}
                          style={{
                            width: `${item.progress}%`,
                          }}
                        />

                      </div>

                      <span className="w-9 text-right text-xs text-slate-500">
                        {
                          item.progress
                        }%
                      </span>

                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {formatFileSize(
                        item.size
                      )}
                    </div>

                    {item.status ===
                      "failed" && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600">
                        <AlertCircle
                          size={14}
                        />
                        {
                          item.error
                        }
                      </div>
                    )}

                  </div>

                  {/* Status */}

                  <div
                    className={`flex w-[110px] shrink-0 items-center gap-1 text-xs font-medium ${
                      item.status ===
                      "uploaded"
                        ? "text-green-600"
                        : item.status ===
                            "failed"
                          ? "text-red-600"
                          : item.status ===
                              "uploading"
                            ? "text-blue-600"
                            : "text-slate-500"
                    }`}
                  >

                    {item.status ===
                      "uploaded" && (
                      <>
                        <CheckCircle
                          size={
                            16
                          }
                        />
                        Uploaded
                      </>
                    )}

                    {item.status ===
                      "uploading" && (
                      <>
                        <LoaderCircle
                          size={
                            16
                          }
                          className="animate-spin"
                        />
                        Uploading...
                      </>
                    )}

                    {item.status ===
                      "ready" && (
                      <>
                        <FileText
                          size={
                            16
                          }
                        />
                        Ready
                      </>
                    )}

                    {item.status ===
                      "failed" && (
                      <>
                        <AlertCircle
                          size={
                            16
                          }
                        />
                        Failed
                      </>
                    )}

                  </div>

                  {/* Remove */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFile(
                        item.id
                      )
                    }
                    disabled={
                      isUploading ||
                      isStartingScreening ||
                      isCancellingScreening ||
                      (
                        screeningId &&
                        screeningStatus?.status ===
                          "processing"
                      )
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X
                      size={22}
                    />
                  </button>

                </div>
              )
            )}

          </div>

          {/* -------------------------------- */}
          {/* AI Screening Progress */}
          {/* -------------------------------- */}

          {screeningId &&
            screeningStatus && (
              <div className="border-t border-slate-200 px-7 py-5">

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      AI Screening
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {screeningComplete
                        ? "All CVs have been processed."
                        : screeningFailed
                          ? "The screening process failed."
                          : screeningCancelled
                            ? "The screening was cancelled."
                            : "CVs are being analyzed by the AI screening system."}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    {
                      processedCVs
                    }{" "}
                    /{" "}
                    {
                      totalScreeningCVs
                    }
                  </span>

                </div>

                {/* Progress bar */}

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      screeningFailed
                        ? "bg-red-600"
                        : screeningComplete
                          ? "bg-green-500"
                          : screeningCancelled
                            ? "bg-slate-500"
                            : "bg-[#19295F]"
                    }`}
                    style={{
                      width: `${screeningProgress}%`,
                    }}
                  />

                </div>

                {/* Progress information */}

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">

                  <span>
                    {
                      screeningProgress
                    }%
                    {" "}
                    processed
                  </span>

                  <span>
                    {
                      completedCVs
                    }{" "}
                    completed

                    {failedScreeningCVs >
                      0 &&
                      ` • ${failedScreeningCVs} failed`}
                  </span>

                </div>

                {/* Stop Screening */}

                {screeningProcessing && (
                  <div className="mt-5 flex justify-end">

                    <button
                      type="button"
                      onClick={
                        handleStopScreening
                      }
                      disabled={
                        isCancellingScreening
                      }
                      className="flex h-[38px] items-center gap-2 rounded-lg border border-red-300 px-4 text-[13px] font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {isCancellingScreening ? (
                        <>
                          <LoaderCircle
                            size={
                              16
                            }
                            className="animate-spin"
                          />
                          Stopping...
                        </>
                      ) : (
                        <>
                          <X
                            size={
                              16
                            }
                          />
                          Stop Screening
                        </>
                      )}

                    </button>

                  </div>
                )}

              </div>
            )}

          {/* -------------------------------- */}
          {/* Footer */}
          {/* -------------------------------- */}

          <div className="flex min-h-[67px] items-center justify-between px-7 py-3">

            {/* Clear All Files */}

            <button
              type="button"
              onClick={
                clearAllFiles
              }
              disabled={
                isUploading ||
                isStartingScreening ||
                isCancellingScreening ||
                (
                  screeningId &&
                  screeningStatus?.status ===
                    "processing"
                )
              }
              className="py-2 text-[13px] text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear All Files
            </button>

            <div className="flex items-center gap-3">

              {/* Failed upload count */}

              {failedCount >
                0 && (
                <span className="text-xs text-red-600">
                  {
                    failedCount
                  }{" "}
                  failed
                </span>
              )}

              {/* Screening processing */}

              {screeningProcessing && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                  Screening...
                </span>
              )}

              {/* Screening complete */}

              {screeningComplete && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <CheckCircle
                    size={16}
                  />
                  Screening Complete
                </span>
              )}

              {/* Screening failed */}

              {screeningFailed && (
                <>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle
                      size={16}
                    />
                    Screening Failed
                  </span>

                  <button
                    type="button"
                    onClick={
                      restartScreening
                    }
                    disabled={
                      isStartingScreening ||
                      !screeningReadiness.ready
                    }
                    className="flex h-[38px] items-center gap-2 rounded-lg bg-[#19295F] px-[18px] text-[13px] font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isStartingScreening ? (
                      <>
                        <LoaderCircle
                          size={
                            16
                          }
                          className="animate-spin"
                        />
                        Restarting...
                      </>
                    ) : (
                      "Restart Screening"
                    )}
                  </button>
                </>
              )}

              {/* Screening cancelled */}

              {screeningCancelled && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <X
                    size={16}
                  />
                  Screening Cancelled
                </span>
              )}

              {/* Main button */}

              {!screeningId && (
                <button
                  type="button"
                  disabled={
                    canStartScreening
                      ? false
                      : !canUpload
                  }
                  onClick={
                    canStartScreening
                      ? startScreening
                      : uploadCVs
                  }
                  className={`h-[38px] rounded-lg px-[18px] text-[13px] font-medium transition ${
                    canStartScreening ||
                    canUpload
                      ? "bg-[#19295F] text-white hover:bg-blue-900"
                      : "cursor-not-allowed bg-slate-300 text-slate-500"
                  }`}
                >
                  {isUploading
                    ? "Uploading..."
                    : isStartingScreening
                      ? "Starting Screening..."
                      : canStartScreening
                        ? "Start Screening"
                        : "Upload CVs"}
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}