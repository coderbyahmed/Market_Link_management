const mockPickupSettings = {
  cutoff: "18:00",
  slots: [
    {
      id: "slot-1",
      start: "09:00",
      end: "11:00",
      label: "09:00 - 11:00",
      enabled: true,
    },
    {
      id: "slot-2",
      start: "11:00",
      end: "13:00",
      label: "11:00 - 13:00",
      enabled: true,
    },
    {
      id: "slot-3",
      start: "16:00",
      end: "18:00",
      label: "16:00 - 18:00",
      enabled: true,
    },
    {
      id: "slot-4",
      start: "18:00",
      end: "20:00",
      label: "18:00 - 20:00",
      enabled: false,
    },
  ],
};

export default mockPickupSettings;
