import type { LessonDraft } from '../types';

/**
 * The second half of the Python track: the difference between writing
 * JavaScript with different punctuation and writing Python.
 *
 * From here the lessons are test-graded, using the Python harness
 * (assert_equal / assert_raises / @test) rather than stdout matching.
 */
export const PY_PRO_LESSONS: LessonDraft[] = [
  {
    id: 'py-10-comprehensions',
    title: 'Comprehensions',
    language: 'python',
    module: 'Idiomatic Python',
    difficulty: 3,
    concepts: ['comprehensions', 'idioms', 'lists', 'dicts'],
    instructions: `From here on the Python lessons are graded by **tests** rather than by matching printed output — the same way the JavaScript track works. Write the functions; the suite below the editor tells you whether they behave.

A comprehension builds a collection in one expression. It is the most visible marker of Python written by someone who knows Python.

\`\`\`python
# the loop you already know
squares = []
for n in nums:
    squares.append(n * n)

# the comprehension
squares = [n * n for n in nums]
\`\`\`

Read it left to right as a sentence: *"n times n, for each n in nums."* The expression comes first, which feels backwards for about a day and then stops.

### Filtering

Add \`if\` at the end to keep only some items:

\`\`\`python
evens = [n for n in nums if n % 2 == 0]
\`\`\`

That is \`filter\` and \`map\` in one line — and unlike the JavaScript equivalent, there is no callback, so there is nothing to allocate per item.

### The other three kinds

\`\`\`python
{w: len(w) for w in words}          # dict comprehension
{w[0] for w in names}               # set comprehension — duplicates collapse
(n * n for n in nums)               # generator: lazy, computes on demand
\`\`\`

The braces decide: brackets give a list, braces with a colon give a dict, braces without give a set.

> Know when to stop. A comprehension with two \`for\` clauses and a conditional is harder to read than the loop it replaced. The rule professionals use: if it does not fit comfortably on one line, write the loop.

## YOUR TASK

Four functions, each a single comprehension — no \`for\` statements, no \`append\`.

1. \`squares(nums)\` — each number squared, in order
2. \`evens(nums)\` — only the even numbers, in order
3. \`word_lengths(words)\` — a dict mapping each word to its length
4. \`initials(names)\` — a **set** of the first letters, uppercased`,
    starterCode: `def squares(nums):
    pass


def evens(nums):
    pass


def word_lengths(words):
    pass


def initials(names):
    pass
`,
    testCode: `@test("squares each number")
def _():
    assert_equal(squares([1, 2, 3]), [1, 4, 9])
    assert_equal(squares([]), [])
    assert_equal(squares([-3]), [9])

@test("evens keeps only even numbers, in order")
def _():
    assert_equal(evens([1, 2, 3, 4, 5, 6]), [2, 4, 6])
    assert_equal(evens([1, 3]), [])
    assert_equal(evens([0, -2]), [0, -2])

@test("word_lengths maps each word to its length")
def _():
    assert_equal(word_lengths(["hi", "there"]), {"hi": 2, "there": 5})
    assert_equal(word_lengths([]), {})

@test("initials returns a set of uppercase first letters")
def _():
    assert_equal(initials(["ada", "alan", "grace"]), {"A", "G"})
    assert_equal(initials([]), set())

@test("initials really returns a set, not a list")
def _():
    assert_true(isinstance(initials(["ada"]), set))
`,
    hints: [
      'The shape is `[expression for item in collection]`.',
      'A filter goes on the end: `[n for n in nums if n % 2 == 0]`.',
      'For the dict use `{w: len(w) for w in words}`; for the set use braces with no colon and `name[0].upper()`.',
    ],
    solution: `def squares(nums):
    return [n * n for n in nums]


def evens(nums):
    return [n for n in nums if n % 2 == 0]


def word_lengths(words):
    return {w: len(w) for w in words}


def initials(names):
    return {name[0].upper() for name in names}
`,
  },
  {
    id: 'py-11-slicing',
    title: 'Slicing',
    language: 'python',
    module: 'Idiomatic Python',
    difficulty: 3,
    concepts: ['slicing', 'indexing', 'strings', 'copying'],
    instructions: `Slicing pulls a section out of any sequence — list, string, tuple — with one piece of syntax.

\`\`\`python
items = [0, 1, 2, 3, 4, 5]

items[1:4]      # [1, 2, 3]     start included, stop excluded
items[:3]       # [0, 1, 2]     from the beginning
items[3:]       # [3, 4, 5]     to the end
items[:]        # a full copy
\`\`\`

Stop being excluded is the same rule as \`range\`, and it means \`items[:n]\` and \`items[n:]\` fit together perfectly with no overlap and no gap.

### Negative indices count from the right

\`\`\`python
items[-1]       # 5    the last item
items[-2]       # 4
items[:-1]      # everything except the last
items[1:-1]     # everything except the first and last
\`\`\`

\`items[-1]\` replaces JavaScript's \`items[items.length - 1]\`, and it is a real quality-of-life difference.

### The third number is a step

\`\`\`python
items[::2]      # [0, 2, 4]     every other one
items[::-1]     # [5, 4, 3, 2, 1, 0]   reversed
\`\`\`

\`s[::-1]\` reversing a string is the standard Python idiom, and it will come up.

### Slices never raise

\`\`\`python
items[10]       # IndexError
items[10:20]    # []  — no error
\`\`\`

Indexing past the end crashes; slicing past the end just gives you less. That asymmetry is worth remembering, because it makes slices safe on input you have not checked.

> Strings are **immutable**: slicing gives you a new string, and there is no way to change one in place. \`s[0] = "x"\` is an error, not a typo.

## YOUR TASK

1. \`first_last(items)\` — a tuple \`(first, last)\`, or \`None\` when empty
2. \`middle(items)\` — everything except the first and last item
3. \`every_other(items)\` — items at positions 0, 2, 4 …
4. \`reverse_text(s)\` — the string reversed
5. \`is_palindrome(s)\` — ignoring case and spaces

Use slicing rather than loops.`,
    starterCode: `def first_last(items):
    pass


def middle(items):
    pass


def every_other(items):
    pass


def reverse_text(s):
    pass


def is_palindrome(s):
    pass
`,
    testCode: `@test("first_last returns both ends as a tuple")
def _():
    assert_equal(first_last([1, 2, 3]), (1, 3))
    assert_equal(first_last(["only"]), ("only", "only"))

@test("first_last returns None when empty")
def _():
    assert_equal(first_last([]), None)

@test("middle drops the first and last item")
def _():
    assert_equal(middle([1, 2, 3, 4]), [2, 3])
    assert_equal(middle([1, 2]), [])
    assert_equal(middle([]), [])

@test("every_other takes positions 0, 2, 4")
def _():
    assert_equal(every_other([1, 2, 3, 4, 5]), [1, 3, 5])
    assert_equal(every_other([]), [])

@test("reverse_text reverses a string")
def _():
    assert_equal(reverse_text("python"), "nohtyp")
    assert_equal(reverse_text(""), "")

@test("is_palindrome ignores case and spaces")
def _():
    assert_true(is_palindrome("Never odd or even"))
    assert_true(is_palindrome("racecar"))
    assert_false(is_palindrome("python"))

@test("is_palindrome treats the empty string as a palindrome")
def _():
    assert_true(is_palindrome(""))
`,
    hints: [
      '`items[0]` and `items[-1]` give you both ends — but check for the empty case first.',
      '`middle` is `items[1:-1]`, which already returns `[]` for short lists without any special handling.',
      'For the palindrome, build the cleaned string with `s.lower().replace(" ", "")` and compare it against its own reverse.',
    ],
    solution: `def first_last(items):
    if not items:
        return None
    return (items[0], items[-1])


def middle(items):
    return items[1:-1]


def every_other(items):
    return items[::2]


def reverse_text(s):
    return s[::-1]


def is_palindrome(s):
    clean = s.lower().replace(" ", "")
    return clean == clean[::-1]
`,
  },
  {
    id: 'py-12-unpacking',
    title: 'Tuples, Unpacking and Flexible Arguments',
    language: 'python',
    module: 'Idiomatic Python',
    difficulty: 3,
    concepts: ['tuples', 'unpacking', 'args-kwargs', 'zip', 'enumerate'],
    instructions: `### Tuples

A tuple is an immutable sequence, written with commas:

\`\`\`python
point = (3, 4)
point[0]            # 3
point[0] = 9        # TypeError — tuples cannot be changed
\`\`\`

Because they cannot change, tuples are used for things that belong together as one value — coordinates, database rows, a pair of results. Returning several values is really returning a tuple:

\`\`\`python
def min_max(nums):
    return min(nums), max(nums)      # the parentheses are optional
\`\`\`

### Unpacking

\`\`\`python
low, high = min_max([3, 1, 4])       # low = 1, high = 4
a, b = b, a                          # swap, with no temporary variable
first, *rest = [1, 2, 3, 4]          # first = 1, rest = [2, 3, 4]
\`\`\`

The star collects whatever is left, and it always produces a **list**, even when unpacking a tuple.

### enumerate and zip

Two functions that eliminate most manual index handling:

\`\`\`python
for i, name in enumerate(names, start=1):
    print(f"{i}. {name}")

for name, score in zip(names, scores):
    print(f"{name}: {score}")
\`\`\`

\`enumerate\` gives you position and value together. \`zip\` walks several sequences in step, stopping at the shortest — writing \`for i in range(len(names))\` and indexing everything is the tell of someone who has not met these yet.

### \`*args\` and \`**kwargs\`

\`\`\`python
def log(*args, **kwargs):
    # args   is a tuple of the positional arguments
    # kwargs is a dict of the keyword arguments
\`\`\`

Same star, other direction: in a definition it collects, at a call site it spreads (\`f(*items)\`).

## YOUR TASK

1. \`min_max(nums)\` — a tuple \`(smallest, largest)\`, or \`None\` when empty
2. \`head_tail(items)\` — a tuple \`(first, rest_as_list)\`; \`(None, [])\` when empty
3. \`numbered(items)\` — \`["1. a", "2. b", …]\` using \`enumerate\`
4. \`score_pairs(names, scores)\` — a list of \`(name, score)\` tuples using \`zip\`
5. \`tally(**kwargs)\` — the sum of all the keyword argument values`,
    starterCode: `def min_max(nums):
    pass


def head_tail(items):
    pass


def numbered(items):
    pass


def score_pairs(names, scores):
    pass


def tally(**kwargs):
    pass
`,
    testCode: `@test("min_max returns both extremes")
def _():
    assert_equal(min_max([3, 1, 4, 1, 5]), (1, 5))
    assert_equal(min_max([7]), (7, 7))

@test("min_max returns None when empty")
def _():
    assert_equal(min_max([]), None)

@test("head_tail splits off the first item")
def _():
    assert_equal(head_tail([1, 2, 3]), (1, [2, 3]))
    assert_equal(head_tail(["only"]), ("only", []))

@test("head_tail handles the empty case")
def _():
    assert_equal(head_tail([]), (None, []))

@test("numbered starts counting at one")
def _():
    assert_equal(numbered(["a", "b"]), ["1. a", "2. b"])
    assert_equal(numbered([]), [])

@test("score_pairs zips the two lists")
def _():
    assert_equal(score_pairs(["a", "b"], [1, 2]), [("a", 1), ("b", 2)])

@test("score_pairs stops at the shorter list")
def _():
    assert_equal(score_pairs(["a", "b", "c"], [1]), [("a", 1)])
    assert_equal(score_pairs([], [1, 2]), [])

@test("tally adds up the keyword values")
def _():
    assert_equal(tally(a=1, b=2, c=3), 6)
    assert_equal(tally(), 0)
`,
    hints: [
      '`min()` and `max()` are built in — `return min(nums), max(nums)` already builds a tuple.',
      'For `head_tail`, `first, *rest = items` unpacks in one line, but it raises on an empty list, so guard first.',
      '`numbered` is a comprehension over `enumerate(items, start=1)`, and `tally` is `sum(kwargs.values())`.',
    ],
    solution: `def min_max(nums):
    if not nums:
        return None
    return min(nums), max(nums)


def head_tail(items):
    if not items:
        return (None, [])
    first, *rest = items
    return (first, rest)


def numbered(items):
    return [f"{i}. {item}" for i, item in enumerate(items, start=1)]


def score_pairs(names, scores):
    return list(zip(names, scores))


def tally(**kwargs):
    return sum(kwargs.values())
`,
  },
  {
    id: 'py-13-dict-tools',
    title: 'Working With Dictionaries',
    language: 'python',
    module: 'Working With Data',
    difficulty: 4,
    concepts: ['dictionaries', 'counter', 'setdefault', 'sorting-by-key'],
    instructions: `Dictionaries are the workhorse of Python data code. A few methods turn awkward loops into one-liners.

### \`.get\` — a default instead of a crash

\`\`\`python
counts[word]              # KeyError if the word is new
counts.get(word, 0)       # 0 instead
counts[word] = counts.get(word, 0) + 1
\`\`\`

That third line is the counting idiom, and you will write it constantly.

### Grouping with \`.setdefault\`

\`\`\`python
groups.setdefault(key, []).append(item)
\`\`\`

"Give me the list at this key, creating an empty one if it is missing, then append." One line, no \`if key not in groups\` first.

### The collections module

\`\`\`python
from collections import Counter, defaultdict

Counter(words)                 # {"a": 3, "b": 1} in one call
Counter(words).most_common(2)  # the two most frequent, as (value, count) pairs

groups = defaultdict(list)
groups[key].append(item)       # the empty list appears on demand
\`\`\`

\`Counter\` is the standard-library answer to the frequency problem the algorithms track solves by hand. Knowing both matters: the hand-written version for interviews, \`Counter\` for real work.

### Iterating

\`\`\`python
for key in d:              # keys
for value in d.values():
for key, value in d.items():
\`\`\`

### Sorting by a computed key

\`\`\`python
sorted(words, key=len)                        # by length
sorted(items, key=lambda x: x["rate"])        # by a field
sorted(counts.items(), key=lambda kv: -kv[1]) # by count, descending
\`\`\`

\`key\` takes a function producing the value to compare by. It is the same job as a JavaScript comparator, done more directly — you say what to sort *by*, not how to compare two things. \`sorted\` returns a new list; \`.sort()\` changes one in place.

## YOUR TASK

1. \`count_words(text)\` — a dict of word to count, splitting on whitespace, lowercased
2. \`group_by_length(words)\` — a dict of length to the list of words with that length, in order
3. \`top_words(text, n)\` — the \`n\` most common words as a list of \`(word, count)\` tuples, most frequent first, ties broken alphabetically
4. \`invert(d)\` — swap keys and values`,
    starterCode: `def count_words(text):
    pass


def group_by_length(words):
    pass


def top_words(text, n):
    pass


def invert(d):
    pass
`,
    testCode: `@test("count_words counts each word")
def _():
    assert_equal(count_words("a b a"), {"a": 2, "b": 1})
    assert_equal(count_words(""), {})

@test("count_words lowercases and splits on any whitespace")
def _():
    assert_equal(count_words("The the  THE"), {"the": 3})

@test("group_by_length groups words by their length")
def _():
    assert_equal(
        group_by_length(["hi", "at", "cat", "a"]),
        {2: ["hi", "at"], 3: ["cat"], 1: ["a"]},
    )
    assert_equal(group_by_length([]), {})

@test("top_words returns the most frequent first")
def _():
    assert_equal(top_words("a b a c a b", 2), [("a", 3), ("b", 2)])

@test("top_words breaks ties alphabetically")
def _():
    assert_equal(top_words("b a", 2), [("a", 1), ("b", 1)])

@test("top_words copes with n larger than the vocabulary")
def _():
    assert_equal(top_words("a", 5), [("a", 1)])
    assert_equal(top_words("", 3), [])

@test("invert swaps keys and values")
def _():
    assert_equal(invert({"a": 1, "b": 2}), {1: "a", 2: "b"})
    assert_equal(invert({}), {})
`,
    hints: [
      '`text.lower().split()` handles the lowercasing and the whitespace splitting in one step — `split()` with no argument collapses runs of spaces.',
      'For grouping, `groups.setdefault(len(word), []).append(word)` is the whole loop body.',
      'For `top_words`, sort the `.items()` with a key returning a tuple: `(-count, word)` sorts by count descending and then alphabetically.',
    ],
    solution: `def count_words(text):
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts


def group_by_length(words):
    groups = {}
    for word in words:
        groups.setdefault(len(word), []).append(word)
    return groups


def top_words(text, n):
    counts = count_words(text)
    ordered = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    return ordered[:n]


def invert(d):
    return {value: key for key, value in d.items()}
`,
  },
  {
    id: 'py-14-exceptions',
    title: 'Exceptions the Python Way',
    language: 'python',
    module: 'Robust Python',
    difficulty: 4,
    concepts: ['exceptions', 'eafp', 'custom-errors', 'finally'],
    instructions: `Python leans on exceptions far more than JavaScript does, and it has a name for the style:

**EAFP** — *easier to ask forgiveness than permission*. Try the thing, handle the failure.

\`\`\`python
# LBYL: look before you leap (the habit you bring from JavaScript)
if key in config and isinstance(config[key], int):
    port = config[key]
else:
    port = 8080

# EAFP: the Python way
try:
    port = int(config[key])
except (KeyError, ValueError, TypeError):
    port = 8080
\`\`\`

Both work. The second is preferred in Python because it states the intent once instead of enumerating every way the intent could fail — and because between the check and the use, the world can change.

### Catch what you mean

\`\`\`python
except Exception:      # too broad — hides real bugs
except ValueError:     # right
except (ValueError, TypeError):
\`\`\`

A bare \`except:\` also swallows Ctrl-C and system exit. It is essentially never what you want.

### The full shape

\`\`\`python
try:
    result = risky()
except ValueError as err:
    print(f"bad value: {err}")
    raise                       # re-raise after logging
else:
    print("only runs if nothing was raised")
finally:
    cleanup()                   # always runs
\`\`\`

The \`else\` block is a Python speciality: it holds the code that should only run on success, without wrapping it in the \`try\` where its own exceptions would be caught by mistake.

### Your own exception types

\`\`\`python
class ValidationError(Exception):
    def __init__(self, field, message):
        super().__init__(message)
        self.field = field
\`\`\`

Callers can then catch precisely what they can handle and let everything else travel upward, which is the point.

## YOUR TASK

1. A \`ValidationError\` class extending \`Exception\`, taking \`(field, message)\` and storing \`field\`
2. \`parse_age(text)\` — an int between 0 and 130. Raises \`ValidationError("age", ...)\` for anything else, including non-numeric text
3. \`safe_divide(a, b)\` — the quotient, or \`None\` on division by zero
4. \`first_valid(values)\` — the first value that \`parse_age\` accepts, or \`None\``,
    starterCode: `class ValidationError(Exception):
    def __init__(self, field, message):
        pass


def parse_age(text):
    pass


def safe_divide(a, b):
    pass


def first_valid(values):
    pass
`,
    testCode: `@test("parse_age accepts a valid number")
def _():
    assert_equal(parse_age("30"), 30)
    assert_equal(parse_age("0"), 0)
    assert_equal(parse_age(130), 130)

@test("parse_age rejects non-numeric text")
def _():
    assert_raises(lambda: parse_age("thirty"), ValidationError)
    assert_raises(lambda: parse_age(""), ValidationError)
    assert_raises(lambda: parse_age(None), ValidationError)

@test("parse_age rejects out-of-range values")
def _():
    assert_raises(lambda: parse_age("-1"), ValidationError)
    assert_raises(lambda: parse_age("131"), ValidationError)

@test("the raised error carries the field and is an Exception")
def _():
    try:
        parse_age("nope")
        raise AssertionFail("expected a ValidationError")
    except ValidationError as err:
        assert_equal(err.field, "age")
        assert_true(isinstance(err, Exception))

@test("safe_divide divides")
def _():
    assert_equal(safe_divide(10, 2), 5)
    assert_close(safe_divide(1, 3), 0.3333, places=3)

@test("safe_divide returns None on division by zero")
def _():
    assert_equal(safe_divide(1, 0), None)

@test("first_valid finds the first acceptable value")
def _():
    assert_equal(first_valid(["x", "-2", "44", "50"]), 44)
    assert_equal(first_valid([200, "9"]), 9)

@test("first_valid returns None when nothing is valid")
def _():
    assert_equal(first_valid(["x", "y"]), None)
    assert_equal(first_valid([]), None)
`,
    hints: [
      'In `__init__`, call `super().__init__(message)` first, then set `self.field = field`.',
      '`int(text)` raises `ValueError` for bad text and `TypeError` for `None` — catch both and re-raise as your own `ValidationError`.',
      'For `first_valid`, loop and wrap each `parse_age` call in try/except, returning on the first success.',
    ],
    solution: `class ValidationError(Exception):
    def __init__(self, field, message):
        super().__init__(message)
        self.field = field


def parse_age(text):
    try:
        age = int(text)
    except (ValueError, TypeError):
        raise ValidationError("age", f"{text!r} is not a number")

    if age < 0 or age > 130:
        raise ValidationError("age", f"{age} is out of range")

    return age


def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None


def first_valid(values):
    for value in values:
        try:
            return parse_age(value)
        except ValidationError:
            continue
    return None
`,
  },
  {
    id: 'py-15-classes',
    title: 'Classes and Dunder Methods',
    language: 'python',
    module: 'Structuring Code',
    difficulty: 4,
    concepts: ['classes', 'dunder-methods', 'properties', 'operator-overloading'],
    instructions: `Python classes look familiar after the JavaScript track, with two differences that matter.

\`\`\`python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self
\`\`\`

**\`self\` is explicit.** Every method takes it as its first parameter, and Python passes it for you when you call \`account.deposit(50)\`. Forgetting it is the classic beginner error.

**Nothing is truly private.** The convention is a leading underscore — \`self._internal\` means "do not touch this from outside", enforced by professional courtesy rather than the language.

### Dunder methods

Double-underscore methods hook your class into Python's own syntax. This is the part with no real JavaScript equivalent.

\`\`\`python
class Money:
    def __init__(self, amount, currency="USD"):
        self.amount = amount
        self.currency = currency

    def __repr__(self):
        return f"Money({self.amount}, {self.currency!r})"

    def __eq__(self, other):
        return self.amount == other.amount and self.currency == other.currency

    def __add__(self, other):
        return Money(self.amount + other.amount, self.currency)
\`\`\`

Now \`m1 + m2\` works, \`m1 == m2\` compares by value instead of by identity, and printing the object shows something useful instead of \`<Money object at 0x7f…>\`.

\`__repr__\` should look like the code that would recreate the object — that is why the \`!r\` conversion is used on the currency, so strings keep their quotes. Writing a good \`__repr__\` on every class you own pays for itself the first time you debug one.

### Properties

\`\`\`python
@property
def dollars(self):
    return self.amount / 100
\`\`\`

A method that reads as an attribute: \`m.dollars\`, no parentheses. It lets you turn a stored value into a computed one later without changing a single caller.

## YOUR TASK

A \`Money\` class holding an integer number of **cents**:

- \`__init__(self, cents, currency="USD")\`
- \`__repr__\` → exactly \`Money(1050, 'USD')\`
- \`__eq__\` → equal when both cents and currency match; \`False\` against a non-Money
- \`__add__\` → a new \`Money\`; raises \`ValueError\` when the currencies differ
- \`dollars\` property → cents divided by 100
- \`from_dollars\` classmethod → \`Money.from_dollars(10.5)\` gives 1050 cents`,
    starterCode: `class Money:
    def __init__(self, cents, currency="USD"):
        pass

    def __repr__(self):
        pass

    def __eq__(self, other):
        pass

    def __add__(self, other):
        pass

    @property
    def dollars(self):
        pass

    @classmethod
    def from_dollars(cls, amount, currency="USD"):
        pass
`,
    testCode: `@test("stores cents and a currency")
def _():
    m = Money(1050)
    assert_equal(m.cents, 1050)
    assert_equal(m.currency, "USD")
    assert_equal(Money(500, "GBP").currency, "GBP")

@test("repr looks like the constructor call")
def _():
    assert_equal(repr(Money(1050)), "Money(1050, 'USD')")
    assert_equal(repr(Money(5, "EUR")), "Money(5, 'EUR')")

@test("equality compares by value")
def _():
    assert_equal(Money(100), Money(100))
    assert_not_equal(Money(100), Money(200))
    assert_not_equal(Money(100, "USD"), Money(100, "GBP"))

@test("equality against a non-Money is False, not an error")
def _():
    assert_false(Money(100) == 100)
    assert_false(Money(100) == "Money(100)")

@test("adding produces a new Money")
def _():
    total = Money(100) + Money(250)
    assert_equal(total, Money(350))
    assert_true(isinstance(total, Money))

@test("adding different currencies is refused")
def _():
    assert_raises(lambda: Money(100, "USD") + Money(100, "GBP"), ValueError)

@test("dollars is a property, not a method")
def _():
    assert_close(Money(1050).dollars, 10.5)
    assert_close(Money(5).dollars, 0.05)

@test("from_dollars builds from a dollar amount")
def _():
    assert_equal(Money.from_dollars(10.5), Money(1050))
    assert_equal(Money.from_dollars(0), Money(0))
    assert_equal(Money.from_dollars(2, "GBP"), Money(200, "GBP"))
`,
    hints: [
      'In `__repr__` use an f-string with `!r` on the currency so it keeps its quotes: `f"Money({self.cents}, {self.currency!r})"`.',
      'In `__eq__`, check `isinstance(other, Money)` first and return `False` if not — otherwise comparing against a number raises AttributeError.',
      '`from_dollars` is a classmethod, so it receives `cls`: `return cls(round(amount * 100), currency)`.',
    ],
    solution: `class Money:
    def __init__(self, cents, currency="USD"):
        self.cents = cents
        self.currency = currency

    def __repr__(self):
        return f"Money({self.cents}, {self.currency!r})"

    def __eq__(self, other):
        if not isinstance(other, Money):
            return False
        return self.cents == other.cents and self.currency == other.currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("cannot add different currencies")
        return Money(self.cents + other.cents, self.currency)

    @property
    def dollars(self):
        return self.cents / 100

    @classmethod
    def from_dollars(cls, amount, currency="USD"):
        return cls(round(amount * 100), currency)
`,
  },
  {
    id: 'py-16-dataclasses',
    title: 'Dataclasses and Type Hints',
    language: 'python',
    module: 'Structuring Code',
    difficulty: 3,
    concepts: ['dataclasses', 'type-hints', 'immutability'],
    instructions: `Most classes exist only to hold a few fields. Writing \`__init__\`, \`__repr__\` and \`__eq__\` by hand for those is pure ceremony, so Python generates them:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Booking:
    guest: str
    nights: int
    rate: int = 100        # a default, like any parameter
\`\`\`

That gives you the constructor, a useful \`repr\`, and value equality for free. The equivalent hand-written class is about fifteen lines.

### Type hints

\`guest: str\` is a **type hint**. Python does not enforce it at runtime — passing an int works fine — but it is not decoration:

- editors use it for autocomplete and to flag mistakes as you type
- \`mypy\` and \`pyright\` check them properly, the way \`tsc\` checks TypeScript
- for dataclasses specifically, the annotation is what *declares the field*

That last point is the gotcha: a dataclass attribute without an annotation is a plain class attribute and does not become a field at all.

### The mutable default trap

\`\`\`python
@dataclass
class Cart:
    items: list = []              # ValueError, and Python is saving you
    items: list = field(default_factory=list)   # correct
\`\`\`

This is the single most famous Python gotcha. A default value is evaluated **once**, when the function or class is defined — so a mutable default is shared by every instance, and one cart's items appear in another's. Dataclasses refuse outright; plain functions do not, which is why \`def f(items=[])\` is a real bug you will meet in the wild.

### frozen

\`\`\`python
@dataclass(frozen=True)
class Point:
    x: int
    y: int
\`\`\`

Assignment now raises, and the object becomes hashable so it can go in a set or be a dict key. Reach for it whenever a value should not change after construction.

## YOUR TASK

1. A \`Booking\` dataclass with \`guest: str\`, \`nights: int\`, \`rate: int = 100\`, and \`extras: list\` defaulting to a **fresh empty list per instance**
2. A \`total\` property returning \`nights * rate\` plus the sum of \`extras\`
3. A frozen \`Point\` dataclass with \`x: int\` and \`y: int\`
4. \`unique_points(points)\` — the distinct points as a **set**, which only works because \`Point\` is frozen`,
    starterCode: `from dataclasses import dataclass, field


@dataclass
class Booking:
    pass


@dataclass(frozen=True)
class Point:
    pass


def unique_points(points):
    pass
`,
    testCode: `@test("Booking has fields and a default rate")
def _():
    b = Booking("Ada", 3)
    assert_equal(b.guest, "Ada")
    assert_equal(b.nights, 3)
    assert_equal(b.rate, 100)
    assert_equal(b.extras, [])

@test("Booking compares by value and reprs usefully")
def _():
    assert_equal(Booking("Ada", 3), Booking("Ada", 3))
    assert_not_equal(Booking("Ada", 3), Booking("Ada", 4))
    assert_in("Ada", repr(Booking("Ada", 3)))

@test("each Booking gets its own extras list")
def _():
    a = Booking("Ada", 1)
    b = Booking("Alan", 1)
    a.extras.append(50)
    assert_equal(a.extras, [50])
    assert_equal(b.extras, [])

@test("total combines nights, rate and extras")
def _():
    assert_equal(Booking("Ada", 3, 200).total, 600)
    assert_equal(Booking("Ada", 2, 100, [25, 15]).total, 240)

@test("Point is frozen")
def _():
    p = Point(1, 2)
    assert_equal(p.x, 1)
    def mutate():
        p.x = 9
    assert_raises(mutate, Exception)

@test("frozen points can live in a set")
def _():
    assert_equal(unique_points([Point(1, 2), Point(1, 2), Point(3, 4)]),
                 {Point(1, 2), Point(3, 4)})
    assert_equal(unique_points([]), set())
`,
    hints: [
      'Each dataclass field needs a type annotation — an attribute without one is not a field.',
      'The list default must be `extras: list = field(default_factory=list)`, never `= []`.',
      '`total` is an ordinary `@property` inside the dataclass: `return self.nights * self.rate + sum(self.extras)`.',
    ],
    solution: `from dataclasses import dataclass, field


@dataclass
class Booking:
    guest: str
    nights: int
    rate: int = 100
    extras: list = field(default_factory=list)

    @property
    def total(self):
        return self.nights * self.rate + sum(self.extras)


@dataclass(frozen=True)
class Point:
    x: int
    y: int


def unique_points(points):
    return set(points)
`,
  },
  {
    id: 'py-17-generators',
    title: 'Generators and Laziness',
    language: 'python',
    module: 'Working With Data',
    difficulty: 4,
    concepts: ['generators', 'yield', 'iterators', 'memory'],
    instructions: `A function with \`yield\` in it is a **generator**. Calling it runs no code at all — it hands back an object that produces values one at a time, on demand.

\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for value in countdown(3):
    print(value)        # 3, 2, 1
\`\`\`

\`yield\` suspends the function, handing a value to whoever is looping. When the loop asks for the next one, execution resumes on the line after the \`yield\`, with every local variable still intact.

### Why it matters: memory

\`\`\`python
lines = [transform(line) for line in read_file()]   # the whole file in memory
lines = (transform(line) for line in read_file())   # one line at a time
\`\`\`

One character apart. The first builds a complete list — impossible on a 10GB file. The second processes one item at a time and never holds more than one. Processing data larger than memory is the everyday use, and it is why generators exist.

### They can be infinite

\`\`\`python
def naturals():
    n = 0
    while True:
        n += 1
        yield n
\`\`\`

Perfectly safe, because nothing is computed until something asks. Combine with a function that stops early and you have a stream:

\`\`\`python
from itertools import islice
list(islice(naturals(), 5))     # [1, 2, 3, 4, 5]
\`\`\`

### The cost

A generator is **single use**. Once exhausted it is empty, and there is no \`len()\` and no indexing:

\`\`\`python
g = countdown(3)
list(g)     # [3, 2, 1]
list(g)     # []  — already consumed
\`\`\`

If you need the data twice, or need its length, you want a list. That is the trade.

## YOUR TASK

1. \`countdown(n)\` — a generator yielding \`n\` down to 1
2. \`take(iterable, n)\` — a **list** of the first \`n\` items, working on infinite generators
3. \`batches(items, size)\` — a generator yielding lists of at most \`size\` items
4. \`running_total(nums)\` — a generator yielding the cumulative sum so far`,
    starterCode: `def countdown(n):
    pass


def take(iterable, n):
    pass


def batches(items, size):
    pass


def running_total(nums):
    pass
`,
    testCode: `def naturals():
    n = 0
    while True:
        n += 1
        yield n

@test("countdown counts down and stops")
def _():
    assert_equal(list(countdown(3)), [3, 2, 1])
    assert_equal(list(countdown(1)), [1])
    assert_equal(list(countdown(0)), [])

@test("countdown is a generator, not a list")
def _():
    import types
    assert_true(isinstance(countdown(3), types.GeneratorType))

@test("take returns the first n items as a list")
def _():
    assert_equal(take([1, 2, 3, 4], 2), [1, 2])
    assert_equal(take([1], 5), [1])
    assert_equal(take([], 3), [])

@test("take works on an infinite generator")
def _():
    assert_equal(take(naturals(), 4), [1, 2, 3, 4])

@test("batches chunks the items")
def _():
    assert_equal(list(batches([1, 2, 3, 4, 5], 2)), [[1, 2], [3, 4], [5]])
    assert_equal(list(batches([1, 2], 5)), [[1, 2]])
    assert_equal(list(batches([], 3)), [])

@test("running_total yields the cumulative sum")
def _():
    assert_equal(list(running_total([1, 2, 3])), [1, 3, 6])
    assert_equal(list(running_total([])), [])
    assert_equal(list(running_total([5])), [5])
`,
    hints: [
      '`countdown` is a `while` loop containing `yield n` followed by `n -= 1`.',
      'For `take`, loop with `enumerate` and `break` once you have enough — never call `list()` on an infinite generator.',
      '`batches` collects into a temporary list, yields it when it reaches `size`, resets it, and yields any remainder after the loop.',
    ],
    solution: `def countdown(n):
    while n > 0:
        yield n
        n -= 1


def take(iterable, n):
    out = []
    for item in iterable:
        if len(out) >= n:
            break
        out.append(item)
    return out


def batches(items, size):
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch


def running_total(nums):
    total = 0
    for n in nums:
        total += n
        yield total
`,
  },
  {
    id: 'py-18-context-managers',
    title: 'with, and Cleaning Up After Yourself',
    language: 'python',
    module: 'Robust Python',
    difficulty: 4,
    concepts: ['context-managers', 'with', 'resources', 'cleanup'],
    instructions: `Anything you open must be closed — files, database connections, network sockets, locks. Doing it by hand is unreliable, because an exception skips your cleanup:

\`\`\`python
f = open("data.txt")
process(f)          # if this raises, the file is never closed
f.close()
\`\`\`

\`with\` fixes it:

\`\`\`python
with open("data.txt") as f:
    process(f)
# closed here, whether process succeeded or raised
\`\`\`

This is the standard way to read a file in Python, and using bare \`open\` without \`with\` is a review comment waiting to happen.

### Writing your own

Any object with \`__enter__\` and \`__exit__\` works with \`with\`:

\`\`\`python
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self              # this is what "as t" receives

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.time() - self.start
        return False             # False lets any exception propagate
\`\`\`

Two details to get right:

- \`__enter__\` returns whatever should be bound by \`as\`. Returning \`self\` is usual.
- \`__exit__\` receives details of any exception that occurred, and its **return value decides whether to suppress it**. Returning \`True\` swallows the exception — almost always wrong. Return \`False\` (or nothing, which is \`None\` and falsy) so errors keep travelling.

\`__exit__\` runs either way, which is the whole point: cleanup is guaranteed.

> \`contextlib.contextmanager\` lets you write one as a generator instead, with a single \`yield\` where the body goes. Worth knowing once the class version is clear.

## YOUR TASK

1. A \`Collector\` context manager that gathers messages:
   - \`__enter__\` returns the collector itself
   - \`add(message)\` appends
   - \`__exit__\` sets \`self.closed = True\` and must **not** suppress exceptions
2. \`collect_safely(messages)\` — uses \`Collector\` in a \`with\` block, adds every message, and returns the list. If a message is not a string it should raise \`TypeError\` — and the collector must still end up closed.`,
    starterCode: `class Collector:
    def __init__(self):
        self.messages = []
        self.closed = False

    def __enter__(self):
        pass

    def add(self, message):
        pass

    def __exit__(self, exc_type, exc_value, traceback):
        pass


def collect_safely(messages):
    pass
`,
    testCode: `@test("the collector gathers messages")
def _():
    with Collector() as c:
        c.add("one")
        c.add("two")
    assert_equal(c.messages, ["one", "two"])

@test("enter returns the collector itself")
def _():
    c = Collector()
    with c as entered:
        assert_true(entered is c)

@test("closed is False inside the block and True after")
def _():
    with Collector() as c:
        assert_false(c.closed)
    assert_true(c.closed)

@test("it still closes when the block raises")
def _():
    c = Collector()
    try:
        with c:
            c.add("one")
            raise ValueError("boom")
    except ValueError:
        pass
    assert_true(c.closed)

@test("exceptions are not suppressed")
def _():
    def blow_up():
        with Collector():
            raise ValueError("boom")
    assert_raises(blow_up, ValueError)

@test("collect_safely returns the messages")
def _():
    assert_equal(collect_safely(["a", "b"]), ["a", "b"])
    assert_equal(collect_safely([]), [])

@test("collect_safely rejects non-strings")
def _():
    assert_raises(lambda: collect_safely(["a", 5]), TypeError)
`,
    hints: [
      '`__enter__` should be one line: `return self`.',
      '`__exit__` sets `self.closed = True` and then returns `False` — returning `True` would swallow the caller’s exception.',
      'In `collect_safely`, check `isinstance(message, str)` and raise `TypeError` inside the `with` block; the context manager handles the cleanup for you.',
    ],
    solution: `class Collector:
    def __init__(self):
        self.messages = []
        self.closed = False

    def __enter__(self):
        return self

    def add(self, message):
        self.messages.append(message)

    def __exit__(self, exc_type, exc_value, traceback):
        self.closed = True
        return False


def collect_safely(messages):
    with Collector() as collector:
        for message in messages:
            if not isinstance(message, str):
                raise TypeError(f"expected a string, got {type(message).__name__}")
            collector.add(message)
        return collector.messages
`,
  },
  {
    id: 'py-19-json-stdlib',
    title: 'JSON and the Standard Library',
    language: 'python',
    module: 'Working With Data',
    difficulty: 4,
    concepts: ['json', 'modules', 'imports', 'stdlib'],
    instructions: `Python's selling point is that so much is already there. "Batteries included" is the phrase, and knowing what is in the box is a large part of being productive.

### Importing

\`\`\`python
import json                       # json.dumps(...)
import json as j                  # j.dumps(...)
from math import sqrt, floor      # sqrt(...)
from collections import Counter
\`\`\`

Prefer \`import module\` for anything ambiguous — \`json.loads\` says where it came from, where a bare \`loads\` does not. Never use \`from module import *\`; it dumps unknown names into your namespace and makes it impossible to tell where anything is defined.

### JSON

\`\`\`python
json.dumps({"a": 1})              # '{"a": 1}'    object → text
json.loads('{"a": 1}')            # {"a": 1}      text → object
json.dumps(data, indent=2, sort_keys=True)
\`\`\`

The mapping is what you would guess: dict ↔ object, list ↔ array, \`None\` ↔ \`null\`, \`True\` ↔ \`true\`. Note the capitalisation difference — this catches people writing JSON by hand.

Bad input raises \`json.JSONDecodeError\` (a subclass of \`ValueError\`), and types outside the JSON set — a \`datetime\`, a \`set\`, a custom class — raise \`TypeError\` on the way out.

### A few worth knowing today

\`\`\`python
import math      # sqrt, floor, ceil, inf
import random    # randint, choice, shuffle, sample
import datetime  # date.today(), timedelta
import re        # regular expressions
import os        # environment variables, paths
import statistics  # mean, median
\`\`\`

\`statistics.mean\` instead of hand-rolling a sum and divide, and \`random.choice\` instead of an index computation, are small things that add up to code that reads like the problem.

## YOUR TASK

\`summarise(json_text)\` takes JSON text describing bookings and returns a summary dict.

Input looks like:

\`\`\`json
{"bookings": [{"guest": "Ada", "nights": 3, "rate": 200}]}
\`\`\`

Return \`{"count": 1, "revenue": 600, "average_nights": 3.0}\` where revenue is the total of \`nights * rate\` and \`average_nights\` is the mean, rounded to one decimal place.

Rules:

- invalid JSON → return \`{"error": "invalid json"}\`
- valid JSON with no \`bookings\` key, or an empty list → all zeros, \`average_nights\` of \`0.0\`
- a booking missing \`nights\` or \`rate\` counts those as 0

Then \`to_pretty(data)\` — the data as JSON text, indented by 2 with sorted keys.`,
    starterCode: `import json


def summarise(json_text):
    pass


def to_pretty(data):
    pass
`,
    testCode: `@test("summarises a single booking")
def _():
    text = '{"bookings": [{"guest": "Ada", "nights": 3, "rate": 200}]}'
    assert_equal(summarise(text), {"count": 1, "revenue": 600, "average_nights": 3.0})

@test("summarises several bookings")
def _():
    text = '{"bookings": [{"nights": 2, "rate": 100}, {"nights": 3, "rate": 100}]}'
    result = summarise(text)
    assert_equal(result["count"], 2)
    assert_equal(result["revenue"], 500)
    assert_close(result["average_nights"], 2.5, places=2)

@test("rounds the average to one decimal")
def _():
    text = '{"bookings": [{"nights": 1, "rate": 0}, {"nights": 2, "rate": 0}, {"nights": 2, "rate": 0}]}'
    assert_equal(summarise(text)["average_nights"], 1.7)

@test("invalid json is reported, not raised")
def _():
    assert_equal(summarise("{not json"), {"error": "invalid json"})
    assert_equal(summarise(""), {"error": "invalid json"})

@test("missing or empty bookings give zeros")
def _():
    assert_equal(summarise('{}'), {"count": 0, "revenue": 0, "average_nights": 0.0})
    assert_equal(summarise('{"bookings": []}'), {"count": 0, "revenue": 0, "average_nights": 0.0})

@test("missing fields count as zero")
def _():
    assert_equal(summarise('{"bookings": [{"guest": "Ada"}]}'),
                 {"count": 1, "revenue": 0, "average_nights": 0.0})

@test("to_pretty indents and sorts keys")
def _():
    out = to_pretty({"b": 2, "a": 1})
    assert_equal(out, '{\\n  "a": 1,\\n  "b": 2\\n}')
`,
    hints: [
      'Wrap `json.loads` in try/except catching `ValueError` — `JSONDecodeError` is a subclass of it.',
      '`data.get("bookings", [])` handles the missing key, and `booking.get("nights", 0)` handles missing fields.',
      '`to_pretty` is one call: `json.dumps(data, indent=2, sort_keys=True)`.',
    ],
    solution: `import json


def summarise(json_text):
    try:
        data = json.loads(json_text)
    except ValueError:
        return {"error": "invalid json"}

    bookings = data.get("bookings", [])
    revenue = sum(b.get("nights", 0) * b.get("rate", 0) for b in bookings)
    nights = sum(b.get("nights", 0) for b in bookings)
    average = round(nights / len(bookings), 1) if bookings else 0.0

    return {
        "count": len(bookings),
        "revenue": revenue,
        "average_nights": float(average),
    }


def to_pretty(data):
    return json.dumps(data, indent=2, sort_keys=True)
`,
  },
  {
    id: 'py-20-capstone',
    title: 'Capstone: A Data Pipeline',
    language: 'python',
    module: 'Working With Data',
    difficulty: 5,
    concepts: ['pipelines', 'parsing', 'aggregation', 'reporting'],
    instructions: `No new syntax. This is the assembly job — parse messy input, validate it, aggregate it, format a report — which is what an enormous amount of real Python actually does.

The input is raw CSV-style text, the way it arrives from an export:

\`\`\`
guest,country,nights,rate
Ada,UK,3,200
Alan,UK,2,120
 ,USA,1,100
Grace,USA,5,350
Katherine,USA,two,200
\`\`\`

Note the two bad rows: one with a blank guest, one where \`nights\` is not a number. Real data always has these, and deciding what to do about them is part of the job rather than an afterthought.

### The shape

1. **Parse** — split lines, skip the header, split on commas, strip whitespace
2. **Validate** — drop rows that are malformed, and count how many you dropped
3. **Aggregate** — group by country, total the revenue
4. **Format** — produce report lines, sorted

Keeping those four steps as separate functions is the actual lesson. One function that does all four is untestable and unreadable; four small ones can each be checked on their own — which is exactly the testing-track argument, arriving again from a different direction.

## YOUR TASK

Three functions.

1. \`parse_rows(text)\` → a list of dicts \`{"guest", "country", "nights", "rate"}\` with \`nights\` and \`rate\` as ints. Skip the header line, skip blank lines, and skip any row that has the wrong number of fields, a blank guest, or non-numeric \`nights\`/\`rate\`.

2. \`revenue_by_country(rows)\` → a dict of country to total \`nights * rate\`.

3. \`report(text)\` → a list of report lines:

\`\`\`
USA: $1750
UK: $840
Skipped 2 invalid rows
\`\`\`

Countries sorted by revenue descending, ties broken alphabetically. The final line appears **only** when something was skipped, and reads \`Skipped 1 invalid row\` in the singular.`,
    starterCode: `def parse_rows(text):
    pass


def revenue_by_country(rows):
    pass


def report(text):
    pass
`,
    testCode: `SAMPLE = """guest,country,nights,rate
Ada,UK,3,200
Alan,UK,2,120
 ,USA,1,100
Grace,USA,5,350
Katherine,USA,two,200"""

@test("parses the good rows and skips the bad ones")
def _():
    rows = parse_rows(SAMPLE)
    assert_length(rows, 3)
    assert_equal(rows[0], {"guest": "Ada", "country": "UK", "nights": 3, "rate": 200})

@test("numbers are parsed as ints, not strings")
def _():
    rows = parse_rows(SAMPLE)
    assert_true(isinstance(rows[0]["nights"], int))
    assert_true(isinstance(rows[0]["rate"], int))

@test("blank lines and short rows are skipped")
def _():
    text = "guest,country,nights,rate\\n\\nAda,UK,1,100\\nBroken,Row\\n"
    rows = parse_rows(text)
    assert_length(rows, 1)
    assert_equal(rows[0]["guest"], "Ada")

@test("a header alone parses to nothing")
def _():
    assert_equal(parse_rows("guest,country,nights,rate"), [])
    assert_equal(parse_rows(""), [])

@test("whitespace around values is stripped")
def _():
    rows = parse_rows("guest,country,nights,rate\\n  Ada , UK , 2 , 50 ")
    assert_equal(rows[0], {"guest": "Ada", "country": "UK", "nights": 2, "rate": 50})

@test("revenue is grouped by country")
def _():
    rows = parse_rows(SAMPLE)
    assert_equal(revenue_by_country(rows), {"UK": 840, "USA": 1750})
    assert_equal(revenue_by_country([]), {})

@test("the report is sorted by revenue, with the skipped count")
def _():
    assert_equal(report(SAMPLE), ["USA: $1750", "UK: $840", "Skipped 2 invalid rows"])

@test("the skipped line is omitted when everything is valid")
def _():
    text = "guest,country,nights,rate\\nAda,UK,1,100"
    assert_equal(report(text), ["UK: $100"])

@test("one skipped row is singular")
def _():
    text = "guest,country,nights,rate\\nAda,UK,1,100\\n,UK,1,100"
    assert_equal(report(text), ["UK: $100", "Skipped 1 invalid row"])

@test("ties are broken alphabetically")
def _():
    text = "guest,country,nights,rate\\nA,ZZ,1,100\\nB,AA,1,100"
    assert_equal(report(text), ["AA: $100", "ZZ: $100"])
`,
    hints: [
      'Split with `text.strip().split("\\n")` and drop the first line, then `line.split(",")` each remaining row.',
      'Validate inside a try/except around the `int()` calls, and `continue` past any row that fails — that single pattern covers all three rejection rules.',
      'For the ordering, sort the items with `key=lambda kv: (-kv[1], kv[0])`; count skipped rows as the number of data lines minus the number of parsed rows.',
    ],
    solution: `def parse_rows(text):
    rows = []
    lines = [line for line in text.strip().split("\\n") if line.strip()]

    for line in lines[1:]:
        fields = [field.strip() for field in line.split(",")]
        if len(fields) != 4:
            continue

        guest, country, nights, rate = fields
        if not guest:
            continue

        try:
            rows.append(
                {
                    "guest": guest,
                    "country": country,
                    "nights": int(nights),
                    "rate": int(rate),
                }
            )
        except ValueError:
            continue

    return rows


def revenue_by_country(rows):
    totals = {}
    for row in rows:
        revenue = row["nights"] * row["rate"]
        totals[row["country"]] = totals.get(row["country"], 0) + revenue
    return totals


def report(text):
    lines = [line for line in text.strip().split("\\n") if line.strip()]
    data_lines = max(len(lines) - 1, 0)

    rows = parse_rows(text)
    skipped = data_lines - len(rows)

    totals = revenue_by_country(rows)
    ordered = sorted(totals.items(), key=lambda kv: (-kv[1], kv[0]))

    out = [f"{country}: \${revenue}" for country, revenue in ordered]

    if skipped == 1:
        out.append("Skipped 1 invalid row")
    elif skipped > 1:
        out.append(f"Skipped {skipped} invalid rows")

    return out
`,
  },
  {
    id: 'py-21-quiz',
    title: 'Checkpoint: Python Gotchas',
    language: 'python',
    kind: 'quiz',
    module: 'Robust Python',
    difficulty: 4,
    concepts: ['mutability', 'identity', 'defaults', 'review'],
    instructions: `The Python-specific traps. Several of these are standard interview questions precisely because they separate people who have written Python from people who have read about it.`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What does `def add(item, items=[]): items.append(item); return items` return on its **second** call with `add("b")`?',
        choices: ["['b']", "['a', 'b']", 'It raises', 'None'],
        answerIndex: 1,
        explanation:
          "['a', 'b']. The default is created once, when the function is defined, and shared by every call that omits the argument. The fix is `items=None` with `if items is None: items = []` inside. This is the most famous Python gotcha, and dataclasses refuse mutable defaults outright because of it.",
      },
      {
        id: 'q2',
        prompt: 'When should you use `is` instead of `==`?',
        choices: [
          'They are interchangeable',
          'Only for None, True and False — `is` compares identity, not value',
          '`is` is faster, so always',
          'Only for numbers',
        ],
        answerIndex: 1,
        explanation:
          '`is` asks whether two names point at the same object; `==` asks whether they are equal. Use `x is None` for the singletons, and `==` for everything else. `x is 1000` can be False even when `x == 1000`, because small integers are cached and larger ones are not.',
      },
      {
        id: 'q3',
        prompt: 'After `b = a` where `a = [1, 2]`, what does `b.append(3)` do to `a`?',
        choices: ['Nothing — b is a copy', 'a becomes [1, 2, 3]', 'It raises', 'a becomes [3]'],
        answerIndex: 1,
        explanation:
          'a becomes [1, 2, 3] — assignment binds a second name to the same list, exactly as in JavaScript. Copy with `a[:]`, `list(a)` or `copy.copy(a)`, and note those are all shallow: nested lists are still shared, which needs `copy.deepcopy`.',
      },
      {
        id: 'q4',
        prompt: 'What is the difference between `sorted(items)` and `items.sort()`?',
        choices: [
          'None',
          '`sorted` returns a new list; `.sort()` sorts in place and returns None',
          '`.sort()` is only for numbers',
          '`sorted` is always faster',
        ],
        answerIndex: 1,
        explanation:
          '`sorted` returns a new list and works on any iterable. `.sort()` is a list method that rearranges in place and returns `None` — which is why `items = items.sort()` is a bug that quietly sets your variable to None.',
      },
      {
        id: 'q5',
        prompt: 'Which values are falsy in Python?',
        choices: [
          'Only False and None',
          'False, None, 0, empty string, empty list/dict/set/tuple',
          'Only None',
          'Anything that is not True',
        ],
        answerIndex: 1,
        explanation:
          'All the empty containers count as falsy, which is why `if not items:` is the idiomatic emptiness check rather than `if len(items) == 0:`. The same trap as JavaScript applies: a legitimate `0` will fail an `if value:` test.',
      },
      {
        id: 'q6',
        prompt: 'You need to process a 10GB log file. List comprehension or generator?',
        choices: [
          'List comprehension — it is faster',
          'Generator — it processes one item at a time instead of loading everything',
          'Neither, use a while loop',
          'It makes no difference',
        ],
        answerIndex: 1,
        explanation:
          'A generator. A list comprehension materialises every element in memory, which is impossible here. The generator holds one item at a time. The trade is that a generator is single-use and has no length — if you need the data twice, you need a list.',
      },
      {
        id: 'q7',
        prompt: 'Why does `open("f.txt")` without `with` attract a review comment?',
        choices: [
          'It is slower',
          'The file is not closed if an exception is raised before close()',
          'It cannot read binary files',
          'It is deprecated',
        ],
        answerIndex: 1,
        explanation:
          'Cleanup is not guaranteed. An exception between open and close skips the close, leaking a file handle. `with` calls `__exit__` whether the block succeeds or raises, which is the entire reason context managers exist.',
      },
      {
        id: 'q8',
        prompt: 'What does a type hint like `nights: int` actually do at runtime?',
        choices: [
          'Enforces the type and raises on a mismatch',
          'Nothing — it is for editors and static checkers like mypy',
          'Converts the value to an int',
          'Makes the attribute read-only',
        ],
        answerIndex: 1,
        explanation:
          'Nothing at runtime; passing a string works fine. Hints exist for tooling — editor autocomplete and checkers such as mypy or pyright. The one exception is dataclasses, where the annotation is what declares a field in the first place.',
      },
    ],
  },
];
