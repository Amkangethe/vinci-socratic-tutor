# Challenge: My Max
# Find and return the largest value in a list.

def my_max(lst):
    max_val = 0  # bug: initializing to 0 breaks all-negative lists
    for num in lst:
        if num > max_val:
            max_val = num
    return max_val
