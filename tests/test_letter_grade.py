from student_attempts.letter_grade_attempt import letter_grade

def test_a_grade():
    assert letter_grade(95) == "A"

def test_b_grade():
    assert letter_grade(85) == "B"

def test_c_grade():
    assert letter_grade(75) == "C"

def test_f_grade():
    assert letter_grade(50) == "F"
