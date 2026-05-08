import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class EquazioniSecondoGradoGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")

        if level == 1:
            r = random.randint(1, 5)
            expr = (x - r) ** 2
            eq = sp.Eq(sp.expand(expr), 0)
            sol = sp.solve(eq, x)[0]
            return Exercise(
                question=f"Risolvi: x² - {2*r}x + {r**2} = 0",
                solution=str(sol),
                hints=[f"È un quadrato perfetto: (x - {r})² = 0"],
            )

        elif level == 2:
            r1 = random.randint(1, 5)
            r2 = random.randint(-5, -1)
            a = 1
            b = -(r1 + r2)
            c = r1 * r2
            eq = sp.Eq(a * x**2 + b * x + c, 0)
            sols = sp.solve(eq, x)
            sols_sorted = sorted(sols, key=lambda s: float(s))
            if random.choice([True, False]):
                idx = random.choice([0, 1])
                return Exercise(
                    question=f"Risolvi: x² {'+' if b >= 0 else '-'} {abs(b) if b != 0 else ''}x { '+' if c >= 0 else '-'} {abs(c)} = 0. Scrivi la soluzione più {'grande' if idx == 1 else 'piccola'}.",
                    solution=str(sols_sorted[idx]),
                    hints=[f"Scomponi il trinomio o usa la formula quadratica."],
                )
            else:
                return Exercise(
                    question=f"Risolvi: x² {'+' if b >= 0 else '-'} {abs(b) if b != 0 else ''}x {'+' if c >= 0 else '-'} {abs(c)} = 0. Scrivi una soluzione.",
                    solution=str(sols[0]),
                    hints=[f"x₁ × x₂ = {c} e x₁ + x₂ = {-b}. Prova con i divisori di {c}."],
                )

        else:
            a = random.randint(2, 4)
            r1 = random.randint(1, 4)
            r2 = random.randint(-3, -1)
            b = a * (-(r1 + r2))
            c = a * (r1 * r2)
            eq = sp.Eq(a * x**2 + b * x + c, 0)
            sols = sp.solve(eq, x)
            sol = sorted(sols, key=lambda s: float(s))[0]
            return Exercise(
                question=f"Risolvi: {a}x² {'+' if b >= 0 else '-'} {abs(b) if b != 0 else ''}x {'+' if c >= 0 else '-'} {abs(c)} = 0. Scrivi una soluzione.",
                solution=str(sol),
                hints=["Usa la formula risolutiva: x = (-b ± √(b²-4ac))/2a"],
            )


register("equazioni-secondo-grado", EquazioniSecondoGradoGenerator())
