var extend = require('../../lib/utils/base').extend;
var html = require('../../lib/utils/html');

describe('tests for linebreaks()', function () {
    it('should break lines into <p> and <br /> tags', function () {
        var input = 'This is a \'nice\'\n'
            + 'way to spend the summer!\n'
            + '\n'
            + 'The days are just packed!\n';
        expect(html.linebreaks(input)).toBe(
            '<p>This is a \'nice\'<br />'
            + 'way to spend the summer!</p>\n'
            + '\n'
            + '<p>The days are just packed!<br /></p>'
        );
        expect(html.linebreaks(input, { escape: true })).toBe(
            '<p>This is a &#39;nice&#39;<br />'
            + 'way to spend the summer!</p>\n'
            + '\n'
            + '<p>The days are just packed!<br /></p>'
        );
    });
});

describe('truncate_html_words', function () {
    it('should truncate strings without tags', function () {
        expect(html.truncate_html_words('Joel is a slug', 2)).toBe('Joel is ...');
    });
    it('should close tags on truncate', function () {
        expect(html.truncate_html_words('<p>Joel is a slug</p>', 2)).toBe('<p>Joel is ...</p>');
    });
});

describe('urlize', function () {
    it('should urlize urls in text', function () {
        expect(
            html.urlize('Check out www.djangoproject.com')
        ).toBe(
            'Check out <a href="http://www.djangoproject.com">www.djangoproject.com</a>'
        );
        expect(
            html.urlize('Check out (www.djangoproject.com)')
        ).toBe(
            'Check out (<a href="http://www.djangoproject.com">www.djangoproject.com</a>)'
        );
        expect(
            html.urlize('Skriv til test@test.se')
        ).toBe(
            'Skriv til <a href="mailto:test@test.se">test@test.se</a>'
        );
        expect(
            html.urlize('Check out (www.djangoproject.com)\nSkriv til test@test.se')
        ).toBe(
            'Check out (<a href="http://www.djangoproject.com">www.djangoproject.com</a>)\n' +
            'Skriv til <a href="mailto:test@test.se">test@test.se</a>'
        );
        expect(
            html.urlize('Check out www.djangoproject.com', {limit: 15})
        ).toBe(
            'Check out <a href="http://www.djangoproject.com">www.djangopr...</a>'
        );
        expect(
            html.urlize('Se her: (www.dr.dk & http://www.djangoproject.com)', { escape: true })
        ).toBe(
            'Se her: (<a href="http://www.dr.dk">www.dr.dk</a> &amp; ' +
            '<a href="http://www.djangoproject.com">http://www.djangoproject.com</a>)'
        );
        expect(
            html.urlize('Se her: www.dr.dk?hest=4&test=tolv.', { escape: true })
        ).toBe(
            'Se her: <a href="http://www.dr.dk?hest=4&amp;test=tolv">www.dr.dk?hest=4&amp;test=tolv</a>.'
        );
        expect(
            html.urlize('Check out (www.djangoproject.com)', { nofollow: true })
        ).toBe(
            'Check out (<a href="http://www.djangoproject.com" rel="nofollow">www.djangoproject.com</a>)'
        );
    });
});

