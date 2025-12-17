import { StyleSheet } from "react-native";

export const CodeScreenStyles = StyleSheet.create({
 
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Actay-Bold",
    textAlign: "center",
    marginBottom: 16,
    marginTop:50,
  },
  description: {
    color: "#999",
    fontSize: 16,
    fontFamily: "Actay",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    color: "#fff",
    fontSize: 24,
    fontFamily: "Actay-Bold",
    borderWidth: 1,
    borderColor: "#ffffffff",
  },
  codeInputFilled: {
    borderColor: "#D64105",
    backgroundColor: "rgba(214, 65, 5, 0.1)",
  },
  hintText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Actay",
    textAlign: "center",
    marginBottom: 40,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  timerText: {
    color: "#999",
    fontSize: 14,
    fontFamily: "Actay",
    marginBottom: 8,
  },
  resendText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Actay-Bold",
  },
  resendTextActive: {
    color: "#D64105",
    textDecorationLine: "underline",
  },
  continueButton: {
    backgroundColor: "#444",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonActive: {
    backgroundColor: "#D64105",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Actay",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 50,
    opacity: 0.3,
  },
});