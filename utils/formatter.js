export function MoneyFormat(number) {
  try {
    number = parseFloat(number);
    //return number != null ? number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : null;
    // // debugger;
    return number != undefined
      ? isNaN(number)
        ? "0"
        : number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
      : "0";
  } catch (e) {
    // // debugger
    return "0";
  }
}


export function DateFormat(p_date) {
  if (p_date) {
    let new_date = new Date(p_date);
    let dd = new_date.getDate();
    let mm = new_date.toLocaleString('default', { month: "short" }); //January is 0!
    let yyyy = new_date.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }

    var date_result = dd + '-' + mm + '-' + yyyy;

    if (date_result == '01-01-1900') {
      return '';
    }
    else {
      return dd + '-' + mm + '-' + yyyy;
    }

  }
  else {
    return null;
  }
}
