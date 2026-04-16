# Challenge: Count Vowels
# Count how many vowels appear in a given string.

def count_vowels(s):
    vowels = "aeiou"
    count = 0
    for char in s:
        if char in vowels:
            count == count + 1  # bug: == instead of +=
    return count
