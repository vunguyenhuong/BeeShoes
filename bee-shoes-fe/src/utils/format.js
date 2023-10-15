import numeral from "numeral";

export const formatCurrency = (value) => {
  return numeral(value).format("0,0") + " đ";
};

export default formatCurrency;