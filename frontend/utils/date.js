import dayjs from "dayjs";

export const dateFormatter = (date) => {
  return dayjs(date).format("YYYY MMMM D ddd hh : mm a");
};
