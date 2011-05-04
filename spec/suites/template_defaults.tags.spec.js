var fs = require('fs');
var extend = require('../../lib/utils/base').extend;
var template = require('../../lib/template/template');

var LOG = console ? console.log : require('util').debug;

extend(GLOBAL, require('../../lib/template/template_defaults'));

function write_file(path, content) {
    var file = fs.openSync(path, 'w');
    fs.writeSync(file, content);
    fs.closeSync(file);
}

function it_should_render(tpl) {
    return {
        'as': function (expected) {
            var context = it_should_render._context;
            it("should render '" + tpl + "' as '" + expected + "'", function () {
                var actual, done = false;
                var parsed = template.parse(tpl);
                runs(function () {
                    parsed.render(context, function (error, result) {
                        if (error) {
                            // TODO: fail!!
                        } else {
                            actual = result;
                            done = true;
                        }
                    });
                });
                waitsFor(function () { return done; }, "rendering took too long", 500);
                runs(function () {
                    expect(actual).toBe(expected);
                });
            });
        }
    };
}
set_render_context = function (context) {
    it_should_render._context = context;
}

describe('fornode', function () {
    set_render_context({ items: [ 1,2,3,4 ], noitems: [] });
    it_should_render('{% for item in items %} {{ item }} {% endfor %}').as(' 1  2  3  4 ');
    it_should_render('{% for item in notitems %} {{ item }} {% empty %}hest{% endfor %}').as('hest');
});

describe('variable', function () {

    set_render_context({
        num: 18,
        str: 'hest',
        bool: false,
        list: [1,2,'giraf',4],
        func: function () { return 'tobis'; },
        obj: { a: 1, b: 2, c: { d: 23, e: { f: 'laks' } } },
        qstr: '"hest"'
    });

    it_should_render('{{ 100 }}').as('100');
    it_should_render('{{ num }}').as('18');
    it_should_render('{{ str }}').as('hest');
    it_should_render('{{ func }}').as('tobis');
    it_should_render('{{ bool }}').as('false');
    it_should_render('{{ list }}').as('1,2,giraf,4');
    it_should_render('{{ obj.a }}').as('1');
    it_should_render('{{ obj.b }}').as('2');
    it_should_render('{{ obj.c.e.f }}').as('laks');
    it_should_render('{{ nonexisting }}').as('');
    it_should_render('{{ qstr }}').as('&#34;hest&#34;');
    it_should_render('{{ "hest"|upper }}').as('HEST');
    it_should_render('{{ 10|add:"6" }}').as('16');
    it_should_render('{{ 6|add:6|add:"-12" }}').as('0');
});


describe('ifnode', function () {
    set_render_context({a: true, b: false });

    it_should_render('{% if a %}hest{% endif %}').as('hest');
    it_should_render('{% if b %}hest{% endif %}').as('');
    it_should_render('{% if not b %}hest{% endif %}').as('hest');
    it_should_render('{% if b %}hest{% else %}laks{% endif %}').as('laks');
    it_should_render('{% if not b and a %}hest{% endif %}').as('hest');
    it_should_render('{% if a or b %}hest{% endif %}').as('hest');
    it_should_render('{% if b or a %}hest{% endif %}').as('hest');
});

describe('textnode', function () {
    set_render_context({});
    it_should_render('heste er gode laks').as('heste er gode laks');
});

describe('comment', function () {
    set_render_context({});
    it_should_render('{% comment %} do not parse {% hest %} any of this{% endcomment %}').as('');
});

describe('cycle', function () {
    set_render_context({ c: 'C', items: [1,2,3,4,5,6,7,8,9] });

    it_should_render(
        '{% for item in items %}{% cycle \'a\' "b" c %}{{ item }} {% endfor %}'
    ).as('a1 b2 C3 a4 b5 C6 a7 b8 C9 ');

    it_should_render(
        '{% cycle "a" "b" "c" as tmp %} {% cycle "H" "J" as tmp2 %} ' + 
        '{% cycle tmp %} {% cycle tmp2 %} {% cycle tmp %} {% cycle tmp2 %} {%cycle tmp %}',
        'should work with as tag'
    ).as('a H b J c H a');
});

describe('filter', function () {
    set_render_context({});
    it_should_render(
        '{% filter force_escape|lower %}' +
        'This text will be HTML-escaped & will appear in all lowercase.{% endfilter %}'
    ).as('this text will be html-escaped &amp; will appear in all lowercase.');
});


describe('block and extend', function () {

    set_render_context({ parent: 'block_test_2.html' });

    // write template files
    write_file('/tmp/block_test_1.html', 'Joel is a slug');
    write_file('/tmp/block_test_2.html', 'Her er en dejlig {% block test %}hest{% endblock %}.');
    write_file('/tmp/block_test_3.html',
        '{% block test1 %}hest{% endblock %}.' 
        + '{% block test2 %} noget {% endblock %}'
    );
    write_file('/tmp/block_test_4.html',
        '{% extends "block_test_3.html" %}'
        + '{% block test1 %}{{ block.super }}{% block test3 %}{% endblock %}{% endblock %}'
        + '{% block test2 %} Et cirkus{{ block.super }}{% endblock %}'
    );

    var template_loader = require('../../lib/template/loader');
    template_loader.flush();
    template_loader.set_path('/tmp');

    //block should parse and evaluate
    it_should_render(
        '{% block test %}{% filter lower %}HER ER EN HEST{% endfilter %}Giraf{% endblock %}'
    ).as('her er en hestGiraf');

    //extend should parse and evaluate (without blocks)'
    it_should_render(
        '{% extends "block_test_1.html" %}'
    ).as('Joel is a slug');

    //block should override block in extend
    it_should_render(
        '{% extends "block_test_2.html" %}{% block test %}giraf{% endblock %}'
    ).as('Her er en dejlig giraf.');

    //block.super variable should work
    it_should_render(
        '{% extends "block_test_2.html" %}{% block test %}{{ block.super }}giraf{% endblock %}'
    ).as('Her er en dejlig hestgiraf.');

    //more than two levels
    it_should_render(
        '{% extends "block_test_4.html" %}'
        + '{% block test2 %}{{ block.super }}tre{% endblock %}'
        + '{% block test3 %}giraf{% endblock %}'
    ).as('hestgiraf. Et cirkus noget tre');

    //extend with variable key
    it_should_render(
        '{% extends parent %}{% block test %}{{ block.super }}giraf{% endblock %}'
    ).as('Her er en dejlig hestgiraf.');

    // TODO: tests to specify behavior when blocks are name in subview but not parent
});

describe('autoescape', function () {
    set_render_context({ test: '<script>'});

    it_should_render(
        '{% autoescape off %}{{ test }}{% endautoescape %}',
        'there should be no escaping in "off" block'
    ).as('<script>');

    it_should_render(
        '{% autoescape on %}{{ test }}{% endautoescape %}',
        'there should be escaping in "on" block'
    ).as('&lt;script&gt;');
});

describe('firstof', function () {
    set_render_context({ var1: 'hest' });

    it_should_render('{% firstof var1 var2 var3 %}').as('hest');
    it_should_render('{% firstof var60 var1 var3 %}').as('hest');
    it_should_render('{% firstof var60 var70 var100 %}').as('');
    it_should_render('{% firstof var60 var70 var100 "fallback" %}').as('fallback');
});


describe('with', function () {
    var cnt = 0;
    set_render_context({ test: { sub: { func: function () { return ++cnt; } } } });
    it_should_render('{% with test.sub.func as tmp %}{{ tmp }}:{{ tmp }}{% endwith %}').as('1:1');
});


describe('ifchanged', function () {
    set_render_context({ list:['hest','giraf','giraf','hestgiraf'] });
    it_should_render(
        '{% for item in list %}{% ifchanged %}{{ item }}{% endifchanged %}{%endfor%}'
    ).as('hestgirafhestgiraf');

    it_should_render(
        '{% for item in list %}{% ifchanged %}{{ item }}{% else %}::{% endifchanged %}{%endfor%}'
    ).as('hestgiraf::hestgiraf');
});

describe('ifequal', function () {
    set_render_context({item: 'hest', other: 'hest', fish: 'laks'  });

    it_should_render('{% ifequal "hest" "hest" %}giraf{%endifequal %}').as('giraf');
    it_should_render('{% ifequal item "hest" %}giraf{%endifequal %}').as('giraf');
    it_should_render('{% ifequal item other %}giraf{%endifequal %}').as('giraf');
    it_should_render('{% ifequal item fish %}giraf{%endifequal %}').as('');
    it_should_render('{% ifequal item fish %}giraf{% else %}tapir{%endifequal %}').as('tapir');
});

describe('ifnotequal', function () {
    set_render_context({item: 'hest', other: 'hest', fish: 'laks' });

    it_should_render('{% ifnotequal "hest" "giraf" %}laks{%endifnotequal %}').as('laks');
    it_should_render('{% ifnotequal item "giraf" %}laks{%endifnotequal %}').as('laks');
    it_should_render('{% ifnotequal item fish %}laks{%endifnotequal %}').as('laks');
    it_should_render('{% ifnotequal item other %}laks{%endifnotequal %}').as('');
    it_should_render('{% ifnotequal item other %}laks{% else %}hest{% endifnotequal %}').as('hest');
});

describe('now', function () {
    set_render_context({});
    var date = new Date();
    var expected = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
                    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    it_should_render('{% now "H:i" %}').as(expected);
});

describe('include', function () {
    write_file('/tmp/include_test.html', 'her er en hest{{ item }}.');

    var template_loader = require('../../lib/template/loader');
    template_loader.flush();
    template_loader.set_path('/tmp');

    set_render_context({ name: 'include_test.html', item: 'giraf' });

    it_should_render('{% include "include_test.html" %}').as('her er en hestgiraf.');
    it_should_render('{% include name %}').as('her er en hestgiraf.');
});

describe('load', function () {
    write_file('/tmp/load_tag_test.js',
       'exports.filters = {' + 
       '    testfilter: function () {' + 
       '        return "hestgiraf";' + 
       '    }' + 
       '};' + 
       'exports.tags = {' + 
       '    testtag: function () {' + 
       '        return function (context, callback) {' + 
       '            callback(false, "hestgiraf");' + 
       '        };' + 
       '    }' + 
       '};'
    );
    require.paths.push('/tmp');
    it_should_render('{% load load_tag_test %}{{ 100|testfilter }}').as('hestgiraf');
    it_should_render('{% load "load_tag_test" %}{{ 100|testfilter }}').as('hestgiraf');
    it_should_render('{% load load_tag_test %}{% testtag %}').as('hestgiraf');
});

describe('templatetag', function () {
    set_render_context({});
    it_should_render('{% templatetag openblock %}').as('{%');
    it_should_render('{% templatetag closeblock %}').as('%}');
    it_should_render('{% templatetag openvariable %}').as('{{');
    it_should_render('{% templatetag closevariable %}').as('}}');
    it_should_render('{% templatetag openbrace %}').as('{');
    it_should_render('{% templatetag closebrace %}').as('}');
    it_should_render('{% templatetag opencomment %}').as('{#');
    it_should_render('{% templatetag closecomment %}').as('#}');
});

describe('spaceless', function () {
    set_render_context({});
    it_should_render(
        '{% spaceless %}<p>\n        <a href="foo/">Foo</a>\n    </p>{% endspaceless %}'
    ).as('<p><a href="foo/">Foo</a></p>');
});

describe('widthratio', function () {
    set_render_context({this_value: 175, max_value: 200 });
    it_should_render('{% widthratio this_value max_value 100 %}').as('88');
});

describe('regroup', function () {
    set_render_context({
        people: [
            {'first_name': 'George', 'last_name': 'Bush', 'gender': 'Male'},
            {'first_name': 'Bill', 'last_name': 'Clinton', 'gender': 'Male'},
            {'first_name': 'Margaret', 'last_name': 'Thatcher', 'gender': 'Female'},
            {'first_name': 'Condoleezza', 'last_name': 'Rice', 'gender': 'Female'},
            {'first_name': 'Pat', 'last_name': 'Smith', 'gender': 'Unknown'}
        ]
    });

    it_should_render(
        '{% regroup people by gender as gender_list %}' + 
        '<ul>{% for gender in gender_list %}<li>{{ gender.grouper }}:' +
        '<ul>{% for item in gender.list %}<li>{{ item.first_name }} {{ item.last_name }}</li>{% endfor %}' +
        '</ul></li>{% endfor %}</ul>'
    ).as(
        '<ul>' +
            '<li>Male:<ul><li>George Bush</li><li>Bill Clinton</li></ul></li>' +
            '<li>Female:<ul><li>Margaret Thatcher</li><li>Condoleezza Rice</li></ul></li>' +
            '<li>Unknown:<ul><li>Pat Smith</li></ul></li>' +
        '</ul>'
    );
});

describe('url', function () {

    set_render_context({ year: 1981, month: 12, date: 2, url_name: 'news-views-article_detail' });

    beforeEach(function () {
        process.djangode_urls = {
            'news-views-special_case_2003': /^articles\/2003\/$/,
            'news-views-year_archive': /^articles\/(\d{4})\/$/,
            'news-views-month_archive': /^articles\/(\d{4})\/(\d{2})\/$/,
            'news-views-article_detail': /^articles\/(\d{4})\/(\d{2})\/(\d+)\/$/
        };
    });

    afterEach(function () {
        delete process.djangode_urls;
    });

    it_should_render("{% url 'news-views-special_case_2003' %}").as("/articles/2003/");
    it_should_render("{% url 'news-views-year_archive' 1981 %}").as("/articles/1981/");
    it_should_render("{% url 'news-views-month_archive' 1981 , 12 %}").as("/articles/1981/12/");
    it_should_render("{% url url_name year, month, date %}").as("/articles/1981/12/2/");

    it_should_render("{% url 'news-views-special_case_2003' as the_url %}{{ the_url }}").as("/articles/2003/");
    it_should_render("{% url 'news-views-month_archive' 1981, 12 as the_url %}{{ the_url }}").as("/articles/1981/12/");
});


