import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class ParabolaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 3)
            b = random.randint(-4, 4)
            c = random.randint(-4, 4)
            if b == 0:
                b = 1
            vx = -b / (2 * a)
            vy = (4 * a * c - b**2) / (4 * a)
            return Exercise(
                question=f"Vertice della parabola y = {a}x² + {b}x + {c}. Quanto vale xᵥ?",
                solution=str(int(vx)) if vx == int(vx) else str(vx),
                hints=[f"xᵥ = -b/(2a) = -({b})/(2×{a})"],
            )

        elif level == 2:
            a = random.randint(1, 2)
            b = random.randint(-3, 3)
            c = random.randint(-3, 3)
            if b == 0:
                b = 2
            poly = a * x**2 + b * x + c
            roots = sp.solve(poly, x)
            r1 = int(roots[0]) if roots[0].is_Integer else float(roots[0])
            r2 = int(roots[1]) if roots[1].is_Integer else float(roots[1])
            return Exercise(
                question=f"Intersezioni con x di y = {a}x² + {b}x + {c} (scrivi le due radici separate da virgola)",
                solution=f"{r1}, {r2}",
                hints=["Poni y = 0 e risolvi l'equazione di secondo grado."],
            )

        else:
            a = random.randint(1, 2)
            vx = random.randint(1, 3)
            vy = random.randint(1, 5)
            eq = sp.expand(a * (x - vx) ** 2 + vy)
            return Exercise(
                question=f"Parabola con vertice ({vx},{vy}) e a={a}. Scrivi y = ax² + bx + c",
                solution=str(eq),
                hints=[f"y = {a}(x - {vx})² + {vy}", "Sviluppa il quadrato."],
            )


register("parabola", ParabolaGenerator())
