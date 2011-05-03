/*jslint laxbreak: true, eqeqeq: true, undef: true, regexp: false */
/*global require, process, exports */

var sys = require('sys');
var string_utils = require('../utils/string');
var html = require('../utils/html');
var iter = require('../utils/iter');
var extend = require('../utils/base').extend;


var Form = function (options) {
    
}


var contact_form = Form({
    subject: Form.CharField(), 
    email: Form.EmailField({required: false}),
    mesage: Form.CharField()
});


var f = contact_form({
});



