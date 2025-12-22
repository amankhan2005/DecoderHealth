 import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminHeroImages() {
  const API = import.meta.env.VITE_API_BASE;

  const [files, setFiles] = useState([]);
  const [slides, setSlides] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // HERO TEXT STATES
  const [heroText, setHeroText] = useState({
    heading: "",
    highlight: "",
    subheading: "",
    highlightColor: "",
    textColor: "",
    buttonBg: "",
    buttonTextColor: "",
  });

  const fileInputRef = useRef(null);

  const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
  const RECOMMENDED_SIZE = 1 * 1024 * 1024;

  /* --------------------------
       Load Existing Images
  --------------------------- */
  const loadSlides = async () => {
    try {
      const res = await axios.get(`${API}/hero`);
      setSlides(res.data.images || []);
    } catch (err) {
      showModalMessage("Failed to load images", "error");
    }
  };

  /* --------------------------
       Load Text From Backend
  --------------------------- */
  const loadText = async () => {
    try {
      const res = await axios.get(`${API}/hero`);
      // backend returns { images: [...], text: {...} }
      if (res.data.text) {
        setHeroText(res.data.text);
      }
    } catch (err) {
      console.log(err);
      showModalMessage("Failed to load hero text", "error");
    }
  };

  useEffect(() => {
    loadSlides();
    loadText();
  }, []);

  /* --------------------------
        File Selection
  --------------------------- */
  const processFiles = (fileList) => {
    const validFiles = [];
    const oversizedFiles = [];

    fileList.forEach((file) => {
      if (file.size > FILE_SIZE_LIMIT) {
        oversizedFiles.push(file);
      } else if (file.type.startsWith("image/")) {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      showModalMessage("Some files exceed 5MB limit", "largeFile");
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    processFiles(selected);
  };

  /* --------------------------
       Drag & Drop
  --------------------------- */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* --------------------------
         Upload Images
  --------------------------- */
  const handleUpload = async () => {
    if (files.length === 0) {
      showModalMessage("Select at least one image", "info");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    setUploading(true);

    try {
      await axios.post(`${API}/hero/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showModalMessage("Images uploaded!", "success");
      setFiles([]);
      loadSlides();
    } catch {
      showModalMessage("Upload failed", "error");
    }

    setUploading(false);
  };

  /* --------------------------
          DELETE IMAGE
  --------------------------- */
  const handleDelete = (imgObj) => {
    let filename =
      imgObj?.relative?.split("/")?.pop() ||
      imgObj?.full?.split("/")?.pop() ||
      null;

    if (!filename) {
      showModalMessage("Unable to detect filename", "error");
      return;
    }

    setConfirmAction(() => async () => {
      try {
        await axios.delete(`${API}/hero/delete`, {
          data: { filename },
        });

        showModalMessage("Image deleted", "success");
        loadSlides();
      } catch {
        showModalMessage("Delete failed", "error");
      }
    });

    showModalMessage("Delete this image?", "confirm");
  };

  /* --------------------------
       Modal Handler
  --------------------------- */
  const showModalMessage = (msg, type) => {
    setModalMessage(msg);
    setModalType(type);
    setShowModal(true);
  };

  const handleModalAction = () => {
    if (modalType === "confirm" && confirmAction) confirmAction();
    setShowModal(false);
    setConfirmAction(null);
  };

  /* --------------------------
       Helpers (file size UI)
  --------------------------- */
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return +(bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const getFileSizeColor = (size) => {
    if (size > FILE_SIZE_LIMIT) return "text-red-700 bg-red-100";
    if (size > RECOMMENDED_SIZE) return "text-green-600 bg-green-100";
    return "text-green-700 bg-green-100";
  };

  /* --------------------------
        Hero Text Handlers
  --------------------------- */
  const handleTextChange = (field, value) => {
    setHeroText((p) => ({ ...p, [field]: value }));
  };

  const saveHeroText = async () => {
    try {
      await axios.put(`${API}/hero/text`, heroText, {
        headers: { "Content-Type": "application/json" },
      });
      showModalMessage("Hero text saved!", "success");
      loadText();
    } catch (err) {
      console.log(err);
      showModalMessage("Save failed!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">Hero Section Manager</h1>
          <p className="text-gray-600 text-lg">Manage your hero images and text content</p>
        </div>

        {/* Images Upload Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-10 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Upload New Images</h2>
              <p className="text-sm text-gray-500">Add images to your hero slider</p>
            </div>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-green-300 hover:bg-green-50/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 font-medium mb-1">Drag & drop images here</p>
            <p className="text-gray-500 text-sm">or click to browse files</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recommended: &lt;1MB for faster loading
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Maximum: 5MB
              </div>
            </div>
          </div>

          {/* Selected files preview */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Images ({files.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {files.map((f, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(f)}
                      className="w-full h-24 object-cover rounded-lg shadow-md"
                      alt={f.name}
                    />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                      {f.name}
                    </div>
                    <div className={`absolute top-1 left-1 text-xs px-1 rounded ${getFileSizeColor(f.size)}`}>
                      {formatFileSize(f.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {/* Performance Note */}
            <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium">Performance Tip</p>
                <p className="text-xs text-blue-600 mt-1">For optimal website performance and faster loading times, we recommend compressing images to under 1MB. Use tools like TinyPNG or ImageOptim before uploading.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl hover:from-green-700 hover:to-green-900 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Images
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Existing Slides */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-10 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Existing Slides</h2>
                <p className="text-sm text-gray-500">Manage your current hero images</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-gray-500">{slides.length} images</span>
            </div>
          </div>

          {slides.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-center font-medium">No hero images yet</p>
              <p className="text-gray-400 text-sm mt-1">Upload images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((imgObj, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video relative">
                    <img
                      src={imgObj.full}
                      className="w-full h-full object-cover"
                      alt={`slide-${idx}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Image Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">Image {idx + 1}</p>
                      <p className="text-white/80 text-xs truncate">{imgObj?.relative?.split("/")?.pop() || "file.jpg"}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => setSelectedImage(imgObj.full)}
                        className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-lg hover:bg-white transition-colors"
                        title="View"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(imgObj)}
                        className="bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HERO TEXT SETTINGS */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Hero Text & Colors</h2>
                <p className="text-sm text-gray-500">Customize your hero section text and colors</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                value={heroText.heading || ""}
                onChange={(e) => handleTextChange("heading", e.target.value)}
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Main heading"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlight Text</label>
              <input
                value={heroText.highlight || ""}
                onChange={(e) => handleTextChange("highlight", e.target.value)}
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Highlighted phrase"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
              <textarea
                value={heroText.subheading || ""}
                onChange={(e) => handleTextChange("subheading", e.target.value)}
                rows={3}
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Short description under heading"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highlight Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={heroText.highlightColor || "#F57C00"}
                      onChange={(e) => handleTextChange("highlightColor", e.target.value)}
                      className="h-12 w-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                      title="Pick highlight color"
                    />
                    <input
                      type="text"
                      value={heroText.highlightColor || "#F57C00"}
                      onChange={(e) => handleTextChange("highlightColor", e.target.value)}
                      className="flex-1 border-2 border-gray-200 p-2 rounded-lg"
                      placeholder="#F57C00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={heroText.textColor || "#FFFFFF"}
                      onChange={(e) => handleTextChange("textColor", e.target.value)}
                      className="h-12 w-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                      title="Pick main text color"
                    />
                    <input
                      type="text"
                      value={heroText.textColor || "#FFFFFF"}
                      onChange={(e) => handleTextChange("textColor", e.target.value)}
                      className="flex-1 border-2 border-gray-200 p-2 rounded-lg"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Background</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={heroText.buttonBg || "#FFFFFF"}
                      onChange={(e) => handleTextChange("buttonBg", e.target.value)}
                      className="h-12 w-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                      title="Button background color"
                    />
                    <input
                      type="text"
                      value={heroText.buttonBg || "#FFFFFF"}
                      onChange={(e) => handleTextChange("buttonBg", e.target.value)}
                      className="flex-1 border-2 border-gray-200 p-2 rounded-lg"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={heroText.buttonTextColor || "#2E7D32"}
                      onChange={(e) => handleTextChange("buttonTextColor", e.target.value)}
                      className="h-12 w-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                      title="Button text color"
                    />
                    <input
                      type="text"
                      value={heroText.buttonTextColor || "#2E7D32"}
                      onChange={(e) => handleTextChange("buttonTextColor", e.target.value)}
                      className="flex-1 border-2 border-gray-200 p-2 rounded-lg"
                      placeholder="#2E7D32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={loadText}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              onClick={saveHeroText}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
              </svg>
              Save Text & Colors
            </button>
          </div>
        </div>
      </div>

      {/* Image preview modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img src={selectedImage} alt="preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation / Info Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className={`p-6 ${
              modalType === "success" ? "bg-gradient-to-r from-green-500 to-green-600" :
              modalType === "error" ? "bg-gradient-to-r from-red-500 to-red-600" :
              modalType === "confirm" ? "bg-gradient-to-r from-green-500 to-green-600" :
              modalType === "largeFile" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
              "bg-gradient-to-r from-blue-500 to-blue-600"
            } rounded-t-2xl`}>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {modalType === "success" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : modalType === "error" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : modalType === "confirm" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : modalType === "largeFile" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className={`text-xl font-bold text-center mb-2 ${
                modalType === "success" ? "text-green-600" :
                modalType === "error" ? "text-red-600" :
                modalType === "confirm" ? "text-green-600" :
                modalType === "largeFile" ? "text-yellow-600" :
                "text-blue-600"
              }`}>
                {modalType === "success" ? "Success!" :
                 modalType === "error" ? "Error!" :
                 modalType === "confirm" ? "Confirm Action" :
                 modalType === "largeFile" ? "File Size Limit Exceeded" :
                 "Information"}
              </h3>
              <div className="text-gray-600 text-center">
                {modalType === "largeFile" ? (
                  <div>
                    <p className="mb-3">Some files exceed the 5MB limit and were not added:</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-left max-h-40 overflow-y-auto">
                      {files.filter(f => f.size > FILE_SIZE_LIMIT).length === 0 ? (
                        <p className="text-sm text-gray-500">No oversized files currently selected.</p>
                      ) : (
                        files.filter(f => f.size > FILE_SIZE_LIMIT).map((f, i) => (
                          <div key={i} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0">
                            <span className="text-sm truncate mr-2">{f.name}</span>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              {formatFileSize(f.size)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <p className="mt-3 text-sm">Please compress these images or choose smaller files.</p>
                  </div>
                ) : (
                  <p>{modalMessage}</p>
                )}
              </div>
              <div className="mt-6 flex justify-center space-x-3">
                {modalType === "confirm" ? (
                  <>
                    <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      Cancel
                    </button>
                    <button onClick={handleModalAction} className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                      Confirm
                    </button>
                  </>
                ) : (
                  <button onClick={() => setShowModal(false)} className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    modalType === "success" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                    modalType === "error" ? "bg-red-100 text-red-700 hover:bg-red-200" :
                    modalType === "largeFile" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                    "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}>
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}