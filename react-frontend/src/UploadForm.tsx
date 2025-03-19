import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file!");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      setOpen(true); // Open the popup window
    } catch (error: any) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      padding: "20px", backgroundColor: "#e8e8e8", borderRadius: "10px", width: "100%"
    }}>
      <Typography variant="h5" sx={{ color: "#b71c1c", fontWeight: "bold" }}>
        Upload Chest X-Ray
      </Typography>

      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button
          component="span"
          sx={{
            backgroundColor: "#b71c1c",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#9a1313" },
          }}
        >
          {file ? file.name : "Choose File"}
        </Button>
      </label>

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{
          backgroundColor: "#b71c1c",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": { backgroundColor: "#9a1313" },
          "&:disabled": { backgroundColor: "#d4d4d4", cursor: "not-allowed" },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload & Predict"}
      </Button>

      {error && (
        <Typography sx={{ color: "#b71c1c", fontSize: "14px" }}>
          {error}
        </Typography>
      )}

      {/* Prediction Popup */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Prediction Result</DialogTitle>
        <DialogContent>
          <TextField
            label="Prediction"
            fullWidth
            value={prediction}
            margin="dense"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Confidence Score"
            fullWidth
            value={confidence.toFixed(2)}
            margin="dense"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <Button onClick={() => setOpen(false)} sx={{ marginTop: 2, backgroundColor: "#b71c1c", color: "white" }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UploadForm;
