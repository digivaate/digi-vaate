
const comaToPeriod = (number) => {
    const string = number.toString();
    if (string.includes(',')) {
        return parseFloat( string.replace(',', '.') );
    }
    return number;
};

export { comaToPeriod };
