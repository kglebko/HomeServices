import { StyleSheet } from "react-native";

export const Registration = StyleSheet.create({
  
  container: {
  
    
    paddingTop: 60,
    
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontFamily: "Actay-Bold",
    textAlign: "left",
  },
  dataCard: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  dataCard2: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingBottom:10,
    paddingTop:15,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
    
  },
  dataLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dataLabel: {
    color: "#D64105",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    marginLeft: 8,
    marginTop:7,
    minWidth: 140,
  },
  dataValue: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Actay",
    flex: 0,
    textAlign: "left",
    lineHeight: 22,
  },
 
  nameFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 15,
    marginTop:-15,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  infoText: {
    color: "#4CAF50",
    fontSize: 14,
    fontFamily: "Actay",
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  contactContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  contactLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Actay-Bold",
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
    marginTop: 0,
    marginBottom: 8,
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
    lineHeight: 16,
     marginTop: 6,
  },
  sendButton: {
    backgroundColor: "#D64105",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 30,
  },
  sendButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.6,
  },
  sendButtonLoading: {
    opacity: 0.8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay-Bold",
  },
  bottomInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  bottomInfoText: {
    color: "#4CAF50",
    fontSize: 12,
    fontFamily: "Actay",
    marginLeft: 8,
    textAlign: "center",
    lineHeight: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
   
   
  },
  backButtonText: {
    color: "#D64105",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    marginLeft: 8,
    textDecorationLine: "underline",
    
  },






  
  
 
  
  passwordContainer: {
    backgroundColor: "#2b2b2b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    marginBottom: 8,
  },
 
  validationIcon: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
 
  optionsContainer: {
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D64105",
    backgroundColor: "#1E1E1E",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#D64105",
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay",
    flex: 1,
    lineHeight: 20,
  },
  termsContainer: {
    flex: 1,
  },
  link: {
    color: "#D64105",
    fontSize: 14,
    fontFamily: "Actay-Bold",
    textDecorationLine: "underline",
  },
  completeButton: {
    backgroundColor: "#D64105",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 25,
  },
  completeButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.6,
  },
  completeButtonLoading: {
    opacity: 0.8,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Actay-Bold",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    paddingHorizontal: 20,
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
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: "Actay",
    marginTop: 6,
    lineHeight: 16,
  },
  passwordSuccess: {
    color: "#4CAF50",
  },
  passwordError: {
    color: "#F44336",
  },
 
  // Стили для модальных окон
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "70%",
    backgroundColor: "#2b2b2b",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Actay-Bold",
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: "70%",
  },
  modalText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay",
    lineHeight: 20,
    marginBottom: 16,
  },
  modalSectionTitle: {
    color: "#D64105",
    fontSize: 16,
    fontFamily: "Actay-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  modalList: {
    marginLeft: 16,
    marginBottom: 12,
  },
  modalListItem: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Actay",
    lineHeight: 20,
    marginBottom: 6,
  },

});