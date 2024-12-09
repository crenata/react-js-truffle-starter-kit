const InputFormat = (event) => {
    let value = event.target.value;

    let [, sign, integer, decimals] = value.replace(/[^\d.-]/g, "") // invalid characters
        .replace(/(\..*?)\./g, "$1") // multiple dots
        .replace(/(.+)-/g, "$1") // invalid signs
        .match(/^(-?)(.*?)((?:\.\d*)?)$/);

    // don't convert an empty string into a 0,
    // unless there are decimal places following
    if (integer || decimals) integer = +integer;

    return sign + integer + decimals;
};

export default InputFormat;