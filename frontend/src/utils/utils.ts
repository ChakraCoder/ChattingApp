import animationData from "@/assets/lottie-json.json";

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};

export const cleanFileName = (fileName: string) => {
  return fileName.replace(/-\d{13}-\d+/, "");
};

