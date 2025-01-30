import {
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileCsv,
  FaFileArchive,
} from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";

export const getFileTypeIcon = (fileName: string) => {
  if (!fileName) return <FaFileAlt className="size-7" />;
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.endsWith(".pdf"))
    return <GrDocumentPdf className="size-7 text-red-500" />;
  if (lowerFileName.endsWith(".doc") || lowerFileName.endsWith(".docx"))
    return <FaFileWord className="size-7 text-blue-500" />;
  if (lowerFileName.endsWith(".xls") || lowerFileName.endsWith(".xlsx"))
    return <FaFileExcel className="size-7 text-green-500" />;
  if (lowerFileName.endsWith(".ppt") || lowerFileName.endsWith(".pptx"))
    return <FaFilePowerpoint className="size-7 text-orange-500" />;
  if (lowerFileName.endsWith(".txt") || lowerFileName.endsWith(".rtf"))
    return <FaFileAlt className="size-7 text-gray-500" />;
  if (lowerFileName.endsWith(".csv"))
    return <FaFileCsv className="size-7 text-yellow-500" />;
  if (lowerFileName.endsWith(".zip") || lowerFileName.endsWith(".rar"))
    return <FaFileArchive className="size-7 text-purple-500" />;

  return <FaFileAlt className="size-7 text-gray-500" />;
};
