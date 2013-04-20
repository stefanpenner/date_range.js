(function() {
  var slice, DAY_IN_MS, DateRange;

  slice = Array.prototype.slice;

  DAY_IN_MS = 86400000;

  DateRange = function(from, to) {

    if (!(from && to)) {
      throw new Error("DateRange needs  both `from` and `to`");
    }

    this._from = from.getTime();
    this._to   = to.getTime();

    if (from === to) {
      this.length = 1;
    } else if (to < from) {
     throw new Error('InvalidDateRange negative ranges are not supported');
    } else {
      this.length = DateRange.numberOfDaysBetween(from, to) + 2;
    }
  };

  window.DateRange = DateRange; // expose

  // Util
  DateRange.numberOfDaysBetween = numberOfDaysBetween;

  // instance Methods
  DateRange.prototype._content = null;
  DateRange.prototype._to = null;
  DateRange.prototype._from = null;
  DateRange.prototype.length = 0;
  DateRange.prototype.toArray = toArray;
  DateRange.prototype.includes = includes;
 
  function date(input) {
    return new Date(input);
  }

  function range() {
    return new DateRange();
  }

  function includes(entry) {
    var entryTime;

    if (!entry) { return false; }

    entryTime = entry.getTime();

    return this._from <= entryTime &&  entryTime <= this._to;
  }

  function numberOfDaysBetween(from, to) {
    var daysBetween;

    daysBetween = ((to - from)/DAY_IN_MS) - 1;

    if (isNaN(daysBetween) || daysBetween < 0) {
      return  0;
    } else {
      return daysBetween;
    }
  }

  function toArray() {
    var result, time;

    result = [];

    if (this._content) { return this._content; }

    if (this._from === this._to) {
      result = [date(this._from)];
    } else {
      for (var i = 0; i < this.length; i++) {
        time =  this._from + (DAY_IN_MS * i);

        result.push(date(time));
      }
    }

    this._content = result; // cache
    return result;
  }

}());
