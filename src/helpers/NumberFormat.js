const NumberFormat = (value) => {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 5
    }).format(value);
};

export default NumberFormat;