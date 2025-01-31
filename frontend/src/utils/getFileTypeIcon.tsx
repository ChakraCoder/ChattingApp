import { Music, Video, FileCode } from "lucide-react";
import {
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileCsv,
  FaFileArchive,
  FaFileImage,
  FaFileCode,
} from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";

export const getFileTypeIcon = (fileName: string) => {
  if (!fileName) return <FaFileAlt className="size-7" />;
  const lowerFileName = fileName.toLowerCase();

  // Document files
  if (/\.(pdf)$/.test(lowerFileName))
    return <GrDocumentPdf className="size-7 text-red-500" />;
  if (/\.(doc|docx)$/.test(lowerFileName))
    return <FaFileWord className="size-7 text-blue-500" />;
  if (/\.(xls|xlsx)$/.test(lowerFileName))
    return <FaFileExcel className="size-7 text-green-500" />;
  if (/\.(ppt|pptx)$/.test(lowerFileName))
    return <FaFilePowerpoint className="size-7 text-orange-500" />;
  if (/\.(txt|rtf|md)$/.test(lowerFileName))
    return <FaFileAlt className="size-7 text-gray-500" />;
  if (/\.(csv)$/.test(lowerFileName))
    return <FaFileCsv className="size-7 text-yellow-500" />;

  // Archive files
  if (/\.(zip|rar|7z|tar|gz)$/.test(lowerFileName))
    return <FaFileArchive className="size-7 text-purple-500" />;

  // Media files
  if (/\.(mp4|avi|mov|mkv|webm)$/.test(lowerFileName))
    return <Video className="size-7 text-purple-500" />;
  if (/\.(mp3|wav|ogg|flac)$/.test(lowerFileName))
    return <Music className="size-7 text-purple-500" />;
  if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(lowerFileName))
    return <FaFileImage className="size-7 text-blue-500" />;

  // Code files
  if (/\.(js|ts|jsx|tsx|html|css|scss|json|xml|yml|yaml)$/.test(lowerFileName))
    return <FaFileCode className="size-7 text-green-500" />;
  if (/\.(py|java|cpp|c|cs|go|rb|php|sh|swift|rs)$/.test(lowerFileName))
    return <FileCode className="size-7 text-green-500" />;

  // Default
  return <FaFileAlt className="size-7 text-gray-500" />;
};
