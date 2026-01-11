import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculateFees } from "../utils/feeCalculator";

type Props = {
  visible: boolean;
  onClose: () => void;
  studentName: string;
  registrationNo: string;
  creditHours: number;
};

export default function FeesVoucherModal({
  visible,
  onClose,
  studentName,
  registrationNo,
  creditHours,
}: Props) {
  const fees = calculateFees(creditHours);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* ❌ Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* HEADER */}
            <Text style={styles.university}>IQRA UNIVERSITY</Text>
            <Text style={styles.subTitle}>Main Campus</Text>
            <Text style={styles.voucherTitle}>Student Fee Voucher</Text>

            {/* STUDENT DETAILS */}
            <Section title="Student Detail">
              <Row label="Student Name" value={studentName} />
              <Row label="Registration No" value={registrationNo} />
              <Row label="Degree" value="BS (SE)" />
              <Row label="Semester" value="Fall 2025" />
            </Section>

            {/* REGISTRATION DETAILS */}
            <Section title="Registration Detail">
              <Row label="Credit Hours" value={`${creditHours}`} />
              <Row label="Courses" value={`${Math.ceil(creditHours / 3)}`} />
            </Section>

            {/* FEES */}
            <Section title="Fees Detail">
              <Row label="Tuition Fee" value={`Rs. ${fees.tuitionFee.toLocaleString()}`} />
              <Row label="Registration Fee" value={`Rs. ${fees.registrationFee.toLocaleString()}`} />
              <Row label="Misc Fee" value={`Rs. ${fees.miscFee.toLocaleString()}`} />
            </Section>

            {/* TOTAL */}
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
              <Text style={styles.totalValue}>
                Rs. {fees.totalPayable.toLocaleString()}
              </Text>
            </View>

            {/* ACTIONS */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="download-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Download PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="print-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Print</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#053f8b",
    shadowColor: "#053f8b",
    shadowOpacity: 0.6,
    shadowRadius: 18,
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 10,
  },
  university: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subTitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 6,
  },
  voucherTitle: {
    color: "#e5e7eb",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#60a5fa",
    fontWeight: "600",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    color: "#94a3b8",
  },
  value: {
    color: "#e5e7eb",
    fontWeight: "500",
  },
  totalBox: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  totalLabel: {
    color: "#93c5fd",
    textAlign: "center",
  },
  totalValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#053f8b",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
});
