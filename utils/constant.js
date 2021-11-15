export const pageData = {
  mainTitle: "Gladax Admin",
};

export const fileTypeIcon = (type) => {
  switch (type?.trim()) {
    case "image/jpeg":
      return "image";
    case "image/png":
      return "image";
    case "image/jpg":
      return "image";
    case "application/pdf":
      return "picture_as_pdf";
    default:
      return "insert_drive_file";
  }
};
