var extend = require('../../lib/utils/base').extend;
extend(GLOBAL, require('../../lib/utils/string'));

describe('string utility functions', function () {
    it('smart_split should split correctly', function () {
        expect(smart_split('this is "the \\"correct\\" way"')).toEqual(['this', 'is', '"the \\"correct\\" way"']);
    });
    it('add_slashes should add slashes', function () {
        expect(add_slashes('this is "it"')).toBe('this is \\"it\\"');
    });
    it('cap_first should capitalize first letter', function () {
        expect(cap_first('yeah baby!')).toBe('Yeah baby!');
    });
    it('center should center text', function () {
        expect(center('centered', 18)).toBe('     centered     ');
        expect(center('centere', 18)).toBe('     centere      ');
        expect(center('centered', 17)).toBe('    centered     ');
        expect(center('centered', 3)).toBe('centered');
    });
});

describe('titleCaps', function () {
    it('should work as expected', function () {
        expect(titleCaps("Nothing to Be Afraid of?")).toBe("Nothing to Be Afraid Of?");
        expect(titleCaps("Q&A With Steve Jobs: 'That's What Happens In Technology'"))
            .toBe("Q&A With Steve Jobs: 'That's What Happens in Technology'");
    });
});

describe('wrap', function () {
    it('should wrap text', function () {
        expect(wordwrap('Joel is a slug', 5)).toBe('Joel \nis a \nslug');
    });
});

describe('regex_to_string', function () {
    it('should work without groups', function () {
        expect(regex_to_string(/hest/)).toBe('hest');
        expect(regex_to_string(/^hest$/)).toBe('hest');
        expect(regex_to_string(/hest\s*giraf\d+/)).toBe('hestgiraf');
        expect(regex_to_string(/hest\*/)).toBe('hest*');
        expect(regex_to_string(/hest(tobis)giraf/)).toBe('hestgiraf');
    });
    
    it('should replace groups with input', function () {
        expect(regex_to_string(/^shows\/(\w+)\/(\d+)\/$/, ['hest', 34])).toBe('shows/hest/34/');
        expect(regex_to_string(/^shows\/(hest(?:laks|makrel))\/(\d+)\/$/, ['giraf', 90])).toBe('shows/giraf/90/');
    });
});


