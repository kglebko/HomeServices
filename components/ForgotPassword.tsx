import { StyleSheet } from "react-native";

export const ForgotPassword = StyleSheet.create({
 
  container:{
   marginTop:90,
},
  description: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    marginBottom: 12,
  },
  inputWrapper: {
    position: "relative",
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
  inputIcon: {
    opacity: 0.8,
  },
  hintText: {
    color: "#999",
    fontSize: 13,
    fontFamily: "Actay",
    marginTop: 12,
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: "#D64105",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.6,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay",
  },
  alternativeButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 30,
  },
  alternativeButtonText: {
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
    backgroundColor: "rgba(214, 65, 5, 0.1)",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(214, 65, 5, 0.3)",
    marginTop:80,
  },
  infoText: {
    color: "#D64105",
    fontSize: 13,
    fontFamily: "Actay",
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
});