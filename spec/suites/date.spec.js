
describe('date_format', function () {
    it('should format each filter correctly', function () {
        var d = new Date(1981, 11, 2, 18, 31, 45, 123); // Random time on Britney Spears birthday :-)
        var tz = d.toString().substr(28, 5);
        expect(format_date(d, 'a')).toBe('p.m.');
        expect(format_date(d, 'A')).toBe('PM');
        expect(format_date(d, 'b')).toBe('dec');

        expect(format_date(d, 'B')).toThrow();

        expect(format_date(d, 'c')).toBe('1981-12-02T18:31:45.123000');
        expect(format_date(d, 'd')).toBe('02');
        expect(format_date(d, 'D')).toBe('Wed');
        expect(format_date(d, 'f')).toBe('6:31'); // x
        expect(format_date(d, 'F')).toBe('December');
        expect(format_date(d, 'g')).toBe('6');
        expect(format_date(d, 'G')).toBe('18');  //x
        expect(format_date(d, 'h')).toBe('06');
        expect(format_date(d, 'H')).toBe('18'); // x
        expect(format_date(d, 'i')).toBe('31'); // x

        expect(format_date(d, 'I')).toThrow();

        expect(format_date(d, 'l')).toBe('Wednesday');
        expect(format_date(d, 'L')).toBe('false');
        expect(format_date(d, 'm')).toBe('12'); // x
        expect(format_date(d, 'M')).toBe('Dec');
        expect(format_date(d, 'n')).toBe('12');
        expect(format_date(d, 'N')).toBe('Dec.');
        expect(format_date(d, 'O')).toBe(tz);

        expect(format_date(d, 'P')).toBe('6:31 p.m.');
        expect(format_date(new Date(2000, 1, 1, 0, 0), 'P')).toBe('midnight');
        expect(format_date(new Date(2000, 1, 1, 12, 0), 'P')).toBe('noon');
        expect(format_date(new Date(2000, 1, 1, 6, 0), 'P')).toBe('6 a.m.');

        expect('2 Dec 1981 18:31:45 ' + tz, format_date(d, 'r')).toBe('Wed');
        expect(format_date(d, 's')).toBe('45'); // x
        expect(format_date(d, 'S')).toBe('nd'); // x (st, nd, rt or th)

        expect(format_date(d, 't')).toBe('31');
        expect(format_date(new Date(2000, 10, 3), 't')).toBe('30');
        expect(format_date(new Date(2000, 1, 3), 't')).toBe('29');
        expect(format_date(new Date(1999, 1, 3), 't')).toBe('28');

        expect(format_date(d, 'T')).toBe('GMT+0100'); // good enough for now...
        expect(format_date(d, 'U')).toBe('376162305');
        expect(format_date(d, 'w')).toBe('3');
        expect(format_date(d, 'W')).toBe('49');
        expect(format_date(d, 'y')).toBe('81');
        expect(format_date(d, 'Y')).toBe('1981');
        expect(format_date(d, 'z')).toBe('336');
        expect(format_date(d, 'Z')).toBe(tz * -36 + "");
    });
});

describe('longer formats', function () {
    it('should understand l jS \\o\\f F Y h:i:s A', function () {
        var d = new Date(1981, 11, 2, 18, 31, 45, 123); // Random time on Britney Spears birthday :-)
        expect(format_date(d, 'l jS \\o\\f F Y h:i:s A')).toBe('Wednesday 2nd of December 1981 06:31:45 PM');
    });
});

describe('timesince', function () {
    it('should return correct results for known values', function () {
        var now = new Date("Wed Dec 02 1981 18:31:45 GMT+0100 (CET)"); // Random time on Britney Spears birthday :-)

        var date = new Date("Wed Dec 02 1981 15:15:45 GMT+0100 (CET)");
        expect(timesince(date, now)).toBe('3 hours, 16 minutes');

        date = new Date("Wed Nov 22 1981 15:15:45 GMT+0100 (CET)");
        expect(timesince(date, now)).toBe('1 week, 3 days');

        date = new Date("Sun Oct 19 1981 18:10:53 GMT+0100 (CET)");
        expect(timesince(date, now)).toBe('1 month, 2 weeks');

        date = new Date("Sat Dec 29 1970 04:52:13 GMT+0100 (CET)");
        expect(timesince(date, now)).toBe('10 years, 11 months');

        date = new Date("Wed Nov 13 1980 10:36:13 GMT+0100 (CET)");
        expect(timesince(date, now)).toBe('1 year');
        
        date = new Date("Wed Dec 02 1981 18:29:40 GMT+0100 (CET)"); // Random time on Britney Spears birthday :-)
        expect(timesince(date, now)).toBe('2 minutes');

        date = new Date("Wed Dec 02 1983 18:29:40 GMT+0100 (CET)"); // Random time on Britney Spears birthday :-)
        expect(timesince(date, now)).toBe('0 minutes');
    });
});

run();
