/** @format */

const PWD_REGEX = new RegExp(import.meta.env.VITE_PWD_REGEX);
const PHONE_REGEX = new RegExp(import.meta.env.PHONE_REGEX);

// List of errors object
var errors = {};
var error = "";

// LOGIN VALIDATION
export const LoginValidation = (data) => {
  // Set Errors object to empty
  errors = {};

  if (data.email.trim() === "") {
    errors.email = "Email is required";
  }

  if (data.password.trim() === "") {
    errors.password = "Password is required";
  }

  return errors;
};

// FORGET PASSWORD VALIDATION
export const ForgetPasswordValidation = (data) => {
  // Set Errors object to empty
  error = "";

  if (data.trim() === "") {
    error = "Email is required";
  }

  return error;
};

// UPDATE PROFILE VALIDATION
export const UpdateProfileValidation = (data) => {
  const errors = {};

  if (data.address.trim() === "") {
    errors.address = "Address is required";
  }

  if (data.gender.trim() === "") {
    errors.gender = "Gender is required";
  }

  if (data.dob.trim() === "") {
    errors.dob = "Date of Birth is required";
  }

  if (data.phone.trim() === "") {
    errors.phone = "Phone number is required";
  }

  if (data.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }

  if (data.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }

  return errors;
};

// TOURNAMENT MANAGEMENT VALIDATION
export const TournamentManagementValidation = (data) => {
  const errors = {};

  if (data.tournament_name.trim() === "") {
    errors.tournament_name = "Tournament name is required";
  }

  if (data.start_date === "") {
    errors.start_date = "Start date is required";
  }

  if (data.end_date === "") {
    errors.end_date = "End date is required";
  }

  if (data.tournament_context.trim() === "") {
    errors.tournament_context = "Tournament context is required";
  }

  return errors;
};

// ROUND MANAGEMENT VALIDATION
export const RoundManagementValidation = (data) => {
  const errors = {};

  if (data.description.trim() === "") {
    errors.description = "Round description is required";
  }

  if (data.round_name.trim() === "") {
    errors.round_name = "Round name is required";
  }

  if (data.round_duration === 0) {
    errors.round_duration = "Round duration is required";
  }

  if (data.lap_number === 0) {
    errors.lap_number = "Lap number is required";
  }

  if (data.finish_type.trim() === "") {
    errors.finish_type = "Finish type is required";
  }

  if (!data.is_last && data.team_limit === 0) {
    errors.team_limit = "Team limit is required";
  }

  if (data.start_date === "") {
    errors.start_date = "Start date is required";
  }

  if (data.end_date === "") {
    errors.end_date = "End date is required";
  }

  if (data.environment_id === 0) {
    errors.environment_id = "Environment selection is required";
  }

  if (data.match_type_id === 0) {
    errors.match_type_id = "Match type selection is required";
  }

  if (data.resource_id === 0) {
    errors.resource_id = "Map selection is required";
  }

  if (data.lap < 0) {
    errors.lap = "Lap bonus points must be greater than 0";
  }

  if (data.collision > 0) {
    errors.collision = "Collision penalty points must be less than 0";
  }

  if (data.total_race_time > 0) {
    errors.total_race_time =
      "Total race time penalty points must be less than 0";
  }

  if (data.off_track > 0) {
    errors.off_track = "Off track penalty points must be less than 0";
  }

  if (data.assist_usage > 0) {
    errors.assist_usage = "Assist usage penalty points must be less than 0";
  }

  if (data.average_speed < 0) {
    errors.average_speed = "Average speed bonus points must be greater than 0";
  }

  if (data.total_distance < 0) {
    errors.total_distance =
      "Total distance bonus points must be greater than 0";
  }

  return errors;
};

export const ComplaintReplyValidation = (data) => {
  const errors = {};

  if (data.reply.trim() === "") {
    errors.reply = "Reply is required";
  }

  return errors;
};

export const ChangePasswordValidation = (data) => {
  const errors = {};

  if (data.oldPassword.trim() === "") {
    errors.oldPassword = "Old password is required";
  }

  if (data.newPassword.trim() === "") {
    errors.newPassword = "New password is required";
  }

  if (data.confirmPassword.trim() === "") {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.newPassword.trim() !== data.confirmPassword.trim()) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
