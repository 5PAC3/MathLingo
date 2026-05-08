import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class SistemiLineariGenerator(NodeGenerator):
    def _gen_system(self, level: int):
        x, y = sp.symbols("x y")
        while True:
            if level == 1:
                a = random.randint(1, 5)
                b = random.randint(1, 5)
                c = random.randint(1, 10)
                d = random.randint(1, 5)
                e = random.randint(1, 5)
                f = random.randint(1, 10)
            elif level == 2:
                a = random.randint(1, 6)
                b = random.randint(1, 6)
                c = random.randint(1, 15)
                d = random.randint(1, 6)
                e = random.randint(1, 6)
                f = random.randint(1, 15)
            else:
                a = random.randint(1, 8)
                b = random.randint(1, 8)
                c = random.randint(1, 20)
                d = random.randint(1, 8)
                e = random.randint(1, 8)
                f = random.randint(1, 20)

            try:
                sol = sp.solve([sp.Eq(a * x + b * y, c), sp.Eq(d * x + e * y, f)], (x, y), dict=True)[0]
            except (IndexError, TypeError):
                continue

            xv = float(sol[x])
            yv = float(sol[y])
            if xv.is_integer() and yv.is_integer() and -50 <= xv <= 50 and -50 <= yv <= 50:
                return a, b, c, d, e, f, int(xv), int(yv)

    def generate(self, level: int) -> Exercise:
        x, y = sp.symbols("x y")
        a, b, c, d, e, f, xv, yv = self._gen_system(level)

        if random.choice([True, False]):
            return Exercise(
                question=f"Risolvi il sistema: {{ {a}x + {b}y = {c}, {d}x + {e}y = {f} }}. Quanto vale x?",
                solution=str(xv),
                hints=["Isola una variabile in un'equazione e sostituisci nell'altra."],
            )
        else:
            return Exercise(
                question=f"Risolvi: {{ {a}x + {b}y = {c}, {d}x + {e}y = {f} }}. Quanto vale y?",
                solution=str(yv),
                hints=["Usa il metodo di sostituzione o di riduzione."],
            )


register("sistemi-lineari", SistemiLineariGenerator())
