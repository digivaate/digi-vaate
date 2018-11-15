
const normalizeString = (name) => {

    return name
        .toLowerCase()
        .trim()
        .replace(/ /g, '')
        .replace(/_/g, '')
        .replace(/-/g, '');
};

module.exports = normalizeString;
