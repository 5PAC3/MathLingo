import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class DisequazioniSecondoGradoGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 3)
            b = random.randint(1, 4)
            p = a * b
            roots = sorted([-a, -b])
            opts = [">", "<"]
            op = random.choice(opts)
            ineq = f"x² + {a+b}x + {p} {op} 0"
            sol_str = f"{roots[0]} < x < {roots[1]}" if op == "<" else f"x < {roots[0]} ∨ x > {roots[1]}"
            return Exercise(
                question=f"Risolvi: {ineq}",
                solution=sol_str,
                hints=[f"Radici: x = {roots[0]}, x = {roots[1]}", f"a > 0, segno + fuori dall'intervallo."],
            )

        elif level == 2:
            a = random.randint(1, 3)
            h = random.randint(1, 4)
            poly = a * (x - h) ** 2
            expanded = sp.expand(poly)
            op = random.choice(["≥", "≤"])
            expected = "tutti i numeri reali" if op == "≥" else f"x = {h}"
            return Exercise(
                question=f"Risolvi: {str(expanded)} {op} 0",
                solution=expected,
                hints=[f"{str(poly)} è un quadrato perfetto.", "Studia il segno del quadrato."],
            )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 5)
            c = random.randint(1, 3)
            d = random.randint(1, 5)
            num = a * x + b
            den = c * x + d
            sol_x = -b / a
            pol_x = -d / c
            if sol_x > pol_x:
                sol_x, pol_x = pol_x, sol_x
            return Exercise(
                question=f"Risolvi: ({a}x+{b})/({c}x+{d}) ≥ 0",
                solution=f"x ≤ {int(sol_x)} ∨ x > {int(pol_x)}" if sol_x.is_integer() and pol_x.is_integer() else "usa il grafico dei segni",
                hints=["Studia segno di numeratore e denominatore separatamente.", "Usa la tabella dei segni."],
            )


register("disequazioni-secondo-grado", DisequazioniSecondoGradoGenerator())
