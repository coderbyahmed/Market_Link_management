const mockSettings = {
  business: {
    stallName: "Green Valley Farm",
    contactPerson: "Demo Farmer",
    contactPhone: "+92 300 1234567",
    contactEmail: "farmer@demo.com",
    businessAddress: "123 Farm Road, Agricultural Zone, Lahore",
  },
  markets: [
    {
      id: "market-1",
      name: "Sunday Farmers Market",
      address: "Main Boulevard, Model Town, Lahore",
      days: ["Saturday", "Sunday"],
      open: "08:00",
      close: "14:00",
      lat: 31.4504,
      lng: 74.2843,
    },
  ],
  operations: {
    days: [
      { day: "Monday", enabled: false, start: "08:00", end: "14:00" },
      { day: "Tuesday", enabled: false, start: "08:00", end: "14:00" },
      { day: "Wednesday", enabled: false, start: "08:00", end: "14:00" },
      { day: "Thursday", enabled: false, start: "08:00", end: "14:00" },
      { day: "Friday", enabled: false, start: "08:00", end: "14:00" },
      { day: "Saturday", enabled: true, start: "08:00", end: "14:00" },
      { day: "Sunday", enabled: true, start: "08:00", end: "14:00" },
    ],
  },
  location: {
    address: "123 Farm Road, Agricultural Zone, Lahore",
    lat: 31.5204,
    lng: 74.3587,
  },
  notifications: {
    newOrder: { email: true, inApp: true },
    orderReady: { email: true, inApp: true },
    review: { email: false, inApp: true },
    stockAlert: { email: true, inApp: true },
    weeklyReport: { email: true, inApp: false },
  },
  security: {
    twoFactor: false,
    sessions: [
      {
        id: "session-1",
        device: "Chrome on Windows",
        location: "Lahore, Pakistan",
        lastActive: "2026-09-25T10:30:00.000Z",
        current: true,
      },
      {
        id: "session-2",
        device: "Mobile App",
        location: "Karachi, Pakistan",
        lastActive: "2026-09-24T15:45:00.000Z",
        current: false,
      },
    ],
  },
};

export default mockSettings;