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

        template = random.choice(["riduzione", "sostituzione", "cramer"] if level > 1 else ["riduzione"])

        if template == "sostituzione":
            var = random.choice(["x", "y"])
            val = xv if var == "x" else yv
            return Exercise(
                question=f"Risolvi per sostituzione: {{ {a}x + {b}y = {c}, {d}x + {e}y = {f} }}. Quanto vale {var}?",
                solution=str(val),
                hints=[f"Isola {var} in un'equazione e sostituisci nell'altra."],
            )
        elif template == "cramer":
            det = a * e - b * d
            det_x = c * e - b * f
            det_y = a * f - c * d
            return Exercise(
                question=f"Usa Cramer: {{ {a}x + {b}y = {c}, {d}x + {e}y = {f} }}. Quanto vale x?",
                solution=str(det_x // det),
                hints=[f"det = {a}×{e} - {b}×{d} = {det}", f"det_x = {c}×{e} - {b}×{f} = {det_x}", f"x = {det_x}/{det} = {det_x // det}"],
            )
        else:
            if random.choice([True, False]):
                return Exercise(
                    question=f"Risolvi: {{ {a}x + {b}y = {c}, {d}x + {e}y = {f} }}. Quanto vale x?",
                    solution=str(xv),
                    hints=["Somma o sottrai le equazioni dopo aver moltiplicato opportunamente."],
                )
            else:
                return Exercise(
                    question=f"Risolvi: {{ {a}x + {b}y = {c}, {d}x + {e}y = {f} }}. Quanto vale y?",
                    solution=str(yv),
                    hints=["Usa il metodo di riduzione per eliminare una variabile."],
                )


register("sistemi-lineari", SistemiLineariGenerator())
