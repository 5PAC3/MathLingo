import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class ScomposizionePolinomiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 5)
            poly = a * x + a * b
            factored = a * (x + b)
            return Exercise(
                question=f"Scomponi: {str(poly)}",
                solution=str(factored),
                hints=[f"Metti in evidenza il fattore comune {a}."],
            )

        elif level == 2:
            a = random.randint(1, 4)
            b = random.randint(1, 6)
            s = a + b
            p = a * b
            poly = x**2 + s * x + p
            factored = (x + a) * (x + b)
            return Exercise(
                question=f"Scomponi: {str(poly)}",
                solution=str(factored),
                hints=[f"Cerca due numeri che sommati diano {s} e moltiplicati diano {p}."],
            )

        else:
            template = random.choice(["quadrati", "cubi"])
            if template == "quadrati":
                a = random.randint(1, 5)
                b = random.randint(1, 5)
                poly = a**2 * x**2 - b**2
                factored = (a * x - b) * (a * x + b)
                return Exercise(
                    question=f"Scomponi: {str(poly)}",
                    solution=str(factored),
                    hints=[f"Differenza di quadrati: ({a}x)² - ({b})²"],
                )
            else:
                a = random.randint(1, 3)
                b = random.randint(1, 3)
                poly = a**3 * x**3 + b**3
                factored = (a * x + b) * (a**2 * x**2 - a * b * x + b**2)
                return Exercise(
                    question=f"Scomponi: {str(poly)}",
                    solution=str(factored),
                    hints=[f"Somma di cubi: ({a}x)³ + {b}³"],
                )


register("scomposizione-polinomi", ScomposizionePolinomiGenerator())
