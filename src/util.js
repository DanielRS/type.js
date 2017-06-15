// Merges two objects.
export function merge() {
	const merged = {};
	for (var i = 0; i < arguments.length; i++) {
		const obj = arguments[i];
		for (var attr in obj) { merged[attr] = obj[attr]; }
	}
	return merged;
}

// Checks if the given object is a function. Taken from underscorejs source code.
export function isFunction(obj) {
	return !!(obj && obj.constructor && obj.call && obj.apply);
}

// Checks if the given object is an array.
export function isArray(obj) {
	return toString(obj) === "[object Array]";
}

// Returns the first element of the array.
export function head(array) {
	return array[0];
}

// Returns the same array skipping the first element.
export function tail(array) {
	return array.slice(1);
}

// Drops the first character of the string and returns the rest.
export function strTail(str) {
	return str.substring(1, str.length);
}

// Returns the first character of the string.
export function strHead(str) {
	return str[0];
}

// Return the last character of the string.
export function strLast(str) {
	return str[str.length - 1];
}

// Drops the given number of characters from the start of the string.
export function strDrop(string, n) {
	return string.substr(n, string.length);
}

// Drops the given number of characters from the end of the string
export function strDropTail(string, n) {
	return string.substr(0, string.length - n);
}

// Intersects the start of two strings.
export function strIntersect(a, b) {
	var i;
	for (i = 0; i < Math.min(a.length, b.length); i++) {
		if (a[i] != b[i]) break;
	}
	return a.substr(0, i);
}

// Returns the original value with the given noise applied.
// E.g. noise(x, 2) = x - 2 <= y <= x + 2
export function noise(x, delta) {
	return Math.round(Math.random() * delta * 2 - delta) + x;
}

// Checks if the given prefix is prefix of target.
export function isPrefix(prefix, target) {
	return target.substr(0, prefix.length) == prefix;
}

// Checks if the given string has length zero.
export function isEmpty(string) {
	return string.length == 0;
}

// Creates a typer that deletes characters each time it
// is called until predicate is true. After that, it appends
// the characters of the given string one by one each time
// it is called.
export function makeTyper(current, pending, predicate) {
	var forward = current.length == 0 || predicate(current, pending);
	var prevLength = current.length;
	return function() {
		const step = {
			current: current,
			pending: pending,
			isType: current.length > prevLength,
			isBackspace: current.length < prevLength,
			isDone: forward && pending.length <= 0
		};

		prevLength = current.length;
		if (forward && pending.length > 0) {
			current = current + head(pending);
			pending = tail(pending);
		} else if (!forward && current.length > 0) {
			current = strDropTail(current, 1);
		}
		forward = forward || current.length == 0 || predicate(current, pending);

		return step;
	};
}

// Creates a typer that deletes characters until current is a prefix
// of target.
export function makePrefixTyper(current, target) {
	const commonPrefix = strIntersect(current, target);
	const pending = target.substr(commonPrefix.length, target.length);
	return makeTyper(current, pending, curr => curr == commonPrefix);
}
