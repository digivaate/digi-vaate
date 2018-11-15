/**
 * Returns a trimmed out version of string
 * @param name
 * @returns {string}
 */
const normalizeString = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/ /g, '')
        .replace(/_/g, '')
        .replace(/-/g, '');
};

module.exports = normalizeString;
