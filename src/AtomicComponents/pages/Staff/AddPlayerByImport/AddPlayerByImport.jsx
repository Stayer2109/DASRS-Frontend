import { useState, useRef } from "react";
import Input from "@/AtomicComponents/atoms/Input/Input";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Button } from "@/AtomicComponents/atoms/Button/Button";
import { apiClient } from "@/config/axios/axios";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";

const AddPlayerByImport = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [spreadsheetData, setSpreadsheetData] = useState([]);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInputRef.current.files = e.dataTransfer.files;
      fileInputRef.current.dispatchEvent(
        new Event("change", { bubbles: true })
      );
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "❌ Invalid file type. Please upload .xlsx, .xls, or .csv"
      );
      setSelectedFileName(file.name);
      setSpreadsheetData([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!json || json.length === 0) {
        setErrorMessage("❌ File is empty or unreadable.");
        setSpreadsheetData([]);
        return;
      }

      const filteredRows = json.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== "")
      );

      const formattedData = filteredRows.map((row) =>
        row.map((cell) => ({
          value: String(cell ?? ""),
          readOnly: true,
        }))
      );

      setUploadedFile(file);
      setSpreadsheetData(formattedData);
      setSelectedFileName(file.name);
      setErrorMessage(null);
    };

    reader.readAsArrayBuffer(file);
  };

  // HANDLE SUBMIT FILE TO IMPORT PLAYER
  const handleSubmitFile = async (e) => {
    e.preventDefault();

    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile); // 👈 key should match your backend

    try {
      setIsLoading(true);

      const response = await apiClient.post("accounts/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload success:", response.data);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      Toast({
        type: "error",
        message: error.response.data.message,
        title: "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed p-6 rounded-xl cursor-pointer transition-all ${
            isDragging
              ? "bg-blue-100 border-blue-400"
              : `bg-white ${
                  errorMessage && selectedFileName
                    ? "border-red-400"
                    : "border-gray-300"
                } ${
                  !errorMessage && selectedFileName
                    ? "border-green-400"
                    : "border-gray-300"
                }`
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="text-center">
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {selectedFileName && !errorMessage && (
              <p className="text-sm text-green-600">
                ✅ Selected:{" "}
                <span className="font-medium">{selectedFileName}</span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Drag & drop or click to upload players file
            </p>
            <Input
              accept=".xlsx, .xls, .csv"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {spreadsheetData.length > 0 && (
          <>
            <h1 className="text-center text-h3 italic">
              Preview your data below
            </h1>
            <div className="overflow-auto rounded max-w-dvw md:max-w-[100%] sm:max-w-[100%] w-auto m-auto">
              <div className="w-auto max-h-[450px] flex justify-center items-center">
                <Spreadsheet data={spreadsheetData} className="m-auto" />
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-6">
          <Button
            onClick={handleSubmitFile}
            type="submit"
            content="Import Player"
            disabled={errorMessage || !uploadedFile ? true : false}
            tooltipData={`${
              errorMessage || !uploadedFile
                ? "Check file type and try again."
                : "Click to import player."
            }`}
            toolTipPos="bottom"
          />
        </div>
      </div>
    </>
  );
};

export default AddPlayerByImport;
