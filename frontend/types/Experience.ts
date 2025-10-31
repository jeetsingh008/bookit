export type ExperienceType = {
  _id: string;
  name: string;
  description: string;
  location: string;
  images: [string];
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type SlotType = {
  _id: string;
  experience: string; // This will be the ObjectId string
  startTime: string; // ISO date string (e.g., "2025-11-25T10:00:00Z")
  endTime: string; // ISO date string
  totalCapacity: number;
  bookedCount: number;
  isSoldOut: boolean;
  createdAt: string;
  updatedAt: string;
};
