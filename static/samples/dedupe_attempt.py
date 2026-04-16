# Challenge: Dedupe
# Remove repeated values from a list and keep only unique items.

def dedupe(lst):
    seen = []
    for i in range(1, len(lst)):  # bug: starts at index 1, so the first element is always skipped
        if lst[i] not in seen:
            seen.append(lst[i])
    return seen
