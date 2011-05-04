
var extend = require('../../lib/utils/base').extend;
var template = require('../../lib/template/template_defaults');

var LOG = console ? console.log : require('util').debug;

describe('add', function () {
    it('should add correctly', function () {
        expect( filters.add(4, 2)).toBe(6);
        expect( filters.add('4', 2)).toBe(6);
        expect( filters.add('a', 2)).toBe('');
        expect( filters.add(2, 'a')).toBe('');
    });
});

describe('addslashes', function () {
    it('should add slashes correctly', function () {
        expect( filters.addslashes('he said \"she said\"')).toBe('he said \\"she said\\"');
        expect( filters.addslashes(6)).toBe('6');
    });
});

describe('capfirst', function () {
    it('should capitalize first letter correctly', function () {
        expect( filters.capfirst('somewhere over the rainbow')).toBe('Somewhere over the rainbow');
        expect( filters.capfirst(6)).toBe('6');
    });
});

describe('center', function () {
    it('center value', function () {
        expect( filters.center('centered', 18)).toBe('     centered     ');
        expect( filters.center(6, 18)).toBe('        6         ');
    })
});

describe('cut', function () {
    it('remove unwanted letters', function () {
        expect( filters.cut('Somewhere Over The Rainbow', ' ')).toBe('SomewhereOverTheRainbow');
    });
});

describe('date', function () {
    it('correctly format Britneys birthdate', function () {
        expect(filters.date(new Date('12-02-1981'), 'F j, Y')).toBe('December 2, 1981');
        expect(filters.date('hest', 'F j, Y')).toBe('');
    });
});

describe('default', function () {
    it('work as expected', function () {
        expect( filters['default'](false, 6)).toBe(6);
    })
});

describe('default_if_none', function () {
    it('work as expected', function () {
        expect( filters.default_if_none(false, 6)).toBe(false);
        expect( filters.default_if_none(null, 6)).toBe(6);
        expect( filters.default_if_none(undefined, 6)).toBe(6);
    })
});

describe('Test dictsort filter', function () {
    it('should sort correctly', function () {
        var list = [
            {'name': 'zed', 'age': 19},
            {'name': 'amy', 'age': 22},
            {'name': 'joe', 'age': 31}
        ];
        var before = list.slice(0);
        expect(filters.dictsort(list, 'name')).toEqual([ list[1], list[2], list[0] ]);
        expect(list).toEqual(before);
    });

});

describe('dictsortreversed filter', function () {
    it('should sort correctly with dictsortreversed', function () {
        var list = [
            {'name': 'zed', 'age': 19},
            {'name': 'amy', 'age': 22},
            {'name': 'joe', 'age': 31}
        ];
        var before = list.slice(0);
        expect(filters.dictsortreversed(list, 'name') ).toEqual([ list[0], list[2], list[1] ]);
        expect(list).toEqual(before);
    });

});

describe('divisibleby filter', function () {
    it('should correctly determine if value is divisible with arg', function () {
        expect( filters.divisibleby(4, 2)).toBe(true);
        expect( filters.divisibleby(5, 2)).toBe(false);
        expect( filters.divisibleby('hest', 2)).toBe(false);
        expect( filters.divisibleby('hest')).toBe(false);
    });

});

describe('escapejs filter', function () {
    it('should correctly escape value', function () {
        expect( filters.escapejs('æøå&&Ø ""\n')).toBe(escape('æøå&&Ø ""\n'));
        expect( filters.escapejs(6)).toBe('6');
        expect( filters.escapejs()).toBe('');

    });

});

describe('filesizeformat filter', function () {
    it('should return correct readable filesizes', function () {
        expect( filters.filesizeformat(123456789)).toBe('117.7MB');
    });

});

describe('first filter', function () {
    it('should return first in list', function () {
        expect( filters.first('hest')).toBe('');
        expect( filters.first(['hest', 'abe', 39])).toBe('hest');
    });

});

describe('fix_ampersands', function () {
    it('should fix ampersands', function () {
        expect( filters.fix_ampersands('Tom & Jerry', null, {})).toBe('Tom &amp; Jerry');
    });
    it('string should be marked as safe', function () {
        var safety = {};
        filters.fix_ampersands('Tom & Jerry', {}, safety);
        expect( safety.is_safe).toBe(true);
    });

});

describe('floatformat filter', function () {
    it('should format floats', function () {
        expect( filters.floatformat('hest')).toBe('');

        expect( filters.floatformat(34.23234)).toBe('34.2');
        expect( filters.floatformat(34.00000)).toBe('34');
        expect( filters.floatformat(34.26000)).toBe('34.3');

        expect( filters.floatformat(34.23234, 3)).toBe('34.232');
        expect( filters.floatformat(34.00000, 3)).toBe('34.000');
        expect( filters.floatformat(34.26000, 3)).toBe('34.260');

        expect( filters.floatformat(34.23234, -3)).toBe('34.232');
        expect( filters.floatformat(34.00000, -3)).toBe('34');
        expect( filters.floatformat(34.26000, -3)).toBe('34.260');
    });
});

describe('force_escape filter', function () {
    it('should escape string', function () {
        expect(
            filters.force_escape('<script="alert(\'din mor\')"></script>', null, {})
        ).toBe(
            '&lt;script=&#34;alert(&#39;din mor&#39;)&#34;&gt;&lt;/script&gt;'
        );
    });
    it('string should be marked as safe', function () {
        var safety = {};
        filters.force_escape('<script="alert(\'din mor\')"></script>', null, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('get_digit', function () {
    it('should get correct digit', function () {
        expect( filters.get_digit(987654321, 2)).toBe(2);
        expect( filters.get_digit('987654321', 2)).toBe('987654321');
        expect( filters.get_digit('hest'), 2).toBe('hest');
        expect( filters.get_digit(123), 5).toBe(123);
        expect( filters.get_digit(123), 0).toBe(123);
    });

});

describe('join filter', function () {
    it('should join list', function () {
        expect(filters.join([1,2,3,4], ', ')).toBe('1, 2, 3, 4');
        expect( filters.join('1,2,3,4', ', ')).toBe('');
    });
});

describe('last filter', function () {
    it('should return last', function () {
        expect( filters.last(['a', 'b', 'c', 'd'])).toBe('d');
        expect( filters.last([])).toBe('');
        expect( filters.last('hest')).toBe('');
    });
});

describe('length filter', function () {
    it('should return correct length', function () {
        expect( filters.length([1,2,3,4,5])).toBe(5);
        expect( filters.length('hest')).toBe(4);
        expect( filters.length(16)).toBe(0);
    });
});

describe('length_is filter', function () {
    it('should return true on correct length', function () {
        expect( filters.length_is([1,2,3,4,5], 5)).toBe(true);
        expect( filters.length_is('hest', 4)).toBe(true);
    });
    it('should return false on incorrect length or bad arguments', function () {
        expect( filters.length_is([1,2,3,4,5], 2)).toBe(false);
        expect( filters.length_is('hest', 16)).toBe(false);
        expect( filters.length_is(16, 4)).toBe(false);
        expect( filters.length_is('hest')).toBe(false);
    });
});

describe('linebreaks', function () {
    it('linebreaks should be converted to <p> and <br /> tags.', function () {
        expect( filters.linebreaks('Joel\nis a slug', null, {})).toBe('<p>Joel<br />is a slug</p>');
    });
    it('string should be marked as safe', function () {
        var safety = {};
        filters.linebreaks('Joel\nis a slug', null, safety)
        expect( safety.is_safe).toBe(true);
    });
    it('string should be escaped if requsted', function () {
        var safety = { must_escape: true };
        var actual = filters.linebreaks('Two is less than three\n2 < 3', null, safety)
        expect(actual).toBe('<p>Two is less than three<br />2 &lt; 3</p>')
    });
});

describe('linebreaksbr', function () {
    it('linebreaks should be converted to <br /> tags.', function () {
        expect(
            filters.linebreaksbr('Joel\nis a slug.\nFor sure...', null, {})
        ).toBe(
            'Joel<br />is a slug.<br />For sure...'
        );
    });
    it('string should be marked as safe', function () {
        var safety = {};
        filters.linebreaksbr('Joel\nis a slug', null, safety);
        expect( safety.is_safe).toBe(true);
    });
    it('string should be escaped if requsted', function () {
        var safety = { must_escape: true };
        var actual = filters.linebreaksbr('Two is less than three\n2 < 3', null, safety);
        expect(actual).toBe('Two is less than three<br />2 &lt; 3');
    });
});

describe('linenumbers', function () {
    it('should add linenumbers to text', function () {

        var s = "But I must explain to you how all this mistaken idea of\n"
            + "denouncing pleasure and praising pain was born and I will\n"
            + "give you a complete account of the system, and expound the\n"
            + "actual teachings of the great explorer of the truth, the \n"
            + "aster-builder of human happiness. No one rejects, dislikes,\n"
            + "or avoids pleasure itself, because it is pleasure, but because\n"
            + "those who do not know how to pursue pleasure rationally\n"
            + "encounter consequences that are extremely painful. Nor again\n"
            + "is there anyone who loves or pursues or desires to obtain pain\n"
            + "of itself, because it is pain, but because occasionally\n"
            + "circumstances occur in which toil and pain can procure him\n"
            + "some great pleasure. To take a trivial example, which of us";

        var expected = "01. But I must explain to you how all this mistaken idea of\n"
            + "02. denouncing pleasure and praising pain was born and I will\n"
            + "03. give you a complete account of the system, and expound the\n"
            + "04. actual teachings of the great explorer of the truth, the \n"
            + "05. aster-builder of human happiness. No one rejects, dislikes,\n"
            + "06. or avoids pleasure itself, because it is pleasure, but because\n"
            + "07. those who do not know how to pursue pleasure rationally\n"
            + "08. encounter consequences that are extremely painful. Nor again\n"
            + "09. is there anyone who loves or pursues or desires to obtain pain\n"
            + "10. of itself, because it is pain, but because occasionally\n"
            + "11. circumstances occur in which toil and pain can procure him\n"
            + "12. some great pleasure. To take a trivial example, which of us";

        expect( filters.linenumbers(s, null, {})).toBe(expected);
    });
    it('string should be marked as safe', function () {
        var safety = {};
        filters.linenumbers('Joel\nis a slug', null, safety);
        expect( safety.is_safe).toBe(true);
    });
    it('string should be escaped if requsted', function () {
        var safety = { must_escape: true };
        var actual = filters.linenumbers('Two is less than three\n2 < 3', null, safety);
        expect(actual).toBe('1. Two is less than three\n2. 2 &lt; 3');
    });
});

describe('ljust', function () {
    it('should left justify value i correctly sized field', function () {
        expect( filters.ljust('hest', 10)).toBe('hest      ');
        expect( filters.ljust('hest')).toBe('');
        expect( filters.ljust('hest', 2)).toBe('he');
    });
});

describe('lower', function () {
    it('should lowercase value', function () {
        expect( filters.lower('Somewhere Over the Rainbow')).toBe('somewhere over the rainbow');
        expect( filters.lower(19)).toBe('');
    });
});

describe('make_list', function () {
    it('should make_list as expected', function () {
        expect(filters.make_list('Joel')).toEqual(['J', 'o', 'e', 'l']);
        expect(filters.make_list('123')).toEqual(['1', '2', '3']);
    });
});

describe('phone2numeric', function () {
    it('should convert letters to numbers phone number style', function () {
        expect( filters.phone2numeric('800-COLLECT')).toBe('800-2655328');
        expect( filters.phone2numeric('abcdefghijklmnopqrstuvwxyz')).toBe('2223334445556667q77888999z');
    });
});

describe('pluralize', function () {
    it('should pluralize correctly', function() {
        expect( filters.pluralize('sytten')).toBe('');
        expect( filters.pluralize(1)).toBe('');
        expect( filters.pluralize(2)).toBe('s');
        expect( filters.pluralize(1, 'es')).toBe('');
        expect( filters.pluralize(2, 'es')).toBe('es');
        expect( filters.pluralize(1, 'y,ies')).toBe('y');
        expect( filters.pluralize(2, 'y,ies')).toBe('ies');
    });
});

describe('pprint', function () {
    it("should not throw and not return ''", function () {
        expect(filters.pprint( filters )).toBeTruthy();
    });
});

describe('random', function () {
    // TODO: The test for random is pointless and should be improved
    it('should return an element from the list', function () {
        expect(filters.random(['h', 'e', 's', 't'])).not.toBeLessThan(0);
    });
    it('should return empty string when passed non array', function () {
        expect( filters.random( 25 )).toBe('');
    });
});

describe('removetags', function () {
    it('should remove tags', function () {
        expect(
            filters.removetags('<b>Joel</b> <button>is</button> a <span\n>slug</span>', 'b span', {})
        ).toBe(
            'Joel <button>is</button> a slug'
        );
    });
    it('should mark string as safe', function () {
        var safety = {};
        filters.removetags('<b>Joel</b> <button>is</button> a <span\n>slug</span>', 'b span', safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('rjust', function () {
    it('should right justify value in correctly sized field', function () {
        expect( filters.rjust('hest', 10)).toBe('      hest');
        expect( filters.rjust('hest')).toBe('');
        expect( filters.rjust('hest', 2)).toBe('he');
    });
});

describe('slice', function () {
    var arr = [0,1,2,3,4,5,6,7,8,9];
    it('slice should slice like python', function () {
        expect(filters.slice(arr, ":4")).toEqual([0,1,2,3]);
        expect(filters.slice(arr, "6:")).toEqual([6,7,8,9]);
        expect(filters.slice(arr, "2:5")).toEqual([2,3,4]);
        expect(filters.slice(arr, "2::3")).toEqual([2,5,8]);
        expect(filters.slice(arr, "2:6:3")).toEqual([2,5]);
    });
    it('slice should handle bad values', function () {
        expect(filters.slice(36, ":4")).toEqual([]);
        expect(filters.slice(arr, 'hest')).toEqual([0,1,2,3,4,5,6,7,8,9]);
        expect(filters.slice(arr)).toEqual([0,1,2,3,4,5,6,7,8,9]);
    });
});

describe('slugify', function () {
    it('should slugify correctly', function () {
        expect( filters.slugify('Joel is a slug')).toBe('joel-is-a-slug');
        expect( filters.slugify('Så står Verden da ikke længere!')).toBe('s-str-verden-da-ikke-lngere');
        expect( filters.slugify('Super_Max')).toBe('super_max');
    });
});

describe('stringformat', function () {
    it('return expected results', function () {
        expect( filters.stringformat(2, '03d')).toBe('002');
        expect( filters.stringformat('Hest', 's')).toBe('Hest');
        expect( filters.stringformat('Hest', '')).toBe('');
        expect( filters.stringformat('Hest', '-10s')).toBe('Hest      ');
    });
});

describe('striptags', function () {
    it('should remove tags', function () {
        expect(
            filters.striptags('<p>jeg har en <strong\n>dejlig</strong> hest.</p>', null, {})
        ).toBe('jeg har en dejlig hest.');
    });
    it('string should be marked as safe', function () {
        var safety = {};
        filters.striptags('<p>jeg har en <strong\n>dejlig</strong> hest.</p>', null, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('title', function () {
    it('should titlecase correctly', function () {
        expect( filters.title('This is correct')).toBe('This Is Correct');
    });
});

describe('truncatewords', function () {
    it('should truncate', function () {
        expect( filters.truncatewords('Joel is a slug', 2)).toBe('Joel is ...');
    });
});

describe('upper', function () {
    it('should uppercase correctly', function () {
        expect( filters.upper('Joel is a slug')).toBe('JOEL IS A SLUG');
    });
});

describe('urlencode', function () {
    it('should encode urls', function () {
        expect( filters.urlencode('"Aardvarks lurk, OK?"')).toBe('%22Aardvarks%20lurk%2C%20OK%3F%22');
    });
});

describe('safe', function () {
    it('string should be marked as safe', function () {
        var safety = {};
        filters.safe('Joel is a slug', null, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('safeseq', function () {
    it('output should be marked as safe', function () {
        var safety = {};
        filters.safe(['hest', 'giraf'], null, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('escape', function () {
    it('output should be marked as in need of escaping', function () {
        var safety = { must_escape: false };
        filters.escape('hurra', null, safety);
        expect( safety.must_escape).toBe(true);
    });
});

describe('truncatewords_html', function () {
    it('should truncate and close tags', function () {
        expect( filters.truncatewords_html('Joel is a slug', 2, {})).toBe('Joel is ...');
        expect( filters.truncatewords_html('<p>Joel is a slug</p>', 2, {})).toBe('<p>Joel is ...</p>');
    });
    it('should mark output as safe', function () {
        var safety = {};
        filters.truncatewords_html('<p>Joel is a slug</p>', 2, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('time', function () {
    it('correctly format time', function () {
        var t = new Date();
        t.setHours('18');
        t.setMinutes('12');
        t.setSeconds('14');
        expect( filters.time(t, 'H:i:s')).toBe('18:12:14');
        expect( filters.date('hest', 'H:i:s')).toBe('');
    });
});

describe('timesince', function () {
    it('should return time since', function () {
        var blog_date = new Date("1 June 2006 00:00:00");
        var comment_date = new Date("1 June 2006 08:00:00");
        expect( filters.timesince(blog_date, comment_date)).toBe('8 hours');
    });
});

describe('timeuntil', function () {
    it('should return time since', function () {
        var today = new Date("1 June 2006");
        var from_date = new Date("22 June 2006");
        var conference_date = new Date("29 June 2006");
        expect( filters.timeuntil(conference_date, today)).toBe('4 weeks');
        expect( filters.timeuntil(conference_date, from_date)).toBe('1 week');
    });
});

describe('urlize', function () {
    it('should urlize text', function () {
        expect(
            filters.urlize('Check out www.djangoproject.com', null, {})
        ).toBe(
            'Check out <a href="http://www.djangoproject.com">www.djangoproject.com</a>'
        );
    });
    it('should escape if required', function () {
        var safety = { must_escape: true };
        expect( filters.urlize('hest & giraf', null, safety)).toBe('hest &amp; giraf');
    });
    it('should mark output as safe if escaped', function () {
        var safety = { must_escape: true };
        filters.urlize('hest', null, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('urlizetrunc', function () {
    it('should urlize text and truncate', function () {
        expect(
            filters.urlizetrunc('Check out www.djangoproject.com', 15, {})
        ).toBe(
            'Check out <a href="http://www.djangoproject.com">www.djangopr...</a>'
        );
    });
    it('should escape if required', function () {
        var safety = { must_escape: true };
        expect( filters.urlizetrunc('hest & giraf', 15, safety)).toBe('hest &amp; giraf');
    });
    it('should mark output as safe if escaped', function () {
        var safety = { must_escape: true };
        filters.urlizetrunc('hest', 15, safety);
        expect( safety.is_safe).toBe(true);
    });
});

describe('wordcount', function () {
    it('should count words', function () {
        expect( filters.wordcount('I am not an atomic playboy')).toBe(6);
    });
});

describe('yesno', function () {
    it('should return correct value', function () {
        expect( filters.yesno(true, "yeah,no,maybe")).toBe('yeah');
        expect( filters.yesno(false, "yeah,no,maybe")).toBe('no');
        expect( filters.yesno(null, "yeah,no,maybe")).toBe('maybe');
        expect( filters.yesno(undefined, "yeah,no,maybe")).toBe('maybe');
        expect( filters.yesno(undefined, "yeah,no")).toBe('no');
    });
});

