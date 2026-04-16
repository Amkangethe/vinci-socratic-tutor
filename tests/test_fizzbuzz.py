from student_attempts.fizzbuzz_attempt import fizzbuzz

def test_basic():
    assert fizzbuzz(3) == ["1", "2", "Fizz"]

def test_fizz_and_buzz():
    result = fizzbuzz(15)
    assert result[2] == "Fizz"
    assert result[4] == "Buzz"
    assert result[14] == "FizzBuzz"

def test_single_value():
    assert fizzbuzz(1) == ["1"]

def test_zero():
    assert fizzbuzz(0) == []
