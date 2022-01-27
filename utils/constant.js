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

export const orderStatus = [
  {
    valueNumber: 1,
    valueName: "orderPlaced",
    label: "Order Placed",
    icon: "description",
  },
  { valueNumber: 2, valueName: "orderPaid", label: "Order Paid", icon: "paid" },
  {
    valueNumber: 3,
    valueName: "orderPrepared",
    label: "Order Prepared",
    icon: "build",
  },
  {
    valueNumber: 4,
    valueName: "orderShipped",
    label: "Order Shipped",
    icon: "local_shipping",
  },
  {
    valueNumber: 5,
    valueName: "orderReceived",
    label: "Order Received",
    icon: "move_to_inbox",
  },
  {
    valueNumber: 6,
    valueName: "orderCancelled",
    label: "Order Cancelled",
    icon: "cancel",
  },
];
