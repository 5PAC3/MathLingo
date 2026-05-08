import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


_PRIMES_100 = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37,
    41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
]


class NumeriPrimiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["fattorizza", "e_primo", "fattori_comuni"] if level > 1 else ["e_primo"])

        if level == 1:
            if random.choice([True, False]):
                n = random.choice(_PRIMES_100)
                return Exercise(
                    question=f"{n} è un numero primo? (sì/no)",
                    solution="si",
                    hints=["Un numero primo è divisibile solo per 1 e per sé stesso."],
                )
            else:
                n = random.choice([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30])
                return Exercise(
                    question=f"{n} è un numero primo? (sì/no)",
                    solution="no",
                    hints=[f"Prova a dividere {n} per 2, 3, 5..."],
                )

        elif level == 2:
            match template:
                case "e_primo":
                    n = random.choice(_PRIMES_100 + [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27])
                    return Exercise(
                        question=f"{n} è primo? (sì/no)",
                        solution="si" if n in _PRIMES_100 else "no",
                        hints=[f"Verifica se {n} è divisibile per qualche numero oltre 1 e sé stesso."],
                    )
                case "fattorizza":
                    n = random.randint(2, 6) * random.randint(2, 6)
                    factors = []
                    temp = n
                    for p in _PRIMES_100:
                        while temp % p == 0:
                            factors.append(str(p))
                            temp //= p
                        if temp == 1:
                            break
                    sol = " × ".join(factors)
                    return Exercise(
                        question=f"Scomponi {n} in fattori primi (es. 12 = 2 × 2 × 3)",
                        solution=sol,
                        hints=[f"Dividi {n} per il numero primo più piccolo possibile."],
                    )
                case _:
                    return Exercise(
                        question=f"Scomponi {n} in fattori primi (es. 12 = 2 × 2 × 3)",
                        solution=sol,
                        hints=[f"Dividi {n} per il numero primo più piccolo possibile."],
                    )

        else:
            match template:
                case "fattorizza":
                    n = random.randint(30, 120)
                    factors = []
                    temp = n
                    for p in _PRIMES_100:
                        while temp % p == 0:
                            factors.append(str(p))
                            temp //= p
                        if temp == 1:
                            break
                    sol = " × ".join(factors)
                    return Exercise(
                        question=f"Scomponi {n} in fattori primi",
                        solution=sol,
                        hints=["Continua a dividere per numeri primi fino a ottenere 1."],
                    )
                case "e_primo":
                    n = random.choice([97, 101, 103, 107, 109, 113] + [99, 105, 111, 117, 119, 121])
                    return Exercise(
                        question=f"{n} è primo? (sì/no)",
                        solution="si" if n in [97, 101, 103, 107, 109, 113] else "no",
                        hints=[f"Verifica la divisibilità di {n}."],
                    )
                case "fattori_comuni":
                    a = random.choice([12, 18, 24, 30, 36, 42, 48])
                    b = random.choice([18, 24, 30, 36, 42, 48, 54])
                    g = math.gcd(a, b)
                    return Exercise(
                        question=f"MCD({a}, {b}) usando la scomposizione in fattori primi",
                        solution=str(g),
                        hints=["Scomponi entrambi e prendi i fattori comuni con l'esponente minore."],
                    )


register("numeri-primi", NumeriPrimiGenerator())
