import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class EspressioniAlgebricheGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        y = sp.Symbol("y")
        templates = ["valuta", "semplifica", "frazione", "multivariabile"]
        available = templates[:2] if level == 1 else (templates[:3] if level == 2 else templates)
        template = random.choice(available)

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            xval = random.randint(1, 5)
            val = a * xval + b
            return Exercise(
                question=f"Se x = {xval}, quanto vale {a}x + {b}?",
                solution=str(val),
                hints=[f"Sostituisci x con {xval}: {a}×{xval} + {b}"],
            )

        elif level == 2:
            if template == "valuta":
                a = random.randint(1, 5)
                b = random.randint(1, 5)
                c = random.randint(1, 5)
                xval = random.randint(1, 5)
                val = a * xval**2 + b * xval + c
                return Exercise(
                    question=f"Per x = {xval}, calcola: {a}x² + {b}x + {c}",
                    solution=str(val),
                    hints=[f"Sostituisci: {a}×({xval})² + {b}×{xval} + {c}"],
                )
            elif template == "semplifica":
                a = random.randint(2, 5)
                b = random.randint(1, 5)
                c = random.randint(1, 4)
                d = random.randint(1, 5)
                expr = a * x + b + c * x + d
                simplified = sp.simplify(expr)
                return Exercise(
                    question=f"Semplifica: {a}x + {b} + {c}x + {d}",
                    solution=str(simplified),
                    hints=[f"Somma i termini simili: ({a}+{c})x + ({b}+{d})"],
                )
            else:
                a = random.randint(1, 4)
                b = random.randint(1, 4)
                c = random.randint(1, 4)
                xval = random.randint(1, 4)
                num = a * xval + b
                den = c * xval + a
                val = round(num / den, 2)
                return Exercise(
                    question=f"Per x = {xval}, calcola: ({a}x+{b})/({c}x+{a}) (arrotonda a 2 decimali)",
                    solution=str(val),
                    hints=[f"Num = {a}×{xval}+{b} = {num}", f"Den = {c}×{xval}+{a} = {den}"],
                )

        else:
            if template == "valuta":
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
            elif template == "multivariabile":
                a = random.randint(1, 3)
                b = random.randint(1, 3)
                c = random.randint(1, 3)
                xv = random.randint(1, 4)
                yv = random.randint(1, 4)
                val = a * xv + b * yv + c
                return Exercise(
                    question=f"Per x={xv}, y={yv}: calcola {a}x + {b}y + {c}",
                    solution=str(val),
                    hints=[f"Sostituisci: {a}×{xv} + {b}×{yv} + {c}"],
                )
            else:
                a = random.randint(1, 3)
                b = random.randint(1, 4)
                c = random.randint(1, 3)
                d = random.randint(1, 4)
                xval = random.randint(1, 4)
                num = a * xval**2 + b * xval + c
                if num == 0:
                    num = 1
                den = d * xval + a
                val = round(num / den, 2)
                return Exercise(
                    question=f"Per x={xval}: ({a}x²+{b}x+{c})/({d}x+{a}) (2 decimali)",
                    solution=str(val),
                    hints=[f"Calcola numeratore e denominatore separatamente."],
                )


register("espressioni-algebriche", EspressioniAlgebricheGenerator())
