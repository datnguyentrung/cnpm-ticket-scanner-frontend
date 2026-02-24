import type { Ticket, User } from "@/types/types";

export const currentUser: User = {
  name: "Đạt Jax",
  shift: "Ca 2 (14:00 - 22:00)",
  role: "staff",
};

export const tickets: Ticket[] = [
  {
    id: "t-001",
    code: "VALID123",
    movieTitle: "Dune: Part Two",
    room: "03",
    seats: ["A5", "A6"],
    showtime: "14:00 - 16:30",
    status: "valid",
  },
  {
    id: "t-002",
    code: "USED456",
    movieTitle: "Godzilla x Kong",
    room: "05",
    seats: ["J10", "J11"],
    showtime: "13:30 - 15:15",
    status: "used",
    checkInTime: "13:45",
  },
  {
    id: "t-003",
    code: "INVALID789",
    movieTitle: "Kung Fu Panda 4",
    room: "02",
    seats: ["C3"],
    showtime: "15:00 - 16:45",
    status: "invalid",
  },
  {
    id: "t-004",
    code: "VALID111",
    movieTitle: "Oppenheimer",
    room: "IMAX 01",
    seats: ["G12", "G13", "G14"],
    showtime: "19:00 - 22:00",
    status: "valid",
  },
  {
    id: "t-005",
    code: "USED222",
    movieTitle: "Exhuma",
    room: "04",
    seats: ["K8", "K9"],
    showtime: "16:00 - 18:15",
    status: "used",
    checkInTime: "16:10",
  },
];
