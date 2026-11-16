import moment from "moment";

export type Meeting = {
  label: string;
  date: string;
};

export const meetings: Meeting[] = Array.from({ length: 16 }).map((_, index) => ({
  label: `Pertemuan ${index + 1}`,
  date: moment("2026-07-19", "YYYY-MM-DD")
    .add(index * 7, "days")
    .format("DD-MM-YYYY"),
}));
