import Yup from "yup";
export const paginationValidationSchema = Yup.object({
  page: Yup.number()
    .min(1, "Page must be at least 1.")
    .required("Page is required."),
  limit: Yup.number()
    .min(1, "Limit must be at least 1.")
    .required("Limit is required.")
    .max(100, "Limit must be at max 100."),
  searchText: Yup.string().nullable(),
});
