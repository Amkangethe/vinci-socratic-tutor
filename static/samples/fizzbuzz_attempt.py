# Challenge: FizzBuzz
# Return Fizz, Buzz, or FizzBuzz based on divisibility rules.

def fizzbuzz(n):
    result = []
    for i in range(1, n):  # bug: should be range(1, n+1), misses last number
        if i % 3 == 0 and i % 5 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(i)  # bug: appending int instead of str
    return result
