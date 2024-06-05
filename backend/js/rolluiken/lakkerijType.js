function checkType(type) {
    switch (type.toLowerCase()) {
        case "voorzetrolluik":
            return "voorzet"
        case "rolluikblad":
        case "tradirolluik":
            return "tradi"
        case "opbouwrolluik":
            return "opbouw"
            case "Screen":
                case "screen":
            return "screen"
        default:
            break;
    }
}

module.exports = checkType;