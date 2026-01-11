import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform, Alert } from "react-native";

type VoucherInput = {
  studentName: string;
  registrationNo: string;
  creditHours: number;
  tuition: number;
  admission: number;
  misc: number;
  total: number;
};

export async function generateVoucherPDF(data: VoucherInput) {
  // ❌ BLOCK WEB (Expo Web does not support printing)
  if (Platform.OS === "web") {
    Alert.alert(
      "PDF Not Supported",
      "PDF download works only on Android APK or physical device."
    );
    return;
  }

  const html = `
  <html>
    <head>
      <style>
        body { font-family: Arial; padding: 30px; }
        h1 { text-align: center; }
        .box { border: 2px solid #1e3a8a; padding: 20px; border-radius: 10px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .total { font-weight: bold; color: green; margin-top: 12px; }
      </style>
    </head>
    <body>
      <h1>IQRA UNIVERSITY — Fees Voucher</h1>

      <div class="box">
        <div class="row"><b>Name:</b><span>${data.studentName}</span></div>
        <div class="row"><b>Reg No:</b><span>${data.registrationNo}</span></div>
        <div class="row"><b>Credit Hours:</b><span>${data.creditHours}</span></div>

        <hr />

        <div class="row"><span>Tuition Fee:</span><span>${data.tuition}</span></div>
        <div class="row"><span>Admission Fee:</span><span>${data.admission}</span></div>
        <div class="row"><span>Misc Charges:</span><span>${data.misc}</span></div>

        <div class="row total">
          <span>Total Payable:</span>
          <span>${data.total}</span>
        </div>
      </div>
    </body>
  </html>
  `;

  try {
    const result = await Print.printToFileAsync({ html });

    if (!result || !result.uri) {
      throw new Error("PDF generation failed");
    }

    await Sharing.shareAsync(result.uri);
  } catch (err) {
    Alert.alert("Error", "Failed to generate PDF.");
    console.error(err);
  }
}
