import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle,
  LoaderCircle,
  X,
  CheckCircle2
} from "lucide-react"

const MAX_FILE_SIZE = 5* 1024 * 1024;
const MAX_FILES = 50;

const jobs = [
  "Backend Developer",
  "Frontend Developer",
  "Full stack Developer",
  "Software Engineer",
  "Data Analysis"
]

export default function CVUpload() {

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  
  const [selectedJob, setSelectedJob] = useState("Backend Developer");
  const [files, setFiles] = useState([]);

  const [isDragging, setIsDragging] = useState(false);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [screeningComplete, setScreeningComplete] = useState(false);

  //file validation
  const validateFile = (file) =>{

    if(!file.name.toLowerCase().endsWith(".pdf")){
      return "Only PDF files are allowed";
    }

    if(file.size > MAX_FILE_SIZE){
      return "File exceeds the 5MB limit"
    }

    return null;
  };

  //Add files
  const addFiles = (selectedFiles) =>{
    const incomingFiles = Array.from(selectedFiles);

    if(files.length >= MAX_FILES){
      return;
    }

    const availableSlots = MAX_FILES - files.length;
    const fileToAdd = incomingFiles.slice(0, availableSlots);

    const newFiles = fileToAdd.map((file) =>{
      const error = validateFile(file);

      return{
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        progress: error ? 0 : 0,
        status: error ? "failed" : "uploading",
        error,
      };
    });

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Simulate upload for valid files
    newFiles.forEach((newFile) =>{
      if(!newFile.error){
        simulateUpload(newFile.id);
      }
    });
  };

  //Simulate Upload
  const simulateUpload = (fileId) =>{
    let progress = 0;

    const interval = setInterval(() =>{
      progress += Math.floor(Math.random() * 15)+ 5;

      if(progress >=100) {
        progress = 100;
        clearInterval(interval);

        setFiles((prevFiles) =>
        prevFiles.map((item)=>
          item.id === fileId
            ? {
              ...item,
              progress:100,
              status: "completed"
            }
            : item
        ));
        return;
      }

      setFiles((prevFiles) =>
        prevFiles.map((item) =>
          item.id === fileId
            ? {
              ...item,
              progress,
              status: "uploading"
            }
            :item
        )
      );
    }, 400);
  };

  //Brows Files
  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    addFiles(event.target.files);

    event.target.value = "";
  };

  //Drag and Drop
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

  //Remove file
  const removeFile = (fileId) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  //Clear All
  const clearAllFiles = () => {
    setFiles([]);
  };

  //Counts
  const readyCount = files.filter(
    (file) => file.status === "completed"
  ).length;

  const canStartScreening =
    files.length > 0 &&
    readyCount === files.length &&
    !isScreening;
  
  //Start Screening
  const startScreening = () => {
    if (!canStartScreening) return;

    setIsScreening(true);
    setScreeningProgress(0);
    setScreeningComplete(false);

    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setScreeningProgress(100);

        setTimeout(() => {
          setIsScreening(false);
          setScreeningComplete(true);
        }, 500);

        return;
      }

      setScreeningProgress(progress);
    }, 500);
  };

  //Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full pb-10">

      {/*page header*/}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">CV Upload</h1>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Select a job posting, then upload candidate CVs for AI screening.
        </p>
      </div>

      {/*Job posting select*/}
      <div className="mx-auto mb-6 w-[calc(100%-140px)] rounded-[14px] border border-slate-200 bg-white px-11 py-7 shadow-sm">
        <label htmlFor="job-posting" className="mb-3 block text-sm font-medium text-slate-900">Job posting</label>

        <div className="relative">
          <select
            id="job-posting"
            value={selectedJob}
            onChange={(event) =>
              setSelectedJob(event.target.value)
            }
            className="h-10 w-full appearance-none rounded-lg border border-slate-900 bg-white px-4 pr-10 text-[13px] text-slate-900 outline-none focus:border-blue-600"
          >
            {jobs.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>

          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-900"
          />
        </div>
      </div>

      {/*Upload Area*/}
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
          className="h-[38px] rounded-lg bg-[#19295F] px-6 text-[13px] font-medium text-white transition hover:bg-blue-900"
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

      {/*File List*/}
      {files.length > 0 && (
        <div className="mx-auto w-[calc(100%-140px)] overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm">
          {/*file list header*/}
          <div className="flex h-[53px] items-center justify-between border-b border-slate-200 px-7 text-[13px] font-medium text-slate-900">
            <span>
              {files.length}{""}
              {files.length === 1 ? " file" : " files"} selected
            </span>

            <span>
              {readyCount} of {files.length} ready
            </span>
          </div>

          {/*files*/}
          <div className="px-[15px]">

            {files.map((item) => (
              <div
                key={item.id}
                className="flex min-h-[86px] items-center gap-4 border-b border-slate-200 px-3 py-3"
              >
                {/*File icon*/}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-slate-900">
                  <FileText size={24}/>
                </div>

                {/*File information*/}

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

                  {/*error*/}
                  {item.status === "failed" && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600">
                      <AlertCircle size={14}/>
                      {item.error}
                    </div>
                  )}
                </div>

                {/*Status*/}

                <div
                  className={`flex w-[105px] shrink-0 items-center gap-1 text-xs font-medium ${
                    item.status === "completed"
                      ? "text-green-600"
                      : item.status === "failed"
                        ? "text-red-600"
                        : "text-slate-500"
                  }`}
                >
                  {item.status === "completed" && (
                    <>
                      <CheckCircle size={16}/>
                      Completed
                    </>
                  )}

                  {item.status === "uploading" && (
                    <>
                      <LoaderCircle size={16} className="animate-spin"/>
                      Uploading...
                    </>
                  )}

                  {item.status === "failed" && (
                    <>
                      <AlertCircle size={16} />
                      Failed
                    </>
                  )}
                </div>

                {/*remove file*/}
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={22} />
                </button>

              </div>
            ))}
          </div>

          {/*footer*/}

          <div className="flex min-h-[67px] items-center justify-between px-7 py-3">
            <button
              type="button"
              onClick={clearAllFiles}
              className="py-2 text-[13px] text-slate-500 transition hover:text-slate-900"
            >
              Clear All Files
            </button>

            <button
              type="button"
              disabled={!canStartScreening}
              onClick={startScreening}
              className={`h-[38px] rounded-lg px-[18px] text-[13px] font-medium transition ${
                canStartScreening
                  ? "bg-[#19295F] text-white hover:bg-blue-900"
                  : "cursor-not-allowed bg-slate-300 text-slate-500"
              }`}
            >
              Start Screening
            </button>
          </div>
        </div>
      )
      }

      {/*Screening overlay*/}

      {isScreening && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[3px]">
          <div className="w-[420px] rounded-2xl bg-white p-8 text-center shadow-2xl">

            {/*Spinning*/}

            <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">

              <LoaderCircle size={32} className="animate-spin"/>
            </div>

            <h2 className="text-xl font-semibold leading-7 text-slate-900">
              Screening CVs
            </h2>

            <p className="mx-auto mt-2 max-w-[340px] text-sm leading-5 text-slate-500">
              Extracting Details...
            </p>

            <div className="mb-3 mt-5 text-[15px] font-medium leading-[22px] text-slate-700">
              {files.length}{""}
              {files.length === 1 ? " file" : " files"} processing
            </div>

            {/*Progress bar*/}

            <div className="h-2 w-full overflow-hidden rounded-lg bg-slate-200">

              <div
                className="h-full rounded-lg bg-blue-600 transition-all duration-300"
                style={{
                  width: `${screeningProgress}%`,
                }}
              />

            </div>

            <div className="mt-2 flex justify-between text-xs font-medium text-slate-500">
              <span>Processing...</span>

              <span>
                {screeningProgress}%
              </span>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Please wait while the screening is completed.
            </p>
          </div>
        </div>
      )}

      {/*Screening complete overlay*/}

      {screeningComplete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-[3px]">

          <div className="relative w-[420px] rounded-2xl bg-white p-8 text-center shadow-2xl">

            {/*Close button*/}

            <button
              type="button"
              onClick={() => setScreeningComplete(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={20}/>
            </button>

            <div className="mx-auto mb-[18px] flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={42}/>
            </div>

            <h2 className="text-xl font-semibold leading-7 text-slate-900">
               Screening Complete
            </h2>

            <p className="mx-auto mt-2 max-w-[340px] text-sm leading-5 text-slate-500">
              {files.length}{""}
              {files.length === 1 ? " CV has " : " CVs have "}{""}
              been successfully screened
            </p>

            <button
              type="button"
              onClick={() => navigate("/reports")}
              className="mt-5 h-10 rounded-lg bg-[#19295F] px-6 text-[13px] font-medium text-white transition hover:bg-blue-900"
            >
              View Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
