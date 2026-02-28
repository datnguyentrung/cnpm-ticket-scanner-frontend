export const validateTicket = (code: string) => {
  // Kiểm tra định dạng mã QR
  if (code.length !== 13 || !code.includes("-")) {
    return false;
  }

  const qr : string[] = code.split("-");
  if (qr.length !== 3) {
    return false;
  }
  return true;
}
