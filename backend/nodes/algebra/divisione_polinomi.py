import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class DivisionePolinomiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            coeffs = [random.randint(1, 4) for _ in range(3)]
            a = random.randint(1, 3)
            poly = coeffs[0] * x**2 + coeffs[1] * x + coeffs[2]
            q = sp.div(poly, x - a, domain=sp.QQ)[0]
            return Exercise(
                question=f"Dividi ({str(poly)}) per (x - {a}) usando Ruffini. Quanto vale il quoziente?",
                solution=str(q),
                hints=["Abbassa il primo coefficiente, moltiplica per a e somma."],
            )

        elif level == 2:
            coeffs = [random.randint(1, 5) for _ in range(3)]
            a = random.randint(1, 3)
            poly = coeffs[0] * x**2 + coeffs[1] * x + coeffs[2]
            resto = poly.subs(x, a)
            return Exercise(
                question=f"Usa il teorema del resto: resto di ({str(poly)}) ÷ (x - {a})?",
                solution=str(resto),
                hints=[f"Calcola P({a}) sostituendo x = {a}."],
            )

        else:
            coeffs = [random.randint(1, 3) for _ in range(4)]
            a = random.randint(1, 2)
            poly = coeffs[0] * x**3 + coeffs[1] * x**2 + coeffs[2] * x + coeffs[3]
            q, r = sp.div(poly, x - a, domain=sp.QQ)
            return Exercise(
                question=f"Dividi ({str(poly)}) per (x - {a}). Scrivi il risultato come Q + R/(x-{a}).",
                solution=f"{str(q)} + {r}/(x-{a})",
                hints=[f"Usa Ruffini. Il resto dovrebbe essere {r}."],
            )


register("divisione-polinomi", DivisionePolinomiGenerator())
