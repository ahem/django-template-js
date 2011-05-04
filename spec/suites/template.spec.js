var extend = require('../../lib/utils/base').extend;
extend(GLOBAL, require('../../lib/template/template'));

var LOG = console ? console.log : require('util').debug;

describe('Test tokenizer', function () {

    it('should pass sanity test', function () {
        var tokens = tokenize('Hest');
        expect(tokens).toEqual([ new Token('text', 'Hest')]);
    });
    it('should not output empty tokens between tags', function () {
        var tokens = tokenize('{{tag}}');
        expect(tokens ).toEqual([ new Token('variable', 'tag')]);
    });
    it('should split token contents', function () {
        expect(
            tokenize('  virker det her  ')[0].split_contents()
        ).toEqual(
            ['virker', 'det', 'her']
        );
        expect(
            tokenize('her er "noget der er i qoutes" og noget der ikke er')[0].split_contents()
        ).toEqual(
            ['her', 'er', '"noget der er i qoutes"', 'og', 'noget', 'der', 'ikke', 'er']
        );

        expect( tokenize('date:"F j, Y"')[0].split_contents()).toEqual( ['date:"F j, Y"']);
        expect( tokenize('date: "F j, Y"')[0].split_contents()).toEqual( ['date:', '"F j, Y"']);
    });
});

describe('Filter Expression tests', function () {

    beforeEach(function () {

        function check(obj, actual, safe) {

            if (safe++ > 10) { throw 'no match'; }

            if (obj.length && obj.forEach) {
                obj.forEach(function (x, idx) { check(x, actual[idx], safe); });
            } else if (typeof(obj) === 'string' || typeof(obj) === 'number') {
                if (obj !== actual) { throw 'no match'; }
            } else {
                for (var x in obj) { if (obj.hasOwnProperty(x)) { check(obj[x], actual[x], safe); } }
            }

            safe--;
        }

        this.addMatchers({
            toHaveProperties: function (expected) {
                try { check(expected, this.actual, 0); return true; } catch (x) { return false; }
            }
        });
    });

    it('should parse valid syntax', function () {
        expect( 
            new FilterExpression("item|add")
        ).toHaveProperties(
            { variable: 'item', filter_list: [ { name: 'add' } ] }
        );
        expect(
            new FilterExpression("item.subitem|add|sub")
        ).toHaveProperties(
            { variable: 'item.subitem', filter_list: [ { name: 'add' }, { name: 'sub' } ] }
        );
        expect(
            new FilterExpression('item|add:5|sub:"2"')
        ).toHaveProperties(
            { variable: 'item', filter_list: [ { name: 'add', var_arg: 5 }, { name: 'sub', arg: "2" } ] }
        );
        expect(
            new FilterExpression('item|concat:"heste er naijs"')
        ).toHaveProperties(
            { variable: 'item', filter_list: [ { name: 'concat', arg: 'heste er naijs' } ] }
        );
        expect(
            new FilterExpression('person_name')
        ).toHaveProperties(
            { variable: 'person_name', filter_list: [ ] }
        );
        expect(
            new FilterExpression('335|test')
        ).toHaveProperties(
            { variable: 335, filter_list: [{name: 'test'}] }
        );
        expect(
            new FilterExpression('"hest"|test')
        ).toHaveProperties(
            { constant: "hest", filter_list: [{name: 'test'}] }
        );
        expect(
            new FilterExpression('item|add:other')
        ).toHaveProperties(
            { variable: "item", filter_list: [{name: 'add', var_arg: 'other' }] }
        );
    });

    it('should fail on invalid syntax', function () {

        expect(function () { return new FilterExpression('item| add:2'); }).toThrow();
        expect(function () { return new FilterExpression('item|add :2'); }).toThrow();
        expect(function () { return new FilterExpression('item|add: 2'); }).toThrow();
        expect(function () { return new FilterExpression('item|add|:2|sub'); }).toThrow();
        // TODO: should these fail??
        //expect(function () { return new FilterExpression('item |add:2'); }).toThrow();
        //expect(function () { return new FilterExpression('item|add:2 |sub'); }).toThrow();
    });

    it('output (without filters) should be escaped if autoescaping is on', function () {
        var context = new Context({test: '<script>'});
        context.autoescaping = true;
        var expr = new FilterExpression("test");
        expect( expr.resolve(context)).toBe('&lt;script&gt;');
    });

    it('output (without filters) should not be escaped if autoescaping is off', function () {
        var context = new Context({test: '<script>'});
        context.autoescaping = false;
        var expr = new FilterExpression("test");
        expect( expr.resolve(context)).toBe('<script>');
    });
    it('safe filter should prevent escaping', function () {
        var context = new Context({test: '<script>'});
        context.autoescaping = true;
        var expr = new FilterExpression("test|safe|upper");
        expect( expr.resolve(context)).toBe('<SCRIPT>');
    });
    it('escape filter should force escaping', function () {
        var context = new Context({test: '<script>'});
        context.autoescaping = false;
        var expr = new FilterExpression("test|escape|upper");
        expect( expr.resolve(context)).toBe('&lt;SCRIPT&gt;');
    });
    it('filterexpression should work with variable as arg', function () {
        var context = new Context({test: 4, arg: 38 });
        var expr = new FilterExpression("test|add:arg");
        expect( expr.resolve(context)).toBe(42);
    });
});

describe('Context test', function () {

    var tc;

    beforeEach( function () {
        tc = {
            plain: {
                a: 5,
                b: 'hest',
                c: true,
                d: [ 1, 2, 3, 4 ]
            }
        };

        var clone = JSON.parse( JSON.stringify(tc.plain) );
        tc.context = new Context(clone);

        return tc;
    });

    it('should support get from first level', function () {
        for (x in tc.plain) {
            expect(tc.context.get(x)).toEqual(tc.plain[x]);
        }
    });

    it('should support get string literal', function () {
        expect( tc.context.get('a')).toBe(5);
        expect( tc.context.get("'a'")).toBe('a');
        expect( tc.context.get('"a"')).toBe('a');
    });

    it('should support set', function () {
        tc.context.set('a', tc.plain.a + 100);
        expect( tc.context.get('a')).toBe(tc.plain.a + 100);
    });

    it('ould support push and pop', function () {
        expect( tc.context.get('a')).toBe(tc.plain.a);

        tc.context.push();

        expect( tc.context.get('a')).toBe(tc.plain.a);
        tc.context.set('a', tc.plain.a + 18);
        expect( tc.context.get('a')).toBe(tc.plain.a + 18);

        tc.context.pop();
        expect( tc.context.get('a')).toBe(tc.plain.a);
    });
});

describe('parser', function () {
    it('should pass sanity test for parser', function () {
        var result, done = false;
        runs(function () {
            t = parse('hest');
            t.render({}, function (e, r) { done = true; result = r; });
        });
        waitsFor(function () { return done; }, "render took too long", 1000);
        runs(function () { expect(result).toBe('hest'); });
    });

    it('should only return should return only requested types from node_list.only_types ', function () {
        t = parse('{% comment %}hest{% endcomment %}hest{% comment %}laks{% endcomment %}{% hest %}');
        expect(t.node_list.only_types('comment').map(function(x){return x.type;})).toEqual(['comment','comment']); 
        expect(t.node_list.only_types('text', 'UNKNOWN').map(function(x){return x.type;})).toEqual(['text','UNKNOWN']);
    });

    it('should parse "%"', function () {
        var result, done = false;
        runs(function () {
            t = parse('1 % of this, this is 100% nice! %');
            t.render({}, function (e, r) { done = true; result = r; });
        });
        waitsFor(function () { return done; }, "render took too long", 1000);
        runs(function () { expect(result).toBe('1 % of this, this is 100% nice! %'); });
    });
});

describe('nodelist evaluate', function () {
    it ('should evaluate node_list', function () {
        
        var context = {};
        var node_list = make_nodelist();
        node_list.append( function (context, callback) { callback(false, 'hest'); }, 'test');
        node_list.append( function (context, callback) { callback(false, 'giraf'); }, 'test');
        node_list.append( function (context, callback) { callback(false, ' med lang hals'); }, 'test');

        var result, done = false;
        runs(function () { node_list.evaluate(context, function (e,r) { done = true; result = r; }); });
        waitsFor(function () { return done; }, "evaluate took too long", 1000);
        runs(function () { expect(result).toBe('hestgiraf med lang hals'); });
    });
});


