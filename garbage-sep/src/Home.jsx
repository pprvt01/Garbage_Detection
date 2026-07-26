import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Video, AlertCircle, Trash2, Recycle } from 'lucide-react';

const Home = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const [resultImage, setResultImage] = useState(null);
  const [garbageCount, setGarbageCount] = useState(null);
  const [detectedClasses, setDetectedClasses] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPreview(fileURL);

      if (selectedFile.type.startsWith('image/')) setFileType('image');
      else if (selectedFile.type.startsWith('video/')) setFileType('video');

      setShowInfo(false);
      setResultImage(null);
      setDetectedClasses([]);
      setGarbageCount(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setShowInfo(false);
    setResultImage(null);
    setDetectedClasses([]);
    setGarbageCount(null);
  };

const handleAnalyze = async () => {
  if (!file) return;

  const formData = new FormData();
  let url = "";

  if (fileType === "image") {
    formData.append("image", file);
    url = "http://127.0.0.1:5000/detect";
  } else if (fileType === "video") {
    formData.append("video", file);
    url = "http://127.0.0.1:5000/detect_video";
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);

    if (fileType === "image") {
      setGarbageCount(data.garbage_count);
      setDetectedClasses(data.classes);
      setResultImage(data.result_image_url);
    } else {
      setGarbageCount(data.total_detections);
      setDetectedClasses(data.classes);
      setResultImage(data.output_video_url);
    }

    setShowInfo(true);

  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Recycle className="w-10 h-10 text-green-600" />
            Garbage Identifier
          </h1>
          <p className="text-gray-600">Upload an image or video to identify waste items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Media</h2>

            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-96 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="mb-2 text-lg font-semibold text-gray-700">Click to upload</p>
                  <p className="text-sm text-gray-500">Image or Video (Max 10MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="relative">
                <div className="bg-gray-100 rounded-xl overflow-hidden h-96 flex items-center justify-center">
                  {fileType === 'image' ? (
                    <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <video src={preview} controls className="max-h-full max-w-full" />
                  )}
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {file && (
              <div className="mt-6">
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Analyze Garbage
                </button>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detection Results</h2>

            {!showInfo ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle className="w-20 h-20 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Upload & analyze image to get results</p>
              </div>
            ) : (
              <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                
                {/* Garbage Count */}
                <div className="text-lg font-semibold text-blue-700">
                  Total Detected Items: {garbageCount}
                </div>

                {/* Display Detected Classes */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-blue-600" />
                    Detected Categories
                  </h4>
                  <ul className="space-y-2">
                    {detectedClasses.map((cls, index) => (
                      <li key={index} className="text-gray-700">
                        • {cls}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Processed Image */}
                {resultImage && (
                  fileType === "image" ? (
                    <img
                      src={resultImage}
                      alt="Detected Output"
                      className="rounded-lg shadow-lg border"
                    />
                  ) : (
                    <video
                      key={resultImage}   // 🔥 IMPORTANT
                      src={resultImage}
                      controls
                      className="rounded-lg shadow-lg border w-full"
                    />
                  )
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;