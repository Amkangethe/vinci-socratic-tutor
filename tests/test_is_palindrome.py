from student_attempts.is_palindrome_attempt import is_palindrome

def test_basic_palindrome():
    assert is_palindrome("racecar") == True

def test_not_palindrome():
    assert is_palindrome("python") == False

def test_single_character():
    assert is_palindrome("a") == True

def test_empty_string():
    assert is_palindrome("") == True
