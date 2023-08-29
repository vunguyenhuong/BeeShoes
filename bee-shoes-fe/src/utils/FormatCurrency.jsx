import numeral from "numeral";

const FormatCurrency = ({value}) => {
  // Định dạng số tiền thành tiền tệ Việt Nam (đ)
  return numeral(value).format("0,0") + " đ";
};

export default FormatCurrency;