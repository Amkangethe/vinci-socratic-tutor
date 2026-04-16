# Challenge: Letter Grade
# Convert a numeric score into its matching letter grade.

def letter_grade(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    else:
        return "f"  # bug: lowercase "f" instead of "F"
