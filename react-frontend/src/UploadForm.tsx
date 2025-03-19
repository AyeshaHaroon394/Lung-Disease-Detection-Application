import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button, TextField, Typography, Box, CircularProgress, Dialog, DialogTitle, DialogContent } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] }, // Accept images only
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file!");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      setOpen(true);
    } catch (error: any) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload Scans</h2>
      <TextField label="Lab Name" fullWidth variant="outlined" margin="dense" />
      <TextField label="Doctor Name (for Reference)" fullWidth variant="outlined" margin="dense" />
      <TextField label="Date of Scan" type="date" fullWidth variant="outlined" margin="dense" InputLabelProps={{ shrink: true }} />
      <TextField label="Mobile Number" fullWidth variant="outlined" margin="dense" />

      {/* Drag & Drop Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          borderRadius: "8px",
          marginTop: "15px",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 40, color: "#aaa" }} />
        <Typography variant="body1" sx={{ marginTop: 1 }}>Drag & Drop files here</Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>or</Typography>
        <Button variant="outlined" sx={{ marginTop: 1 }}>Browse Files</Button>
      </Box>

      {selectedFile && (
        <Typography variant="body2" sx={{ marginTop: 2, fontSize: "14px" }}>
          Selected File: <strong>{selectedFile.name}</strong>
        </Typography>
      )}

      {/* Buttons */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="error" onClick={() => setSelectedFile(null)}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={!selectedFile || loading}>
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload & Predict"}
        </Button>
      </div>

      {error && <Typography sx={{ color: "#b71c1c", fontSize: "14px", marginTop: 2 }}>{error}</Typography>}

      {/* Prediction Popup */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Prediction Result</DialogTitle>
        <DialogContent>
          <TextField label="Prediction" fullWidth value={prediction} margin="dense" variant="outlined" InputProps={{ readOnly: true }} />
          <TextField label="Confidence Score" fullWidth value={confidence.toFixed(2)} margin="dense" variant="outlined" InputProps={{ readOnly: true }} />
          <Button onClick={() => setOpen(false)} sx={{ marginTop: 2, backgroundColor: "#b71c1c", color: "white" }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadForm;
