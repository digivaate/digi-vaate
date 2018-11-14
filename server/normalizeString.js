
const normalizeString = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(' ', '')
        .replace('_', '')
        .replace('-', '');
};

module.exports = normalizeString;
