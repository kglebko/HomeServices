import { StyleSheet } from "react-native";

export const LoginAccount = StyleSheet.create({
  
  
  title: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "Actay-Bold",
    textAlign: "left",
    marginTop:160,
    marginBottom: 8,
  },
  subtitle: {
    color: "#D64105",
    fontSize: 18,
    fontFamily: "Actay-Bold",
    textAlign: "center",
    marginBottom: 40,
  },
  inputsContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 0,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay-Bold",
    marginBottom: 0,
  },
   toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    
    backgroundColor: "rgba(214, 65, 5, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(214, 65, 5, 0.3)",
  },
  toggleButtonText: {
    color: "#D64105",
    fontSize: 12,
    fontFamily: "Actay-Bold",
    marginLeft: 4,
  },
  inputWrapper: {
    position: "relative",
    marginTop:8,
  },
  input: {
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#000000ff",
    fontSize: 16,
    fontFamily: "Actay",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingRight: 50,
  },
  inputIconContainer: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  hintText: {
    color: "#999",
    fontSize: 12,
    fontFamily: "Actay",
    marginTop: 6,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D64105",
    backgroundColor: "#1E1E1E",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#D64105",
  },
  rememberText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay",
    marginTop:3,
  },
  forgotPasswordText: {
    color: "#D64105",
    fontSize: 14,
    fontFamily: "Actay-Bold",
    marginTop:3,
  },
  loginButton: {
    backgroundColor: "#D64105",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.6,
  },
  loginButtonLoading: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  registerText: {
    color: "#999",
    fontSize: 16,
    fontFamily: "Actay",
    marginRight: 8,
  },
  registerLink: {
    color: "#D64105",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    textDecorationLine: "underline",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    color: "#4CAF50",
    fontSize: 12,
    fontFamily: "Actay",
    marginLeft: 8,
    marginTop:4,
  },
});