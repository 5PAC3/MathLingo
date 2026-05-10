import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class EquazioniFratteGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 8)
            eq = sp.Eq(a / x, b)
            sol = sp.solve(eq, x)[0]
            return Exercise(
                question=f"Risolvi: {a}/x = {b}",
                solution=str(sol),
                hints=[f"Moltiplica entrambi i membri per x: {a} = {b}x"],
            )

        elif level == 2:
            a = random.randint(1, 4)
            b = random.randint(1, 5)
            c = random.randint(1, 5)
            eq = sp.Eq(a / (x + b), c)
            sol = sp.solve(eq, x)[0]
            return Exercise(
                question=f"Risolvi: {a}/(x + {b}) = {c}",
                solution=str(sol),
                hints=[f"Moltiplica per (x + {b}): {a} = {c}(x + {b})"],
            )

        else:
            for _ in range(50):
                a = random.randint(1, 4)
                b = random.randint(1, 5)
                c = random.randint(1, 4)
                d = random.randint(1, 5)
                eq = sp.Eq(a / (x + b), c / (x + d))
                sols = sp.solve(eq, x)
                if len(sols) == 0:
                    continue
                sol = sols[0]
                domain_check = (sol != -b) and (sol != -d)
                if domain_check:
                    return Exercise(
                        question=f"Risolvi: {a}/(x + {b}) = {c}/(x + {d})",
                        solution=str(sol),
                        hints=["Moltiplica a croce e risolvi l'equazione lineare."],
                    )

            return Exercise(
                question=f"Risolvi: 1/(x + 1) = 2/(x + 3)",
                solution="1",
                hints=["Moltiplica a croce e risolvi l'equazione lineare."],
            )


register("equazioni-fratte", EquazioniFratteGenerator())
