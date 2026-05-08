import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class EspressioniAlgebricheGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        template = random.choice(["valuta", "semplifica"] if level > 1 else ["valuta"])

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            xval = random.randint(1, 5)
            val = a * xval + b
            if template == "valuta" or True:
                return Exercise(
                    question=f"Se x = {xval}, quanto vale {a}x + {b}?",
                    solution=str(val),
                    hints=[f"Sostituisci x con {xval}: {a}×{xval} + {b}"],
                )

        elif level == 2:
            a = random.randint(1, 5)
            b = random.randint(1, 5)
            c = random.randint(1, 5)
            xval = random.randint(1, 5)
            val = a * xval**2 + b * xval + c
            if template == "valuta" or True:
                return Exercise(
                    question=f"Per x = {xval}, calcola: {a}x² + {b}x + {c}",
                    solution=str(val),
                    hints=[f"Sostituisci: {a}×({xval})² + {b}×{xval} + {c}"],
                )

        else:
            a = random.randint(1, 4)
            b = random.randint(1, 4)
            c = random.randint(1, 3)
            d = random.randint(1, 4)
            xval = random.randint(1, 4)
            expr = (a * x + b) * (c * x + d)
            val = expr.subs(x, xval)
            return Exercise(
                question=f"Se x = {xval}, quanto vale ({a}x + {b})({c}x + {d})?",
                solution=str(val),
                hints=["Prima moltiplica le parentesi, poi sostituisci x."],
            )


register("espressioni-algebriche", EspressioniAlgebricheGenerator())
