export type LocationData = {
  id: string;
  name: string;
  address: string;
  riskScore: number;
  riskLevel: "Low" | "Moderate" | "High";
  summary: string;
  lastUpdated: string;
  contaminants: {
    name: string;
    level: number;
    limit: number;
    unit: string;
  }[];
  sources: string[];
};

export const mockLocations: LocationData[] = [
  {
    id: "1",
    name: "Irvine",
    address: "Irvine, California",
    riskScore: 56,
    riskLevel: "Moderate",
    summary:
      "This location currently has a moderate preliminary risk score based on the available sample data.",
    lastUpdated: "October 2026",
    contaminants: [
      {
        name: "Contaminant A",
        level: 12,
        limit: 10,
        unit: "ppb",
      },
      {
        name: "Contaminant B",
        level: 4,
        limit: 8,
        unit: "ppb",
      },
    ],
    sources: ["Sample Water Dataset", "California Water Resources"],
  },
  {
    id: "2",
    name: "Santa Ana",
    address: "Santa Ana, California",
    riskScore: 89,
    riskLevel: "High",
    summary:
      "This location has a high preliminary risk score based on the available sample data.",
    lastUpdated: "October 2026",
    contaminants: [
      {
        name: "Contaminant A",
        level: 18,
        limit: 10,
        unit: "ppb",
      },
      {
        name: "Contaminant C",
        level: 14,
        limit: 10,
        unit: "ppb",
      },
    ],
    sources: ["Sample Water Dataset", "California Water Resources"],
  },
];

export const defaultLocation = mockLocations[0];
