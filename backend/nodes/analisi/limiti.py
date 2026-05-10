import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class LimitiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            c = random.randint(1, 5)
            xv = random.randint(1, 5)
            val = a * xv + b
            return Exercise(
                question=f"lim_{{x→{xv}}} ({a}x + {b}) = ?",
                solution=str(val),
                hints=[f"Sostituisci x = {xv}: {a}×{xv} + {b}"],
            )

        elif level == 2:
            a = random.randint(1, 3)
            b = random.randint(1, 4)
            roots = [-a, -b]
            poly = sp.expand((x + a) * (x + b))
            xv = random.choice(roots)
            other = [r for r in roots if r != xv][0]
            num = sp.expand((x - other))
            simplified = sp.simplify(num / ((x + a) * (x + b)))
            val = 1 / (xv + a + b + other)
            return Exercise(
                question=f"lim_{{x→{xv}}} ({str(num)})/({str(poly)}) = ?",
                solution=str(val) if val == int(val) else str(val),
                hints=[f"Semplifica: (x - {other})/((x+{a})(x+{b}))", f"Poi sostituisci x = {xv}"],
            )

        else:
            a = random.randint(1, 4)
            b = random.randint(1, 4)
            c = random.randint(1, 5)
            degree_num = random.choice([1, 2])
            degree_den = random.choice([1, 2])
            if degree_num == degree_den:
                limit_val = a // c if a % c == 0 else f"{a}/{c}"
            elif degree_num < degree_den:
                limit_val = 0
            else:
                limit_val = "∞"
            num_str = f"{a}x{'²' if degree_num == 2 else ''} + {b}x" if degree_num > 0 else str(b)
            den_str = f"{c}x{'²' if degree_den == 2 else ''} + {random.randint(1,5)}" 
            return Exercise(
                question=f"lim_{{x→∞}} ({num_str})/({den_str}) = ?",
                solution=str(limit_val),
                hints=["Confronta i gradi di numeratore e denominatore."],
            )


register("limiti", LimitiGenerator())
