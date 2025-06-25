export const paymentPlanOptions:any[] = [
  {
      _id: "5",
      name: "1 Months"
  },
  {
      _id: "6",
      name: "2 Months"
  },
  {
      _id: "1",
      name: "3 Months",
      duration: 90
  },
  {
      _id: "2",
      name: "6 Months",
      duration: 180
  },
  {
      _id: "7",
      name: "8 Months"
  },
  {
      _id: "3",
      name: "1 Year",
      duration: 360
  },
  {
      _id: "4",
      name: "Custom Period"
  },

  //********** ID IS Not IN ORDER ************//
];

export const paymentMethodsOptions:any[] = [
  {
      _id: "1",
      name: "Card",
  },
  {
      _id: "2",
      name: "Cash",
  }
];

export const paymentTypeMaster:any[] = [
  {
      _id: "1",
      name: "Customer Payment",
  },
  {
      _id: "2",
      name: "Salary",
  },
  {
      _id: "3",
      name: "Other",
  }
];

export const creditDebitOptions:any[] = [
  {
      _id: "1",
      name: "Credit",
      value: true
  },
  {
      _id: "2",
      name: "Debit",
      value: false
  }
];
export const paymentStatusOptions:any[] = [
  {
      _id: "1",
      name: "Completed",
  },
  {
      _id: "2",
      name: "Pending",
  }
];
export const attendanceStatusOptions:any[] = [
  {
      _id: "1",
      name: "Present",
      value: true
  },
  {
      _id: "2",
      name: "Absent",
      value: false
  }
];

export const paginationRowsPerPageOptions = [15, 25, 50, 100];

export const paymentPlanStatus:any[] = [
  {
    _id: "1",
    name: "No plan",
  },
  {
    _id: "2",
    name: "Payment Due",
  },
  {
    _id: "3",
    name: "Pending",
  },
  {
    _id: "4",
    name: "Expired",
  },
  {
    _id: "5",
    name: "Completed",
  },
  {
    _id: "5",
    name: "In Active",
  },
  {
    _id: "6",
    name: "Paused",
  },
]
