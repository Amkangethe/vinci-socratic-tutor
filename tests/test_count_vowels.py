from student_attempts.count_vowels_attempt import count_vowels

def test_basic():
    assert count_vowels("hello") == 2

def test_empty_string():
    assert count_vowels("") == 0

def test_no_vowels():
    assert count_vowels("sky") == 0

def test_uppercase_vowels():
    assert count_vowels("AEIOU") == 5
