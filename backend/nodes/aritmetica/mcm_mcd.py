import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


class McmMcdGenerator(NodeGenerator):
    def _gcd(self, a: int, b: int) -> int:
        return math.gcd(a, b)

    def _lcm(self, a: int, b: int) -> int:
        return a * b // math.gcd(a, b)

    def generate(self, level: int) -> Exercise:
        template = random.choice(["mcd", "mcm"] if level > 1 else ["mcd"])

        if level == 1:
            a = random.randint(6, 30)
            b = random.randint(6, 30)
            g = math.gcd(a, b)
            if g == 1:
                a = a * 2
                b = a // 2
                while b < 4:
                    b = random.randint(6, 30)
                a = b * random.randint(2, 4)
                g = math.gcd(a, b)

            match template:
                case "mcd":
                    return Exercise(
                        question=f"Trova il MCD di {a} e {b}",
                        solution=str(g),
                        hints=[f"Trova il più grande numero che divide sia {a} che {b}."],
                    )
                case "mcm":
                    l = a * b // g
                    return Exercise(
                        question=f"Trova l'mcm di {a} e {b}",
                        solution=str(l),
                        hints=[f"MCD({a},{b})={g}. Usa la formula: a×b/MCD."],
                    )

        elif level == 2:
            a = random.randint(12, 60)
            b = random.randint(12, 60)
            g = math.gcd(a, b)
            if g == 1:
                a = 12 * random.randint(2, 5)
                b = 8 * random.randint(3, 6)
                g = math.gcd(a, b)

            match template:
                case "mcd":
                    return Exercise(
                        question=f"Calcola il MCD({a}, {b})",
                        solution=str(g),
                        hints=[f"Scomponi {a} e {b} in fattori primi."],
                    )
                case "mcm":
                    l = a * b // g
                    return Exercise(
                        question=f"Calcola l'mcm({a}, {b})",
                        solution=str(l),
                        hints=[f"mcm = ({a} × {b}) / MCD({a},{b})"],
                    )

        else:
            a = random.randint(10, 50)
            b = random.randint(10, 50)
            c = random.randint(10, 50)

            match template:
                case "mcd":
                    g = math.gcd(math.gcd(a, b), c)
                    if g == 1:
                        a = 30 * random.randint(1, 3)
                        b = 24 * random.randint(1, 3)
                        c = 18 * random.randint(2, 4)
                        g = math.gcd(math.gcd(a, b), c)
                    return Exercise(
                        question=f"Trova il MCD di {a}, {b} e {c}",
                        solution=str(g),
                        hints=["Scomponi tutti e tre in fattori primi e prendi i comuni."],
                    )
                case "mcm":
                    l = self._lcm(self._lcm(a, b), c)
                    return Exercise(
                        question=f"Trova l'mcm di {a}, {b} e {c}",
                        solution=str(l),
                        hints=["Calcola mcm a due a due."],
                    )


register("mcm-e-mcd", McmMcdGenerator())
