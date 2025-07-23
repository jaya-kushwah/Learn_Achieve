import * as yup from "yup";

//Login Schema
export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .matches(/(?=.*[A-Za-z])(?=.*\d)/, "Must contain letters and numbers"),
});

//Forgot Password Schema
export const forgetPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

// Question Add Schema
export const questionValidationSchema = yup.object().shape({
  class: yup.string().required("Class is required"),
  subject: yup.string().required("Subject is required"),
  medium: yup.string().required("Medium is required"),
  // module: yup.string().required("Module is required"),
  // typeOfQuestion: yup.string().required("Type of Question is required"),
  // topicName: yup.string().required("Topic Name is required"),
  // questionText: yup.string().required("Question Text is required"),
});

//Mocck addd schemaa
export const mockTestValidationSchema = yup.object().shape({
  mockTestName: yup.string().required("Mock Test Name is required"),
  medium: yup.string().required("Medium is required"),
  class: yup.string().required("Class is required"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .positive("Duration must be positive")
    .integer("Duration must be an integer")
    .required("Duration is required"),
  subjects: yup
    .array()
    .of(
      yup.object().shape({
        subject: yup.string().required("Subject is required"),
        questions: yup
          .number()
          .typeError("Questions must be a number")
          .positive("Questions must be positive")
          .integer("Questions must be an integer")
          .required("Number of questions is required"),
      })
    )
    .min(1, "At least one subject is required"),
  parentQuestion: yup
    .string()
    .required("Parent Question is required")
    .test(
      "not-empty",
      "Parent Question cannot be empty",
      (value) => value?.replace(/<(.|\n)*?>/g, "").trim().length > 0
    ),
});

export const registrationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string(),
  lastName: yup.string().required("Last name is required"),
  dob: yup.date().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  schoolName: yup.string().required("School name is required"),
  medium: yup.string().required("Medium is required"),
  class: yup.string().required("Class is required"),
  registerBy: yup.string().required("Register by is required"),
  uniqueCode: yup.string().when("registerBy", {
    is: "Coordinator",
    then: (schema) => schema.required("Unique code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  addressLine2: yup.string(),
  state: yup.string().required("State is required"),
  district: yup.string().when("state", {
    is: (val) => val === "" || val === "Madhya Pradesh",
    then: (schema) => schema.required("District is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  taluka: yup.string().when("state", {
    is: (val) => val === "" || val === "Madhya Pradesh",
    then: (schema) => schema.required("Taluka is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  pinCode: yup.string().when("state", {
    is: (val) => val === "" || val === "Madhya Pradesh",
    then: (schema) => schema.required("Pin Code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});