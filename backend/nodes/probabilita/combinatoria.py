import random

from .. import register
from ..base import Exercise, NodeGenerator


def fact(n: int) -> int:
    r = 1
    for i in range(2, n + 1):
        r *= i
    return r


class CombinatoriaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["disposizioni", "combinazioni"] if level > 1 else ["disposizioni"])

        if level == 1:
            n = random.randint(3, 5)
            return Exercise(
                question=f"In quanti modi puoi ordinare {n} oggetti distinti?",
                solution=str(fact(n)),
                hints=[f"{n}! = {n} × {n-1} × ... × 1"],
            )

        elif level == 2:
            match template:
                case "disposizioni":
                    n = random.randint(4, 6)
                    k = random.randint(2, min(3, n))
                    perm = fact(n) // fact(n - k)
                    return Exercise(
                        question=f"Quante parole di {k} lettere puoi formare da {n} lettere distinte? (senza ripetizioni)",
                        solution=str(perm),
                        hints=[f"D({n},{k}) = {n}!/({n}-{k})! = {n} × {n-1} × ... × {n-k+1}"],
                    )
                case "combinazioni":
                    n = random.randint(4, 6)
                    k = random.randint(2, min(3, n))
                    comb = fact(n) // (fact(k) * fact(n - k))
                    return Exercise(
                        question=f"Quante squadre di {k} persone puoi formare da {n} persone?",
                        solution=str(comb),
                        hints=[f"C({n},{k}) = {n}!/({k}!({n}-{k})!)"],
                    )

        else:
            n = random.randint(5, 8)
            k = random.randint(2, min(4, n))
            ops = random.choice(["disposizioni", "combinazioni", "permutazioni"])
            match ops:
                case "disposizioni":
                    val = fact(n) // fact(n - k)
                    return Exercise(
                        question=f"Disposizioni semplici di {n} elementi presi {k} alla volta",
                        solution=str(val),
                        hints=[f"D = {n}!/({n-k})!"],
                    )
                case "combinazioni":
                    val = fact(n) // (fact(k) * fact(n - k))
                    return Exercise(
                        question=f"Combinazioni di {n} elementi presi {k} alla volta",
                        solution=str(val),
                        hints=[f"C = {n}!/({k}!({n-k})!)"],
                    )
                case "permutazioni":
                    val = fact(n)
                    return Exercise(
                        question=f"Permutazioni di {n} oggetti distinti",
                        solution=str(val),
                        hints=[f"P = {n}!"],
                    )


register("combinatoria", CombinatoriaGenerator())
