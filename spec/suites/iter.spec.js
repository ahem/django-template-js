var extend = require('../../lib/utils/base').extend;
extend(GLOBAL, require('../../lib/utils/iter'));

/*

describe('reduce');

    it('should work like regular reduce', function () {
        var list = [];
        //for (var i = 0; i < 400000; i++) { list.push(i); }
        for (var i = 0; i < 1000; i++) { list.push(i); }

        runs(function () {
            reduce(list, function (p, c, idx, list, callback) { callback(false, p + c); }, 0,
                function (error, actual) {
                    assertEquals(expected, actual, complete);
                    end_async_test(complete);
                }
            );
        });

    });

    test_async('should work like regular reduce', function (context, complete) {
        var list = [];
        //for (var i = 0; i < 400000; i++) {
        for (var i = 0; i < 1000; i++) {
            list.push(i);
        }

        //var t = new Date();
        var expected = list.reduce(function (p, c) { return p + c; }, 0);

        reduce(list, function (p, c, idx, list, callback) { callback(false, p + c); }, 0,
            function (error, actual) {
                assertEquals(expected, actual, complete);
                end_async_test(complete);
            }
        );
    });

    test_async('should handle thrown error in iterfunction', function (context, complete) {
        var list = [];
        for (var i = 0; i < 100; i++) {
            list.push(i);
        }

        var been_here = false;

        reduce(list, function (p, c, idx, list, callback) { return undefined.will.raise.exception; }, 0,
            function (error, actual) {
                assertIsFalse(been_here);
                been_here = true;
                assertIsTrue(error, complete);
                end_async_test(complete);
            }
        );
    });

    test_async('should handle error returned with callback from iterfunction', function (context, complete) {
        var list = [];
        for (var i = 0; i < 100; i++) {
            list.push(i);
        }

        var been_here = false;

        reduce(list, function (p, c, idx, list, callback) { callback('raised error'); }, 0,
            function (error, actual) {
                assertIsFalse(been_here, complete);
                been_here = true;
                assertIsTrue(error, complete);
                end_async_test(complete);
            }
        );
    });

run();

*/

