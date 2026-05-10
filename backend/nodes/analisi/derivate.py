import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class DerivateGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 5)
            n = random.randint(2, 4)
            poly = a * x**n
            deriv = sp.diff(poly, x)
            return Exercise(
                question=f"Derivata di f(x) = {str(poly)}",
                solution=str(deriv),
                hints=[f"Regola: d/dx[{a}x^{n}] = {a}×{n}x^{n-1}"],
            )

        elif level == 2:
            template = random.choice(["prodotto", "quoziente"])
            if template == "prodotto":
                a = random.randint(1, 3)
                b = random.randint(1, 3)
                c = random.randint(1, 3)
                f = a * x + b
                g = c * x + a
                prod = f * g
                deriv = sp.diff(prod, x)
                return Exercise(
                    question=f"Derivata di f(x)=({str(f)})({str(g)})",
                    solution=str(deriv),
                    hints=["Usa la regola del prodotto: (f·g)' = f'·g + f·g'"],
                )
            else:
                a = random.randint(1, 4)
                b = random.randint(1, 4)
                c = random.randint(1, 3)
                d = random.randint(1, 3)
                f = a * x + b
                g = c * x + d
                quot = f / g
                deriv = sp.simplify(sp.diff(quot, x))
                return Exercise(
                    question=f"Derivata di f(x)=({str(f)})/({str(g)})",
                    solution=str(deriv),
                    hints=["Usa la regola del quoziente: (f/g)' = (f'·g - f·g')/g²"],
                )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 5)
            n = random.randint(2, 3)
            outer = a * x**n
            inner = b * x + a
            comp = outer.subs(x, inner)
            deriv = sp.simplify(sp.diff(comp, x))
            return Exercise(
                question=f"Derivata di f(x) = {a}({b}x + {a})^{n}",
                solution=str(deriv),
                hints=["Usa la regola della catena: f'(x) = f'(g(x))·g'(x)"],
            )


register("derivate", DerivateGenerator())
