import * as util from "../src/util"
import * as assert from "assert"

describe("util", function() {
  describe("#isFunction()", function() {
    it("Should identify functions", function() {
      assert.ok(util.isFunction(function() {}));
      assert.ok(util.isFunction(() => {}));
    });

    it("Should fail on other values", function() {
      assert.ok(!util.isFunction(null));
      assert.ok(!util.isFunction(0));
      assert.ok(!util.isFunction(""));
    });
  });

  describe("#head()", function() {
    it("Should return the first element of the array", function() {
      assert.equal(util.head([]), undefined);
      assert.equal(util.head([1]), 1);
      assert.equal(util.head([2, 1]), 2);
      assert.equal(util.head([3, 2, 1]), 3);
    });
  });

  describe("#tail()", function() {
    it("Should return the rest of the array", function() {
      assert.deepEqual(util.tail([]), []);
      assert.deepEqual(util.tail([1]), []);
      assert.deepEqual(util.tail([1, 2]), [2]);
      assert.deepEqual(util.tail([1, 2, 3]), [2, 3]);
    });
  });

  describe("#strHead()", function() {
    it("Should return the first character of the string", function() {
      assert.equal(util.strHead(""), undefined);
      assert.equal(util.strHead("c"), "c");
      assert.equal(util.strHead("bc"), "b");
      assert.equal(util.strHead("abc"), "a");
    });
  });

  describe("#strLast()", function() {
    it("Should return the last character of the string", function() {
      assert.equal(util.strLast(""), undefined);
      assert.equal(util.strLast("a"), "a");
      assert.equal(util.strLast("ab"), "b");
      assert.equal(util.strLast("abc"), "c");
    });
  });

  describe("#strTail()", function() {
    it("Should drop the first character of the string and return the rest", function() {
      assert.equal(util.strTail(""), "");
      assert.equal(util.strTail("d"), "");
      assert.equal(util.strTail("bd"), "d");
      assert.equal(util.strTail("cbd"), "bd");
      assert.equal(util.strTail("abcd"), "bcd");
    });
  });

  describe("#strDrop()", function() {
    it("Should drop the first n characters of the string", function() {
      assert.equal(util.strDrop("Hello, World", 7), "World");
      assert.equal(util.strDrop("Hello, World", 9), "rld");
      assert.equal(util.strDrop("Hello, World", 12), "");
      assert.equal(util.strDrop("Hello, World", 14), "");
    });
  });

  describe("#strDropTail()", function() {
    it("Should drop the last n characters of the string", function() {
      assert.equal(util.strDropTail("Hello, World", 6), "Hello,");
      assert.equal(util.strDropTail("Hello, World", 10), "He");
      assert.equal(util.strDropTail("Hello, World", 12), "");
      assert.equal(util.strDropTail("Hello, World", 14), "");
    });
  });

  describe("#strIntersect()", function() {
    it("Should intersect that start of the given strings", function() {
      assert.equal(util.strIntersect("a", "abc"), "a");
      assert.equal(util.strIntersect("abc", "a"), "a");
      assert.equal(util.strIntersect("", "abc"), "");
      assert.equal(util.strIntersect("abc", ""), "");
      assert.equal(util.strIntersect("Hello,", "Hello, World!"), "Hello,");
      assert.equal(util.strIntersect("Hello, World!", "Hello,"), "Hello,");
      assert.equal(util.strIntersect("abc", "bcd"), "");
      assert.equal(util.strIntersect("abcd", "ab12"), "ab");
    });
  });

  describe("#isPrefix()", function() {
    it("Should return true if the string contains the prefix", function() {
      assert.ok(util.isPrefix("abc", "abc"));
      assert.ok(util.isPrefix("abc", "abcd"));
      assert.ok(util.isPrefix("", "abc"));
    });

    it("Should return false if the string doesn't contain the prefix", function() {
      assert.ok(!util.isPrefix("abc", "abd"));
      assert.ok(!util.isPrefix("abc", "edf"));
      assert.ok(!util.isPrefix("abc", ""));
      assert.ok(!util.isPrefix("abc", "ab"));
    });
  });

  describe("#isEmpty()", function() {
    it("Should return true for emtpy strings", function() {
      assert.ok(util.isEmpty(""));
    });

    it("Should return false for non-empty strings", function() {
      assert.ok(!util.isEmpty("a"));
      assert.ok(!util.isEmpty("ab"));
      assert.ok(!util.isEmpty("abc"));
    });
  });


  describe("#makeTyper()", function() {
    it("Makes a typing function that deletes all the original string", function() {
      var typer;
      typer = util.makeTyper("abc", "def", curr => curr.length == 0);
      assert.deepEqual(typer(), {current: "abc", pending: "def", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "ab", pending: "def", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "a", pending: "def", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "", pending: "def", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "d", pending: "ef", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "de", pending: "f", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "def", pending: "", isType: true, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "def", pending: "", isType: false, isBackspace: false, isDone: true});

      typer = util.makeTyper("abc", "", curr => curr.length == 0);
      assert.deepEqual(typer(), {current: "abc", pending: "", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "ab", pending: "", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "a", pending: "", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "", pending: "", isType: false, isBackspace: true, isDone: true});
      assert.deepEqual(typer(), {current: "", pending: "", isType: false, isBackspace: false, isDone: true});

      typer = util.makeTyper("", "", curr => curr.length == 0);
      assert.deepEqual(typer(), {current: "", pending: "", isType: false, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "", pending: "", isType: false, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "", pending: "", isType: false, isBackspace: false, isDone: true});
    });

    it("Makes a typing function that deletes until a given character", function() {
      var typer = util.makeTyper("abdef", "cd", curr => util.strLast(curr) == 'b');
      assert.deepEqual(typer(), {current: "abdef", pending: "cd", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "abde", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "abd", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "ab", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "abc", pending: "d", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "abcd", pending: "", isType: true, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "abcd", pending: "", isType: false, isBackspace: false, isDone: true});
    });

    it("Makes a typing function that deletes until curr equals something", function() {
      var typer = util.makeTyper("ab34", "cd", curr => curr == "ab");
      assert.deepEqual(typer(), {current: "ab34", pending: "cd", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "ab3", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "ab", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "abc", pending: "d", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "abcd", pending: "", isType: true, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "abcd", pending: "", isType: false, isBackspace: false, isDone: true});
    });
  });

  describe("#makePrefixTyper()", function() {
    it("Should delete until common prefix", function() {
      var typer;

      typer = util.makePrefixTyper("ab12", "abcd");
      assert.deepEqual(typer(), {current: "ab12", pending: "cd", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "ab1", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "ab", pending: "cd", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "abc", pending: "d", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "abcd", pending: "", isType: true, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "abcd", pending: "", isType: false, isBackspace: false, isDone: true});

      typer = util.makePrefixTyper("abcd", "1234");
      assert.deepEqual(typer(), {current: "abcd", pending: "1234", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "abc", pending: "1234", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "ab", pending: "1234", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "a", pending: "1234", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "", pending: "1234", isType: false, isBackspace: true, isDone: false});
      assert.deepEqual(typer(), {current: "1", pending: "234", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "12", pending: "34", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "123", pending: "4", isType: true, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "1234", pending: "", isType: true, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "1234", pending: "", isType: false, isBackspace: false, isDone: true});

      typer = util.makePrefixTyper("abcd", "abcde");
      assert.deepEqual(typer(), {current: "abcd", pending: "e", isType: false, isBackspace: false, isDone: false});
      assert.deepEqual(typer(), {current: "abcde", pending: "", isType: true, isBackspace: false, isDone: true});
      assert.deepEqual(typer(), {current: "abcde", pending: "", isType: false, isBackspace: false, isDone: true});
    });
  });
});
