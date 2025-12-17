import { StyleSheet } from "react-native";

export const ProfileScreenStyles = StyleSheet.create({
 

  profileSection: {
    alignItems: "center",
    marginTop: 5,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 15,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontFamily: 'Actay-Bold',
  },
  status: {
    color: "#D64105" ,
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Actay-Bold',
  },
  statusValue: {
    fontSize: 14,
    color: "#D64105",
    fontFamily: 'Actay-Bold',
  },
  email: {
    color: "#fff",
    marginTop: 20,
    fontFamily: 'Actay',
  },
  phone: {
    color: "#fff",
    marginTop: 4,
    fontFamily: 'Actay',
  },




  infoBlock: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    padding: 10,
    marginBottom: -8,
    shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 10 ,// Добавьте отступы сверху и снизу
    borderBottomWidth: 1, // Толщина линии
    borderBottomColor: '#333', // Цвет линии (темно-серый)
    
  },
  infoLastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 10 ,
    
  },

  infoNewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingLeft: 10 ,
  
  },
  infoText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
     fontFamily: 'Actay',
  },
  infoNumber: {
    color: "#fff",
    marginLeft: 10,
  },
  infoAdress: {
    color: "#fff",
    marginLeft: 10,
  },



  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: "#2b2b2b",
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
     fontFamily: 'Actay',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 63,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#2b2b2b", 
    shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3, 
  },
  logoutText: {
    color: "#D64105",
    fontSize: 20,
     fontFamily: 'Actay-Bold',
  },




  Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    width: "95%",
    paddingBottom:5,
  },
  Button: {
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 73,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#fff",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'Actay',
  },

  
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:"#2b2b2b",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
  },
  cardImage: {
    width: 64,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  cardName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: 'Actay',
  },
  cardNumber: {
    marginTop:5,
    color: "#fff",
    fontFamily: 'Actay',
    fontSize: 12,
  },




// Добавьте к существующим стилям:

modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  padding: 20,
},

modalContainer: {
  width: "100%",
  maxWidth: 340,
  height: 250,
  backgroundColor: "#2b2b2b",
  borderRadius: 20,
  padding: 24,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

modalIcon: {
  marginBottom: 16,
},

modalTitle: {
  color: "#fff",
  fontSize: 24,
  fontFamily: "Actay",
  textAlign: "center",
  lineHeight: 30,
  marginBottom: 20,
},

modalButtons: {
  flexDirection: "column",
  
  width: "100%",
  gap: 12,
},

modalButton: {
 
  borderRadius: 12,
  paddingVertical: 20,
  alignItems: "center",
  justifyContent: "center",
},

cancelButton: {
  backgroundColor: "#3A3A3A",
  borderWidth: 1,
  borderColor: "#444",
},

cancelButtonText: {
  color: "#fff",
  fontSize: 16,
  fontFamily: "Actay-Bold",
},

logoutConfirmButton: {
  backgroundColor: "#D64105",
},

logoutConfirmText: {
  color: "#fff",
  fontSize: 16,
  fontFamily: "Actay-Bold",
},












});