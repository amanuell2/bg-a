import Vue from "vue";
import VueRouter from "vue-router";
// import { ROLES } from "../config";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "root" */ "../views/Root.vue"),
    children: [
      {
        path: "/",
        redirect: "dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
        },
      },
      {
        path: "accounts",
        component: () =>
          import(
            /* webpackChunkName: "accounts" */ "../views/Accounts/Accounts.vue"
          ),
        children: [
          {
            path: "/",
            name: "Users",
            component: () =>
              import(
                /* webpackChunkName: "accounts-index" */ "../views/Accounts/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: "add",
            name: "Add User",
            component: () =>
              import(
                /* webpackChunkName: "account-add" */ "../views/Accounts/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: ":id/edit",
            name: "Edit User",
            component: () =>
              import(
                /* webpackChunkName: "accounts-edit" */ "../views/Accounts/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: ":id/reset-password",
            name: "Reset User Password",
            component: () =>
              import(
                /* webpackChunkName: "accounts-edit" */ "../views/Accounts/ResetPassword.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN],
        },
      },
      {
        path: "passengers",
        component: () =>
          import(/* webpackChunkName: "passengers" */ "../views/Riders/Riders.vue"),
        children: [
          {
            path: "/",
            name: "Passengers",
            component: () =>
              import(
                /* webpackChunkName: "passengers-index" */ "../views/Riders/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add Passenger",
            component: () =>
              import(
                /* webpackChunkName: "passengers-add" */ "../views/Riders/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/edit",
            name: "Edit Passenger",
            component: () =>
              import(
                /* webpackChunkName: "passengers-add" */ "../views/Riders/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "finance",
        component: () =>
          import(
            /* webpackChunkName: "finance" */ "../views/Finance/Finance.vue"
          ),
        children: [
          {
            path: "/",
            name: "Finance",
            component: () =>
              import(
                /* webpackChunkName: "finance-index" */ "../views/Finance/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "show financal detail for trip",
            component: () =>
              import(
                /* webpackChunkName: "finance-show" */ "../views/Finance/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "logs",
        component: () =>
          import(/* webpackChunkName: "logs" */ "../views/Logs/Logs.vue"),
        children: [
          {
            path: "/",
            name: "Logs",
            component: () =>
              import(
                /* webpackChunkName: "logs-index" */ "../views/Logs/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "drivers",
        component: () =>
          import(
            /* webpackChunkName: "dirvers" */ "../views/Drivers/Drivers.vue"
          ),
        children: [
          {
            path: "/",
            name: "Drivers",
            component: () =>
              import(
                /* webpackChunkName: "drivers-index" */ "../views/Drivers/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add Driver",
            component: () =>
              import(
                /* webpackChunkName: "drivers-add" */ "../views/Drivers/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/edit",
            name: "Edit Driver",
            component: () =>
              import(
                /* webpackChunkName: "drivers-edit" */ "../views/Drivers/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "rents",
        component: () =>
          import(/* webpackChunkName: "rents" */ "../views/Rents/Rents.vue"),
        children: [
          {
            path: "/",
            name: "Rents",
            component: () =>
              import(
                /* webpackChunkName: "rents-index" */ "../views/Rents/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "show rent",
            component: () =>
              import(
                /* webpackChunkName: "rents-show" */ "../views/Rents/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "rides",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/Rides/Rides.vue"),
        children: [
          {
            path: "/",
            name: "Trips",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/Rides/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "show trip",
            component: () =>
              import(
                /* webpackChunkName: "trip-show" */ "../views/Rides/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "trip-searches",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/TripSearch/TripSearch.vue"),
        children: [
          {
            path: "/",
            name: "Trip Searches",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/TripSearch/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "show trip search",
            component: () =>
              import(
                /* webpackChunkName: "trip-show" */ "../views/TripSearch/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "trip-requests",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/TripRequest/TripRequest.vue"),
        children: [
          {
            path: "/",
            name: "Trip Requests",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/TripRequest/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "show trip",
            component: () =>
              import(
                /* webpackChunkName: "trip-show" */ "../views/Rides/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "rewards",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/Rewards/Rewards.vue"),
        children: [
          {
            path: "/",
            name: "Rewards",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/Rewards/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "Reward Details",
            component: () =>
              import(
                /* webpackChunkName: "trip-show" */ "../views/Rewards/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE],
            },
          },
        ],
      },
      {
        path: "promos",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/Promo/Promo.vue"),
        children: [
          {
            path: "/",
            name: "Promo History",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/Promo/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "Promo Details",
            component: () =>
              import(
                /* webpackChunkName: "trip-show" */ "../views/Promo/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "mock-reports",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/MockReports/MockReports.vue"),
        children: [
          {
            path: "/",
            name: "MockReports History",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/MockReports/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "rewards-inventory",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/RewardsInventory/RewardsInventory.vue"),
        children: [
          {
            path: "/",
            name: "Rewards Inventory",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/RewardsInventory/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: "add",
            name: "Add Prize",
            component: () =>
              import(
                /* webpackChunkName: "drivers-add" */ "../views/RewardsInventory/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: ":id/edit",
            name: "Edit Prize",
            component: () =>
              import(
                /* webpackChunkName: "drivers-edit" */ "../views/RewardsInventory/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "reward-packages",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/RewardPackages/RewardPackages.vue"),
        children: [
          {
            path: "/",
            name: "Reward Packages",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/RewardPackages/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: "add",
            name: "Add Reward Package",
            component: () =>
              import(
                /* webpackChunkName: "drivers-add" */ "../views/RewardPackages/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: ":id/edit",
            name: "Edit Reward Package",
            component: () =>
              import(
                /* webpackChunkName: "drivers-edit" */ "../views/RewardPackages/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "device-bans",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/DeviceBan/DeviceBan.vue"),
        children: [
          {
            path: "/",
            name: "DeviceBans",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/DeviceBan/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add DeviceBan",
            component: () =>
              import(
                /* webpackChunkName: "account-add" */ "../views/DeviceBan/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
          {
            path: ":id/edit",
            name: "Edit DeviceBan",
            component: () =>
              import(
                "../views/DeviceBan/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "device-bans",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/DeviceBan/DeviceBan.vue"),
        children: [
          {
            path: "/",
            name: "DeviceBans",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/DeviceBan/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add DeviceBan",
            component: () =>
              import(
                /* webpackChunkName: "account-add" */ "../views/DeviceBan/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
          {
            path: ":id/edit",
            name: "Edit DeviceBan",
            component: () =>
              import(
                "../views/DeviceBan/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "driver-bans",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/DriverBan/DriverBan.vue"),
        children: [
          {
            path: "/",
            name: "DriverBans",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/DriverBan/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add DriverBan",
            component: () =>
              import(
                /* webpackChunkName: "account-add" */ "../views/DriverBan/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
          {
            path: ":id/edit",
            name: "Edit DriverBan",
            component: () =>
              import(
                "../views/DriverBan/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "activity-logs",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/ActivityLog/ActivityLog.vue"),
        children: [
          {
            path: "/",
            name: "ActivityLogs",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/ActivityLog/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "driver-leaderboard",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/DriverLeaderboard/DriverLeaderboard.vue"),
        children: [
          {
            path: "/",
            name: "Driver-Leaderboard",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/DriverLeaderboard/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "passenger-leaderboard",
        component: () =>
          import(/* webpackChunkName: "rides" */ "../views/PassengerLeaderboard/PassengerLeaderboard.vue"),
        children: [
          {
            path: "/",
            name: "Passenger-Leaderboard",
            component: () =>
              import(
                /* webpackChunkName: "rides-index" */ "../views/PassengerLeaderboard/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "push-notification",
        name: "Push Notification",
        component: () =>
          import(
            /* webpackChunkName: "push-notification" */ "../views/PushNotification/PushNotification.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
        },
      },
      {
        path: "setting",
        name: "Site settings",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/Setting/Setting.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN],
        },
      },
      {
        path: "setting-new",
        name: "Site settings (new)",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/Setting/NewSetting.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN],
        },
      },
      {
        path: "manual-trip-booking",
        name: "Manual Ride Booking",
        component: () =>
          import(
            /* webpackChunkName: "manual-trip-booking" */ "../views/ManualRideBooking/Index.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
      {
        path: "wallet-managment",
        name: "Wallet managment",
        component: () =>
          import(
            /* webpackChunkName: "wallet-managment" */ "../views/WalletManagment/WalletManagement.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.FINANCE, ROLES.OPERATION],
        },
        children: [
          {
            path: "/",
            name: "Transactions",
            component: () =>
              import(
                /* webpackChunkName: "drivers-index" */ "../views/WalletManagment/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.FINANCE, ROLES.OPERATION],
            },
          },
          {
            path: ":id/show",
            name: "Bank deposit detail",
            component: () =>
              import(
                /* webpackChunkName: "finance-show" */ "../views/WalletManagment/Show.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },

        ]
      },
      {
        path: "/localizations",
        component: () =>
          import(/* webpackChunkName: "localizations" */ "../views/Localization/Index.vue"),
        children: [
          {
            path: "/",
            name: "Localizations Index",
            component: () =>
              import(
                /* webpackChunkName: "corporate-index" */ "../views/Localization/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE],
            },
          },
          {
            path: "driver",
            name: "driver",
            component: () =>
              import(
                /* webpackChunkName: "driver" */ "../views/Localization/Driver.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: "passenger",
            name: "passenger",
            component: () =>
              import(
                /* webpackChunkName: "driver" */ "../views/Localization/Passenger.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "incentives",
        name: "Incentives",
        component: () =>
          import(
            "../views/Incentives/Incentives.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
        },
        children: [
          {
            path: "/",
            name: "Incentives List",
            component: () =>
              import(
                "../views/Incentives/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
            },
          },

        ]
      },
      {
        path: "loan-history",
        name: "loan history",
        component: () =>
          import(
            /* webpackChunkName: "loan-history" */ "../views/LoanHistory/Index.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
      {
        path: "vehicle-types",
        component: () =>
          import(
            /* webpackChunkName: "vehicle-types" */ "../views/VehicleTypes/VehicleTypes.vue"
          ),
        children: [
          {
            path: "/",
            name: "Vehicle Type",
            component: () =>
              import(
                /* webpackChunkName: "vehicle-types-index" */ "../views/VehicleTypes/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add Vehicle Type",
            component: () =>
              import(
                /* webpackChunkName: "vehicle-types-add" */ "../views/VehicleTypes/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
          {
            path: ":id/edit",
            name: "Edit Vehicle Type",
            component: () =>
              import(
                /* webpackChunkName: "vehicle-types-edit" */ "../views/VehicleTypes/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "reports",
        component: () =>
          import(
            /* webpackChunkName: "reports" */ "../views/Reports/Reports.vue"
          ),
        children: [
          {
            path: "/",
            name: "Reports",
            component: () =>
              import(
                /* webpackChunkName: "vehicles-index" */ "../views/Reports/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "corporate-reports",
        component: () =>
          import(
            /* webpackChunkName: "reports" */ "../views/CorporateReports/CorporateReports.vue"
          ),
        children: [
          {
            path: "/",
            name: "CorporateReports",
            component: () =>
              import(
                /* webpackChunkName: "vehicles-index" */ "../views/CorporateReports/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "rbac",
        component: () =>
          import(
            /* webpackChunkName: "rbac" */ "../views/RBAC/RBAC.vue"
          ),
        children: [
          {
            path: "/",
            name: "RBAC",
            component: () =>
              import(
                /* webpackChunkName: "rbac-index" */ "../views/RBAC/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "drivers-finance",
        component: () =>
          import(
            /* webpackChunkName: "rbac" */ "../views/DriverFinance/DriverFinance.vue"
          ),
        children: [
          {
            path: "/",
            name: "DriverFinance",
            component: () =>
              import(
                /* webpackChunkName: "rbac-index" */ "../views/DriverFinance/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN],
            },
          },
        ],
      },
      {
        path: "vehicles",
        component: () =>
          import(
            /* webpackChunkName: "vehicles" */ "../views/Vehicles/Vehicles.vue"
          ),
        children: [
          {
            path: "/",
            name: "Vehicles",
            component: () =>
              import(
                /* webpackChunkName: "vehicles-index" */ "../views/Vehicles/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: "add",
            name: "Add Vehicle",
            component: () =>
              import(
                /* webpackChunkName: "vehicles-add" */ "../views/Vehicles/Add.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
          {
            path: ":id/edit",
            name: "Edit Vehicle",
            component: () =>
              import(
                /* webpackChunkName: "vehicles-edit" */ "../views/Vehicles/Edit.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
            },
          },
        ],
      },
      {
        path: "birds-eye-view",
        name: "Bird's-eye View",
        component: () =>
          import(
            /* webpackChunkName: "gods-view" */ "../views/GodsView/Index.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
      {
        path: "sos",
        name: "SOS",
        component: () =>
          import(/* webpackChunkName: "gods-view" */ "../views/SOS/Index.vue"),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
      {
        path: "sos-history",
        name: "SOS History",
        component: () =>
          import(
            /* webpackChunkName: "gods-view" */ "../views/SOSHistory/Index.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
      {
        path: "payment-records",
        name: "Payment records",
        component: () =>
          import(
            /* webpackChunkName: "manual-trip-booking" */ "../views/PaymentRecords/PaymentRecords.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
        },
      },
      {
        path: "reviews-and-ratings",
        name: "Review and rating",
        component: () =>
          import(
            /* webpackChunkName: "manual-trip-booking" */ "../views/ReviewsRating/Rating.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.OPERATION],
        },
      },
      {
        path: "payment-records",
        name: "Payment records",
        component: () =>
          import(
            /* webpackChunkName: "manual-trip-booking" */ "../views/PaymentRecords/PaymentRecords.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.OPERATION],
        },
      },
      {
        path: "drivers/availability/:id",
        name: "Driver Availability",
        component: () =>
          import(
            /* webpackChunkName: "manual-trip-booking" */ "../views/Drivers/Stat.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
      {
        path: "drivers/:id",
        name: "Driver Details",
        component: () =>
          import(
            /* webpackChunkName: "manual-trip-booking" */ "../views/Drivers/Show.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.DISPATCHER, ROLES.OPERATION],
        },
      },
    ],
  },
  {
    path: "/corporate",
    component: () =>
      import(/* webpackChunkName: "corporate" */ "../views/Root.vue"),
    children: [
      {
        path: "add",
        name: "Add Corporate",
        component: () =>
          import(
            /* webpackChunkName: "add-corporate" */ "../views/Corporate/Add.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN],
        },
      },

      {
        path: "/",
        name: "Corporates Index",
        component: () =>
          import(
            /* webpackChunkName: "corporate-index" */ "../views/Corporate/Index.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE],
        },
      },
      {
        path: "dashboard",
        name: "Corporate Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "corporate-dashboard" */ "../views/Corporate/Dashboard.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.CORPORATE],
        },
      },
      {
        path: "tickets",
        name: "tickets",
        component: () =>
          import(
            /* webpackChunkName: "corporate-ticket" */ "../views/Tickets/Tickets.vue"
          ),
        children: [
          {
            path: "/",
            name: "Ticket Index",
            component: () =>
              import(
                /* webpackChunkName: "ticket-index" */ "../views/Tickets/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
        ],
      },
      {
        path: "employees",
        name: "employees",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/Employees/Employees.vue"
          ),
        children: [
          {
            path: "/",
            name: "Employees Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/Employees/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          {
            path: "add",
            name: "Add Employee",
            component: () =>
              import(
                /* webpackChunkName: "add-employee" */ "../views/Employees/AddEmployee.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
        ],
      },
      {
        path: "dispatcher",
        name: "CorporateDispatcher",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/CorporateDispatcher/CorporateDispatcher.vue"
          ),
        children: [
          {
            path: "/",
            name: "CorporateDispatcher Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/CorporateDispatcher/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          
        ],
      },
      {
        path: "trips",
        name: "CorporateTrips",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/CorporateTrips/CorporateTrips.vue"
          ),
        children: [
          {
            path: "/",
            name: "CorporateTrips Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/CorporateTrips/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          
        ],
      },
      {
        path: "scheduled-trips",
        name: "CorporateScheduledTrips",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/CorporateScheduledTrips/CorporateScheduledTrips.vue"
          ),
        children: [
          {
            path: "/",
            name: "CorporateScheduledTrips Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/CorporateScheduledTrips/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          
        ],
      },
      {
        path: "trip-searches",
        name: "CorporateTripSearches",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/CorporateTripSearches/CorporateTripSearches.vue"
          ),
        children: [
          {
            path: "/",
            name: "CorporateTripSearches Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/CorporateTripSearches/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          
        ],
      },
      {
        path: "trip-requests",
        name: "CorporateTripRequests",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/CorporateTripRequests/CorporateTripRequests.vue"
          ),
        children: [
          {
            path: "/",
            name: "CorporateTripRequests Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/CorporateTripRequests/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          
        ],
      },
    ]
  },
  {
    path: "/corporate/:id",
    component: () =>
      import(/* webpackChunkName: "corporate" */ "../views/Root.vue"),
    children: [
      {
        path: "/",
        name: "Corporate Index",
        component: () =>
          import(
            /* webpackChunkName: "corporate-index" */ "../views/Corporate/Index.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.ADMIN, ROLES.FINANCE],
        },
      },
      {
        path: "dashboard",
        name: "Corporate Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "corporate-dashboard" */ "../views/Corporate/Dashboard.vue"
          ),
        meta: {
          requiresAuth: true,
          // allowedRoles: [ROLES.CORPORATE],
        },
      },
      {
        path: "tickets",
        name: "tickets",
        component: () =>
          import(
            /* webpackChunkName: "corporate-ticket" */ "../views/Tickets/Tickets.vue"
          ),
        children: [
          {
            path: "/",
            name: "Ticket Index",
            component: () =>
              import(
                /* webpackChunkName: "ticket-index" */ "../views/Tickets/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
        ],
      },
      {
        path: "employees",
        name: "employees",
        component: () =>
          import(
            /* webpackChunkName: "corporate-employees" */ "../views/Employees/Employees.vue"
          ),
        children: [
          {
            path: "/",
            name: "Employees Index",
            component: () =>
              import(
                /* webpackChunkName: "employees-index" */ "../views/Employees/Index.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
          {
            path: "add",
            name: "Add Employee",
            component: () =>
              import(
                /* webpackChunkName: "add-employee" */ "../views/Employees/AddEmployee.vue"
              ),
            meta: {
              requiresAuth: true,
              // allowedRoles: [ROLES.CORPORATE],
            },
          },
        ],
      },
      
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/role",
    name: "Role",
    component: () => import(/* webpackChunkName: "role" */ "../views/Role.vue"),
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: () =>
      import(
        /* webpackChunkName: "privacy-policy" */ "../views/PrivacyPolicy.vue"
      ),
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: "login" */ "../views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
