import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class DisequazioniGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        template = random.choice(["lineare", "composta"] if level > 1 else ["lineare"])

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            xval = random.randint(0, 5)
            sol = a * xval + b > 0
            return Exercise(
                question=f"x = {xval} soddisfa {a}x + {b} > 0? (si/no)",
                solution="si" if sol else "no",
                hints=[f"Sostituisci: {a}×{xval} + {b} = {a*xval + b}."],
            )

        elif level == 2:
            a = random.randint(1, 4)
            b = random.randint(1, 8)
            c = random.randint(1, 4)
            d = random.randint(1, 8)
            xval = random.randint(0, 4)

            variants = [
                (
                    f"{a}x + {b} ≥ {c}x + {d}",
                    a * xval + b >= c * xval + d,
                    "Sposta i termini con x a sinistra e quelli noti a destra.",
                ),
                (
                    f"{a}x + {b} < {c}x + {d}",
                    a * xval + b < c * xval + d,
                    "Risolvi come un'equazione, ma attento al segno se moltiplichi per negativo.",
                ),
            ]
            expr, sol, hint = random.choice(variants)
            return Exercise(
                question=f"x = {xval} soddisfa {expr}? (si/no)",
                solution="si" if sol else "no",
                hints=[hint],
            )

        else:
            xval = random.randint(0, 5)

            if random.choice([True, False]):
                a = random.randint(1, 3)
                b = random.randint(1, 4)
                c = random.randint(1, 5)
                test = (xval + a) * (xval + b) > 0
                return Exercise(
                    question=f"x = {xval} soddisfa (x + {a})(x + {b}) > 0? (si/no)",
                    solution="si" if test else "no",
                    hints=["Il prodotto di due numeri è positivo se sono entrambi positivi o entrambi negativi."],
                )
            else:
                a = random.randint(1, 3)
                b = random.randint(1, 5)
                c = random.randint(1, 3)
                num = a * xval + b
                den = c * xval + a
                if den == 0:
                    return Exercise(
                        question=f"x = {xval} soddisfa ({a}x+{b})/({c}x+{a}) ≥ 0? (si/no)",
                        solution="si" if num == 0 else "no",
                        hints=["Il denominatore si annulla, la disequazione non è definita."],
                    )
                test = (num) / den >= 0
                return Exercise(
                    question=f"x = {xval} soddisfa ({a}x+{b})/({c}x+{a}) ≥ 0? (si/no)",
                    solution="si" if test else "no",
                    hints=["Una frazione è ≥ 0 quando numeratore e denominatore sono concordi."],
                )


register("disequazioni", DisequazioniGenerator())
