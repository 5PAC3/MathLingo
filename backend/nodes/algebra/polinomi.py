import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class PolinomiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        template = random.choice(["somma", "prodotto"] if level > 1 else ["somma"])

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 5)
            c = random.randint(1, 5)
            d = random.randint(1, 5)

            match template:
                case "somma":
                    p1 = a * x + b
                    p2 = c * x + d
                    sol = sp.expand(p1 + p2)
                    return Exercise(
                        question=f"Somma: ({a}x + {b}) + ({c}x + {d})",
                        solution=str(sol),
                        hints=["Somma separatamente i termini con x e i numeri."],
                    )
                case _:
                    p1 = a * x + b
                    p2 = c * x + d
                    sol = sp.expand(p1 + p2)
                    return Exercise(
                        question=f"Somma: ({a}x + {b}) + ({c}x + {d})",
                        solution=str(sol),
                        hints=["Somma separatamente i termini con x e i numeri."],
                    )

        elif level == 2:
            a = random.randint(1, 4)
            b = random.randint(1, 5)
            c = random.randint(1, 4)
            d = random.randint(1, 5)

            match template:
                case "somma":
                    p1 = a * x**2 + b * x + c
                    p2 = d * x + a
                    sol = sp.expand(p1 + p2)
                    return Exercise(
                        question=f"Somma: ({a}x² + {b}x + {c}) + ({d}x + {a})",
                        solution=str(sol),
                        hints=["Raggruppa i termini dello stesso grado."],
                    )
                case "prodotto":
                    p1 = a * x + b
                    p2 = c * x + d
                    sol = sp.expand(p1 * p2)
                    return Exercise(
                        question=f"Moltiplica: ({a}x + {b})({c}x + {d})",
                        solution=str(sol),
                        hints=["Applica la proprietà distributiva: moltiplica ogni termine per ogni termine."],
                    )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 3)
            c = random.randint(1, 3)
            d = random.randint(1, 3)

            ops = random.choice(["somma", "prodotto", "complesso"])
            match ops:
                case "somma":
                    p1 = a * x**3 + b * x**2 + c
                    p2 = d * x**2 + a * x + b
                    sol = sp.expand(p1 + p2)
                    return Exercise(
                        question=f"Somma: ({a}x³ + {b}x² + {c}) + ({d}x² + {a}x + {b})",
                        solution=str(sol),
                        hints=["Allinea i termini per grado decrescente."],
                    )
                case "prodotto":
                    p1 = a * x**2 + b * x + c
                    p2 = d * x + a
                    sol = sp.expand(p1 * p2)
                    return Exercise(
                        question=f"Moltiplica: ({a}x² + {b}x + {c})({d}x + {a})",
                        solution=str(sol),
                        hints=[f"Moltiplica {d}x per ogni termine del primo, poi {a} per ogni termine."],
                    )
                case "complesso":
                    p1 = a * x + b
                    p2 = c * x + d
                    p3 = a * x + c
                    sol = sp.expand(p1 * p2 + p3)
                    return Exercise(
                        question=f"Calcola: ({a}x + {b})({c}x + {d}) + ({a}x + {c})",
                        solution=str(sol),
                        hints=["Prima moltiplica le parentesi, poi somma."],
                    )


register("polinomi", PolinomiGenerator())
