from student_attempts.my_max_attempt import my_max

def test_basic():
    assert my_max([1, 5, 3, 9, 2]) == 9

def test_single_element():
    assert my_max([7]) == 7

def test_negative_numbers():
    assert my_max([-5, -2, -10]) == -2

def test_sorted_list():
    assert my_max([1, 2, 3, 4, 5]) == 5
