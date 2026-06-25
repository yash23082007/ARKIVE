from typing import List

class PrimeHeaderGenerator:
    @staticmethod
    def get_primes(n: int) -> List[int]:
        """
        Generates the first N prime numbers.
        """
        primes = []
        candidate = 2
        while len(primes) < n:
            is_prime = True
            for p in primes:
                if p * p > candidate:
                    break
                if candidate % p == 0:
                    is_prime = False
                    break
            if is_prime:
                primes.append(candidate)
            candidate += 1
        return primes

    @staticmethod
    def generate_beacon_signal(num_primes: int = 15) -> str:
        """
        Generates a modulated binary signal based on the first N primes.
        A pulse represents the prime number count, followed by a gap.
        e.g., 2 -> "110", 3 -> "1110", 5 -> "111110"
        This is a standard scientific method to transmit numerical primes in radio streams.
        """
        primes = PrimeHeaderGenerator.get_primes(num_primes)
        bits = []
        for p in primes:
            bits.append("1" * p)
            bits.append("0") # Gap indicator
        return "".join(bits)
