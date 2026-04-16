from student_attempts.dedupe_attempt import dedupe

def test_basic():
    assert dedupe([1, 2, 2, 3]) == [1, 2, 3]

def test_no_duplicates():
    assert dedupe([1, 2, 3]) == [1, 2, 3]

def test_all_duplicates():
    assert dedupe([6, 5, 5, 5, 5, 7, 8, 8, 6]) == [5, 6, 7, 8]

def test_empty_list():
    assert dedupe([]) == []
