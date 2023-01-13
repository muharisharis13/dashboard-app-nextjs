import Cookies from "js-cookie";


class cookie {
  set({
    label,
    value
  }) {
    return Cookies.set(label, value)
  }
  get(label) {
    return Cookies.get(label)
  }
}

export default new cookie();