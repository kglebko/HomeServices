import { StyleSheet } from "react-native";

export const AddCardScreenStyles = StyleSheet.create({
 

  inputsContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,  
  },
  
  inputGroup: {
    marginBottom: 20,
  },
  
  inputLabel: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay-Bold",
    marginBottom: 8,
  },
  
  input: {
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#000000ff",
    fontSize: 16,
    fontFamily: "Actay",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  
  inputWithIcon: {
    position: "relative",
  },
  
  inputIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  cvvHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  
  cvvHintText: {
    color: "#666",
    fontSize: 12,
    fontFamily: "Actay",
    marginLeft: 6,
  },
  
  Button: {
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 10,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#D64105",
    shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,  
  },
  ButtonText: {
    color: "#fff",
    fontSize: 20,
     fontFamily: 'Actay',
  },



  
  
  
  addButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.6,
    shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,  
  },
  
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay-Bold",
  },
  
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
     marginTop:25,
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