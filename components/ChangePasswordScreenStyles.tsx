import { StyleSheet } from "react-native";

export const ChangePasswordScreenStyles = StyleSheet.create({
 
container:{
   marginTop:90,
},

  description: {
    color: "#999",
    fontSize: 16,
    fontFamily: "Actay",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  inputsContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay-Bold",
    marginBottom: 8,
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordInput: {
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
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 10,
    padding: 4,
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: "Actay",
    marginTop: 6,
    marginLeft: 4,
  },
  passwordError: {
    color: "#FF5252",
  },
  passwordSuccess: {
    color: "#4CAF50",
  },
  forgotPasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    paddingVertical: 5,
  },
  forgotPasswordText: {
    color: "#D64105",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    marginLeft: 8,
    marginTop:4,
  },
  changeButton: {
    backgroundColor: "#D64105",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 30,
  },
  changeButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.6,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  securityText: {
    color: "#4CAF50",
    fontSize: 12,
    fontFamily: "Actay",
    marginLeft: 8,
    flex: 1,
    textAlign: "center",
    marginTop:10,
  },

  
});