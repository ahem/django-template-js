
exports.extend = function (original, extended){
    for (var key in (extended || {})) { 
        if (extended.hasOwnProperty(key)) {
            original[key] = extended[key];
        }
    }
    return original;
};

