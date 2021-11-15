import replace from "lodash/replace";

export function censorWord(str) {
  return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
}

export function censorEmail(email) {
  var arr = email.split("@");
  return censorWord(arr[0]) + "@" + censorWord(arr[1]);
}

export function getFileExt(imageType) {
  switch (imageType) {
    case "image/jpeg":
      return ".jpeg";
    case "image/png":
      return ".png";
    case "image/jpg":
      return ".jpg";
    case "application/pdf":
      return ".pdf";
    default:
      break;
  }
}

export function getFileNameExt(fileName) {
  return fileName.split(".").pop();
}

export function getRangeByTotalPage(page, rowsPerPage, total) {
  const lastPage =
    page >= Math.ceil(total / rowsPerPage) - 1
      ? total
      : page * rowsPerPage + rowsPerPage;

  const currentPage = page * rowsPerPage + 1;

  return `${currentPage}-${lastPage} of ${total}`;
}

export function changeBytes(bytes) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let l = 0,
    n = parseInt(bytes, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

export function replaceStringAll(content, oldContent, newContent) {
  return replace(content, new RegExp(oldContent, "g"), newContent);
}

export function trimStringArrayObject(data, fields) {
  var newData = data.map((o) =>
    fields.reduce(
      (acc, field) =>
        Object.assign(acc, {
          [field]:
            typeof acc[field] === "string" || acc[field] instanceof String
              ? acc[field].trim()
              : acc[field],
        }),
      o
    )
  );
  return newData;
}

export function trimString(value) {
  if (typeof value === "string" || value instanceof String) {
    return value.trim();
  } else return value;
}
