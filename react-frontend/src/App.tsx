// import React from "react";
// import UploadForm from "./UploadForm";
// import "./App.css"; // Optional styling

// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <h1>Lung Disease Classifier</h1>
//       <UploadForm />
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import UploadForm from "./UploadForm";
import { Dialog, DialogContent, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Import an icon
import "./App.css"; // Optional styling

const App: React.FC = () => {
	const [open, setOpen] = useState(false);

	return (
		<div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>Lung Disease Classifier</h1>
			<Button
				variant="contained"
				startIcon={<CloudUploadIcon />}
				onClick={() => setOpen(true)}
				sx={{
					backgroundColor: "#b71c1c",
					color: "white",
					fontSize: "16px",
					padding: "10px 20px",
					"&:hover": { backgroundColor: "#9a1313" },
				}}
			>
				Chest X-Ray Analysis
			</Button>

			{/* Upload Form Modal */}
			<Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
				<DialogContent>
					<UploadForm />
					<Button
						onClick={() => setOpen(false)}
						sx={{
							position: "absolute",
							top: "10px",
							right: "30px",
							backgroundColor: "#b71c1c",
							color: "white",
							"&:hover": { backgroundColor: "#9a1313" },
						}}
					>
						Close
					</Button>

				</DialogContent>
			</Dialog>
		</div>
	);
};

export default App;
