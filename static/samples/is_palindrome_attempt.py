# Challenge: Is Palindrome
# Check whether a word or phrase reads the same backward.

def is_palindrome(s):
    reversed_s = ""
    for i in range(len(s) - 1, 0, -1):  # bug: stops at index 1, skips index 0
        reversed_s += s[i]
    return s == reversed_s
