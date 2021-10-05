import moment from "moment";

export function getAllMonths(past = false) {
  const allMonths = moment.months();
  if (past === true) {
    const thisMonth = new Date().getMonth();
    return allMonths.splice(0, thisMonth + 1);
  } else {
    return allMonths.reduce((temp, value, index) => {
      temp.push({ value: index + 1, name: value });
      return temp;
    }, []);
  }
}
