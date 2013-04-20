var BAD_DATE_RANGE_ARGUMENTS_ERROR = /DateRange needs  both `from` and `to`/

function day(date) {
  if (date) {
    return new Date(date);
  } else {
    return new Date();
  }
}

function throwsBadDateRangeArgumentsError(fn) {
  throws(fn, BAD_DATE_RANGE_ARGUMENTS_ERROR);
}

module("DateRange.Range construction");

test("nothing", function() {
  throwsBadDateRangeArgumentsError(function() {
    new DateRange();
  });
});

test("single entry", function() {
  var from = day()
  throwsBadDateRangeArgumentsError(function() {
    new DateRange(from);
  });
});

test("neighbours", function() {
  var from = day('01-01-2012'),
    to = day('01-02-2012'),
    range = new DateRange(from, to);

  equal(range.length, 2);
});

test("with gap of one", function() {
  var from = day('01-01-2012'),
    to = day('01-03-2012'),
    range = new DateRange(from, to);

  equal(range.length, 3);
});

test("going backwards in time", function() {
  var from = day('01-02-2012'),
    to = day('01-01-2012');

    throws(function(){
      new DateRange(from, to);
    }, /negative ranges are not supported/);
});

module("DateRange.Range#includes");

test("no inclusion", function() {
  var from = day('01-01-2012'),
    to = day('01-02-2012'),
    range = new DateRange(from, to),
    today = day('01-03-2012');

  ok(!range.includes(today), 'today was not included');
});

test("inclusion", function() {
  var today = day(),
  range = new DateRange(today, today);

  ok(range.includes(today), 'the range does include itself');
});

module("DateRange.Range#toArray");

test("it expands `from === to` to  single entry range", function() {
  var today = day(),
  range = new DateRange(today, today),
  expansion = range.toArray();

  equal(expansion.length, 1);
  deepEqual(expansion, [today]);
});

test("it expands from, as a continues pair of days, to [from,to] ", function() {
  var from = day('01-01-2012'),
    to = day('01-02-2012'),
  range = new DateRange(from, to),
  expansion = range.toArray();

  equal(expansion.length, 2);
  deepEqual(expansion, [from, to]);
});

test("it expands from <single gap> to 3 entry array", function() {
  var from = day('01-01-2012'),
    center = day('01-02-2012'),
    to = day('01-03-2012'),
  range = new DateRange(from, to),
  expansion = range.toArray();

  equal(expansion.length, 3);
  deepEqual(expansion, [from, center, to]);
});

module("DateRange.daysBetween");

test("same day", function() {
  var from = day();

  equal(DateRange.numberOfDaysBetween(from, from), 0);
});

test("neighbours", function() {
  var from = day('01-01-2012'),
   to = day('01-02-2012');

  equal(DateRange.numberOfDaysBetween(from,to), 0);
});

test("1 day in the middle", function() {
  var from = day('01-01-2012'),
   to = day('01-03-2012');

  equal(DateRange.numberOfDaysBetween(from,to), 1);
});

test("some long ass time in the middle", function() {
  var from = day('01-01-2012'),
   to = day('01-01-2020');

  equal(DateRange.numberOfDaysBetween(from,to), 2921);
});

module("DateRange.monthRangeForDate");

test("the first of the month");
test("a not (first or last day) of the month");
test("a non-leap year leap day");
test("a leap year leap day");
test("the last of the month");

module("DateRange.weekRangeForDate");

test("the first of the week");
test("a not (first or last day) of the week");
test("a non-leap year leap-year situation");
test("a leap year leap situation");
test("the last of the week");
