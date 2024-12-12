export const Notifications = [
    {
        "index": '11',
        "title": "Order Notifications",
        "sections": [
            {
                "label": "Adding New Order but not processing",
                "action": "addingNewOrderPending"
            },
            {
                "label": "Adding new Order and processing also",
                "action": "addingNewOrderActive"
            },
            {
                "label": "Marking Order Paid",
                "action": "makingOrderPaid"
            },
            {
                "label": "Updating Order but not processing",
                "action": "updateOrderPending"
            },
            {
                "label": "Updating Order and processing also",
                "action": "updateOrderActive"
            },
            {
                "label": "Archiving Order",
                "action": "archivinOrder"
            }
        ]
    },
    {
        "index": '12',
        "title": "Claims Notifications",
        "sections": [
            {
                "label": "File New Single Claim",
                "action": "newClaim",

            },
            {
                "label": "File Bulk Claim",
                "action": "fileBulkClaimAdmin",

            },
            {
                "label": "Claim List - Servicer Update",
                "action": "servicerUpdate",

            },
            {
                "label": "Claim List - Customer Status Update",
                "action": "customerStatusUpdate",

            },
            {
                "label": "Claim List - Claim Status Update",
                "action": "claimStatusUpdate",

            },
            {
                "label": "Claim List - Repair Status Update",
                "action": "repairStatusUpdate",

            },
            {
                "label": "Repair Parts/ Labor Update",
                "action": "partsUpdate",

            },
            {
                "label": "Claim Comments",
                "action": "claimComment",

            }
        ]
    },
    {
        "index": '13',
        "title": "Admin Actions Notifications",
        "sections": [
            {
                "label": "New Admin User Created",
                "action": "userAdded",

            },
            {
                "label": "Pricebook Category Added",
                "action": "categoryAdded",

            },
            {
                "label": "Pricebook Category Updated",
                "action": "categoryUpdate",

            },
            {
                "label": "Company Pricebook Added",
                "action": "priceBookAdd",

            },
            {
                "label": "Company Pricebook Updated",
                "action": "priceBookUpdate",

            },
            {
                "label": "Assign Dealer of the Servicer",
                "action": "assignDealerServicer",

            },
            {
                "label": "Unassign Servicer for the Dealer",
                "action": "unassignDealerServicer",

            }
        ]
    },
    {
        "index": '14',
        "title": "Servicer Notifications",
        "sections": [
            {
                "label": "New Servicer Added",
                "action": "servicerAdded",

            },
            {
                "label": "New User Added",
                "action": "userAdded",

            },
            // {
            //     "label": "Status Changed",
            //     "action": "statusChanged",

            // },
            {
                "label": "Details Updated",
                "action": "userUpdate",

            },
            {
                "label": "Primary User Changed",
                "action": "primaryChanged",

            },
            // {
            //     "label": "User Status Changed",
            //     "action": "userStatusChanged",

            // },
            {
                "label": "User Deleted",
                "action": "userDelete",

            }
        ]
    },

    {
        "index": '15',
        "title": "Dealer Notifications",
        "sections": [
            {
                "label": "New Dealer Added",

                "action": "dealerAdded"
            },
            {
                "label": "New User Added",

                "action": "userAdded"
            },
            // {
            //     "label": "Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "Details Updated",

                "action": "userUpdate"
            },
            {
                "label": "Primary User Changed",

                "action": "primaryChanged"
            },
            // {
            //     "label": "User Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "User Deleted",

                "action": "userDelete"
            },
            {
                "label": "Dealer Price Book Uploaded (bulk)",

                "action": "dealerPriceBookUpload"
            },
            {
                "label": "Single Dealer Book Added",

                "action": "dealerPriceBookAdd"
            },
            {
                "label": "Single Dealer Book Updated",

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
        "sections": [
            {
                "label": "New Reseller Added",

                "action": "resellerAdded"
            },
            {
                "label": "New User Added",

                "action": "userAdd"
            },
            // {
            //     "label": "Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "Details Updated",

                "action": "userUpdate"
            },
            {
                "label": "Primary User Changed",

                "action": "primaryChange"
            },
            // {
            //     "label": "User Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "User Deleted",

                "action": "userDelete"
            }
        ]
    },
    {
        "index": '17',
        "title": "Customer Notifications",
        "sections": [
            {
                "label": "New Customer Added",

                "action": "customerAdded"
            },
            {
                "label": "New User Added",

                "action": "userAdd"
            },
            // {
            //     "label": "Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "Details Updated",

                "action": "userUpdate"
            },
            {
                "label": "Primary User Changed",

                "action": "primaryChange"
            },
            // {
            //     "label": "User Status Changed",

            //     "action": "pricebookCategoryStatusChange"
            // },
            {
                "label": "User Deleted",

                "action": "userDelete"
            }
        ]
    },
    {
        "index": '18',
        "title": "Register Requests",
        "sections": [
            {
                "label": "New Dealer Registration Requests",

                "action": "dealerRegistrationRequest"

            },
            {
                "label": "New Servicer Registration Requests",

                "action": "servicerRegistrationRequest"

            },
            {
                "label": "Dealer Disapproved",

                "action": "dealerDisapproved"
            },
            {
                "label": "Servicer Disapproved",

                "action": "servicerDisapproved"
            },
            // {
            //     "label": "Contact form from B2C Portal",

            //     "action": "pricebookCategoryStatusChange"
            // }
        ]
    }

]
