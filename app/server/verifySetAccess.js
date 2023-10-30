function verifySetAccess(vfc_set_access) {
    try {
        if (vfc_set_access === undefined) throw "Missing argument."

        const getAccess = vfc_set_access.toLowerCase();
        console.log("Inside verifySetAccess: " + getAccess);
        const argLength = getAccess.length;

        if (argLength < 6 || argLength > 7 || (argLength === 7 && getAccess !== "private") || (argLength === 6 && getAccess !== "public")) {
            throw "Invalid access type.";
        }
        return getAccess;
    } catch (error) {
        return "Error - " + error;
    }
};

module.exports = verifySetAccess;