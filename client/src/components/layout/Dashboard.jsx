import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { Upload, Eye, Trash2, FileUp } from "lucide-react";
import { setStep } from "../../features/auth/authSlice";
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
} from "../../features/dashboard/documentSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { items: documents, loading } = useSelector((state) => state.documents);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Fetch documents on mount
  useEffect(() => {
    if (!token) {
      dispatch(setStep("requestOtp"));
      return;
    }
    dispatch(fetchDocuments());
  }, [token, dispatch]);

  // Filter & Pagination
  const filteredDocs =
    filter === "all"
      ? documents
      : documents.filter((doc) => doc.type === filter);

  const docsPerPage = 5;
  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);
  const paginatedDocs = filteredDocs.slice(
    (page - 1) * docsPerPage,
    page * docsPerPage
  );

  // Handle Upload
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await dispatch(uploadDocument(formData)).unwrap();
      setSnackbar({
        open: true,
        message: "File uploaded successfully!",
        type: "success",
      });
      setOpenModal(false);
      setFile(null);
    } catch {
      setSnackbar({ open: true, message: "Upload failed!", type: "error" });
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await dispatch(deleteDocument(id)).unwrap();
        setSnackbar({
          open: true,
          message: "File deleted successfully!",
          type: "success",
        });
      } catch {
        setSnackbar({ open: true, message: "Delete failed!", type: "error" });
      }
    }
  };

  return (
    <Box className="p-2 md:p-6">
      {/* Header */}
      <Box className="flex justify-between gap-16 items-center mb-6">
        <Typography
          variant="h5"
          sx={{
            fontSize: {
              xs: "1.5rem", // mobile
              md: "1.75rem", // desktop
            },
            fontWeight: "bold",
          }}
        >
          Welcome, {user?.name || "User"}
        </Typography>

        <Button
          variant="contained"
          startIcon={<Upload size={18} />}
          onClick={() => setOpenModal(true)}
          sx={{
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(to right, #2563eb, #1e40af)",
            },
          }}
        >
          Upload Document
        </Button>
      </Box>

      {/* Filters */}
      <Box className="flex items-center gap-4 mb-4">
        <Typography variant="subtitle1" fontWeight="medium">
          Filter by Type:
        </Typography>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="image">Images</MenuItem>
          <MenuItem value="video">Videos</MenuItem>
          <MenuItem value="pdf">PDFs</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      {loading ? (
        <Box className="flex justify-center items-center py-10">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell>
                  <b>File Name</b>
                </TableCell>
                <TableCell>
                  <b>Type</b>
                </TableCell>
                <TableCell>
                  <b>Date Uploaded</b>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc) => (
                  <TableRow key={doc._id} hover>
                    <TableCell>{doc.filename}</TableCell>
                    <TableCell>{doc.type.toUpperCase()}</TableCell>
                    <TableCell>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center", // centers horizontally
                          alignItems: "center",
                          gap: 2, // adds space between icons
                        }}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          <Eye size={18} />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(doc._id)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No documents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Box className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
          shape="rounded"
        />
      </Box>

      {/* Upload Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle className="text-center font-semibold text-lg">
          Upload New Document
        </DialogTitle>
        <DialogContent className="flex flex-col items-center justify-center py-8">
          <Box
            className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FileUp className="text-blue-500 mb-2" size={40} />
            <Typography variant="body2" color="text.secondary">
              {file ? file.name : "Click to select a file"}
            </Typography>
          </Box>

          <input
            id="fileInput"
            type="file"
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!file}
            onClick={handleUpload}
            sx={{
              background: "linear-gradient(to right, #3b82f6, #2563eb)",
              "&:hover": {
                background: "linear-gradient(to right, #2563eb, #1e40af)",
              },
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
