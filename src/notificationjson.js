export const Notifications = [
    {
        "index": '11',
        "title": "Order Notifications",
        "apiFieldName":"orderNotifications",
        "sections": [
            {
                "label": "Adding new order but not processing",
                "action": "addingNewOrderPending"
            },
            {
                "label": "Adding new order and processing also",
                "action": "addingNewOrderActive"
            },
            {
                "label": "Marking order paid",
                "action": "makingOrderPaid"
            },
            {
                "label": "Updating order but not processing",
                "action": "updateOrderPending"
            },
            {
                "label": "Updating order and processing also",
                "action": "updateOrderActive"
            },
            {
                "label": "Archiving order",
                "action": "archivinOrder"
            }
        ]
    },
    {
        "index": '12',
        "title": "Claims Notifications",
        "apiFieldName":"claimNotification",
        "sections": [
            {
                "label": "Claim list - servicer update",
                "action": "servicerUpdate1",

            },  
            {
                "label": "File new single claim",
                "action": "newClaim",

            },
            {
                "label": "File bulk claim",
                "action": "fileBulkClaim",

            },
           
            {
                "label": "Claim list - Customer status update",
                "action": "customerStatusUpdate",

            },
            {
                "label": "Claim list - Claim status update",
                "action": "claimStatusUpdate",

            },
            {
                "label": "Claim list - Repair status update",
                "action": "repairStatusUpdate",

            },
            {
                "label": "Repair Parts/ Labor Update",
                "action": "partsUpdate",

            },
            {
                "label": "Claim comments",
                "action": "claimComment",

            }
        ]
    },
    {
        "index": '13',
        "title": "Admin Actions Notifications",
        "apiFieldName":"adminNotification",
        "sections": [
            {
                "label": "New admin user created",
                "action": "userAdded",

            },
            {
                "label": "Pricebook category added",
                "action": "categoryAdded",

            },
            {
                "label": "Pricebook category updated",
                "action": "categoryUpdate",

            },
            {
                "label": "Company pricebook added",
                "action": "priceBookAdd",

            },
            {
                "label": "Company pricebook updated",
                "action": "priceBookUpdate",

            },
            {
                "label": "Assign dealer of the servicer",
                "action": "assignDealerServicer",

            },
            {
                "label": "Unassign servicer for the dealer",
                "action": "unassignDealerServicer",

            }
        ]
    },
    {
        "index": '14',
        "title": "Servicer Notifications",
        "apiFieldName":"servicerNotification",
        "sections": [
            {
                "label": "New servicer added",
                "action": "servicerAdded",

            },
            {
                "label": "New user added",
                "action": "userAdded",

            },
            // {
            //     "label": "Status Changed",
            //     "action": "statusChanged",

            // },
            {
                "label": "Details updated",
                "action": "userUpdate",

            },
            {
                "label": "Primary user changed",
                "action": "primaryChanged",

            },
            // {
            //     "label": "User Status Changed",
            //     "action": "userStatusChanged",

            // },
            {
                "label": "User deleted",
                "action": "userDelete",

            }
        ]
    },

    {
        "index": '15',
        "title": "Dealer Notifications",
        "apiFieldName":"dealerNotifications",
        "sections": [
            {
                "label": "New dealer added",

                "action": "dealerAdded"
            },
            {
                "label": "New user added",

                "action": "userAdded"
            },
            // {
            //     "label": "Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "Details updated",

                "action": "userUpdate"
            },
            {
                "label": "Primary user changed",

                "action": "primaryChanged"
            },
            // {
            //     "label": "User Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "User deleted",

                "action": "userDelete"
            },
            {
                "label": "Dealer price book uploaded (bulk)",

                "action": "dealerPriceBookUpload"
            },
            {
                "label": "Single dealer book added",

                "action": "dealerPriceBookAdd"
            },
            {
                "label": "Single dealer book updated",

                "action": "dealerPriceBookUpdate"
            },
            // {
            //     "label": "Single Dealer Book Status Change",

            //     "action": "pricebookCategoryStatusChange"
            // }
        ]
    },
    {
        "index": '16',
        "title": "Reseller Notifications",
        "apiFieldName":"resellerNotifications",

        "sections": [
            {
                "label": "New reseller added",

                "action": "resellerAdded"
            },
            {
                "label": "New user added",

                "action": "userAdd"
            },
            // {
            //     "label": "Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "Details updated",

                "action": "userUpdate"
            },
            {
                "label": "Primary user changed",

                "action": "primaryChange"
            },
            // {
            //     "label": "User Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "User deleted",

                "action": "userDelete"
            }
        ]
    },
    {
        "index": '17',
        "title": "Customer Notifications",
        "apiFieldName":"customerNotifications",
        "sections": [
            {
                "label": "New customer added",

                "action": "customerAdded"
            },
            {
                "label": "New user added",

                "action": "userAdd"
            },
            // {
            //     "label": "Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "Details updated",

                "action": "userUpdate"
            },
            {
                "label": "Primary user changed",

                "action": "primaryChange"
            },
            // {
            //     "label": "User Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "User deleted",

                "action": "userDelete"
            }
        ]
    },
    {
        "index": '18',
        "title": "Register Requests",
        "apiFieldName":"registerNotifications",
        "sections": [
            {
                "label": "New dealer registration requests",

                "action": "dealerRegistrationRequest"

            },
            {
                "label": "New servicer registration requests",

                "action": "servicerRegistrationRequest"

            },
            {
                "label": "Dealer disapproved",

                "action": "dealerDisapproved"
            },
            {
                "label": "Servicer disapproved",

                "action": "servicerDisapproved"
            },
            {
                "label": "Contact form from B2C Portal",

                "action": "ContactFormFromB2CPortal"
            }
        ]
    }

]
