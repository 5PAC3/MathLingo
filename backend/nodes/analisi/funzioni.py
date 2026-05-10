import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class FunzioniGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            c = random.randint(1, 5)
            d = random.randint(1, 5)
            xv = random.randint(1, 5)
            val = a * xv**2 + b * xv + c
            return Exercise(
                question=f"f(x) = {a}x² + {b}x + {c}. Quanto vale f({xv})?",
                solution=str(val),
                hints=[f"Sostituisci x = {xv}: {a}×({xv})² + {b}×{xv} + {c}"],
            )

        elif level == 2:
            template = random.choice(["frazione", "radice"])
            if template == "frazione":
                a = random.randint(1, 3)
                b = random.randint(1, 5)
                c = random.randint(1, 4)
                sol = -c
                return Exercise(
                    question=f"Domino di f(x) = ({a}x+{b})/(x+{c})",
                    solution=f"x ≠ {sol}",
                    hints=[f"Il denominatore non può essere zero: x + {c} = 0 → x = {sol}"],
                )
            else:
                a = random.randint(1, 3)
                b = random.randint(-5, 5)
                sol = -b
                return Exercise(
                    question=f"Dominio di f(x) = √({a}x + {b})",
                    solution=f"x ≥ {sol}" if a > 0 else f"x ≤ {sol}",
                    hints=[f"Radicando ≥ 0: {a}x + {b} ≥ 0"],
                )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 3)
            c = random.randint(1, 3)
            d = random.randint(1, 3)
            xv = random.randint(1, 3)
            inner = a * xv + b
            outer = c * inner + d
            return Exercise(
                question=f"f(x) = {c}x + {d}, g(x) = {a}x + {b}. Quanto vale f(g({xv}))?",
                solution=str(outer),
                hints=[f"Prima g({xv}) = {a}×{xv} + {b} = {inner}", f"Poi f({inner}) = {c}×{inner} + {d} = {outer}"],
            )


register("funzioni", FunzioniGenerator())
