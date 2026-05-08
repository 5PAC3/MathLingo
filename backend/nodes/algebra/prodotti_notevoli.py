import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class ProdottiNotevoliGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        y = sp.Symbol("y")

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 5)
            if random.choice([True, False]):
                expr = (a + b * x) ** 2
                sol = sp.expand(expr)
                return Exercise(
                    question=f"Sviluppa: ({a} + {b}x)² (quadrato di binomio)",
                    solution=str(sol),
                    hints=["(a+b)² = a² + 2ab + b². Applica la formula."],
                )
            else:
                expr = (a * x - b) ** 2
                sol = sp.expand(expr)
                return Exercise(
                    question=f"Sviluppa: ({a}x - {b})² (quadrato di binomio)",
                    solution=str(sol),
                    hints=["(a-b)² = a² - 2ab + b². Applica la formula."],
                )

        elif level == 2:
            a = random.randint(1, 5)
            b = random.randint(1, 5)
            if random.choice([True, False]):
                expr = (a * x + b) * (a * x - b)
                sol = sp.expand(expr)
                return Exercise(
                    question=f"Sviluppa: ({a}x + {b})({a}x - {b}) (differenza di quadrati)",
                    solution=str(sol),
                    hints=["(a+b)(a-b) = a² - b². I termini misti si annullano."],
                )
            else:
                expr = (a + b * x) ** 2
                sol = sp.expand(expr)
                return Exercise(
                    question=f"Sviluppa: ({a} + {b}x)²",
                    solution=str(sol),
                    hints=["(a+b)² = a² + 2ab + b²"],
                )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 3)
            ops = random.choice(["cubo", "somma_per_differenza", "binomio_quadrato"])
            match ops:
                case "cubo":
                    expr = (a * x + b) ** 3
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Sviluppa: ({a}x + {b})³ (cubo di binomio)",
                        solution=str(sol),
                        hints=["(a+b)³ = a³ + 3a²b + 3ab² + b³"],
                    )
                case "somma_per_differenza":
                    a1 = random.randint(1, 4)
                    b1 = random.randint(1, 4)
                    expr = (a1 * x + b1 * y) * (a1 * x - b1 * y)
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Sviluppa: ({a1}x + {b1}y)({a1}x - {b1}y)",
                        solution=str(sol),
                        hints=["(a+b)(a-b) = a² - b²"],
                    )
                case "binomio_quadrato":
                    expr = (a * x + b * y) ** 2
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Sviluppa: ({a}x + {b}y)²",
                        solution=str(sol),
                        hints=["(a+b)² = a² + 2ab + b²"],
                    )


register("prodotti-notevoli", ProdottiNotevoliGenerator())
