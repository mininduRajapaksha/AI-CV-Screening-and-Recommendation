import { useRef, useState } from "react";
import {
  ChevronDown,
  UploadCloud
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
    newFiles.forEach((newFiles) =>{
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
  
  

  return (
    <div className="w-full pb-10">

      {/*page header*/}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold leading-9 text-slate-900">CV Upload</h1>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Select a job posting, then upload candidate CVs for AI screening.
        </p>
      </div>

      {/*Job posting select*/}
      <div className="mx-auto mb-6 w-[calc(100%-140px)] rounded-[14px] border border-slate-200 bg-white px-11 py-7">
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
    </div>
  );
}
