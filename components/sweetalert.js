import Swal from "sweetalert2";

const Sweetalert2Question = ({
  title = "title",
  text = "text",
  icon = "warning",
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#696cff",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  });
};

export { Sweetalert2Question };
