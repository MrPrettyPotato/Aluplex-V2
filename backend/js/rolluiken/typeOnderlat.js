function checkType(lamel) {
    switch (lamel.toLowerCase()) {
        case "alu55":
        case "pvc55":
            return "tradi"
        case "pvc42":
        case "alu42":
        case "ultra42":
        case "ultra52":
            return "mini"
            break;
        default:
            break;
    }
}

module.exports = checkType;