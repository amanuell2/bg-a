import axios from "axios";
// import _ from "lodash";

export const config = {
  baseURL: "http://34.165.109.155:8000", // GCP
  // baseURL: "http://localhost:8000", // local WSL
  
  baseMiscURL: "http://34.165.109.155:8001", // GCP
  // baseMiscURL: "http://localhost:8001", // local WSL
};

export const http = axios.create({
  baseURL: config.baseURL,
});

export const miscServer = axios.create({
  baseURL: config.baseMiscURL, // local WSL
});

// export const ROLES = {
//   ADMIN: 1,
//   DISPATCHER: 2,
//   FINANCE: 3,
//   CORPORATE: 4,
//   OPERATION: 7, 

//   resolveName(roleNumber) {
//     return _.findKey(this, x => x === roleNumber);
//   },
// };

// export const homepages = role => {
//   switch (role) {
//     case 1:
//       return "/dashboard";
//     case 2:
//       return "/manual-trip-booking";
//     case 3:
//       return "/finance";
//     case 4:
//       return "/corporate/dashboard";
//     default:
//       return "/dashboard";
//   }
// };
