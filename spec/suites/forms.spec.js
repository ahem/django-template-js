var extend = require('../djangode/utils/base').extend;
var sys = require('sys');
extend(GLOBAL, require('../djangode/utils/test').dsl);
extend(GLOBAL, require('../djangode/forms/forms'));

testcase('tests for Form')
    test('Form should be valid with valid values', function () {

        var ContactForm = Form({
            subject: CharField(),
            email: EmailField({ required: false }),
            message: CharField({ widget: Textarea() })
        });

        var f = ContactForm({
            subject: 'Hello',
            email: 'adrian@example.com',
            message: 'Nice site!'
        });

        assertEquals(true, f.is_valid());
    });

