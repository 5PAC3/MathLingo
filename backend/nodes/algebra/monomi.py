import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class MonomiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        y = sp.Symbol("y")
        template = random.choice(["prodotto", "potenza"] if level > 1 else ["prodotto"])

        if level == 1:
            a = random.randint(2, 5)
            b = random.randint(2, 5)
            match template:
                case "prodotto":
                    expr = a * x * b * y
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Calcola: {a}x × {b}y",
                        solution=str(sol),
                        hints=["Moltiplica i coefficienti tra loro e le lettere tra loro."],
                    )
                case _:
                    a = random.randint(2, 4)
                    expr = a * x * 3 * x
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Calcola: {a}x × 3x",
                        solution=str(sol),
                        hints=[f"Moltiplica {a}×3 e x×x."],
                    )

        elif level == 2:
            a = random.randint(2, 4)
            b = random.randint(2, 3)
            match template:
                case "prodotto":
                    a1 = random.randint(2, 4)
                    a2 = random.randint(2, 4)
                    e1 = random.randint(1, 2)
                    e2 = random.randint(1, 2)
                    expr = a1 * x**e1 * a2 * y**e2
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Calcola: {a1}x^{e1} × {a2}y^{e2}",
                        solution=str(sol),
                        hints=["Coefficienti insieme, lettere insieme."],
                    )
                case "potenza":
                    expr = (a * x**b) ** b
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Calcola: ({a}x^{b})^{b}",
                        solution=str(sol),
                        hints=[f"Applica la potenza a coefficiente e lettera: ({a})^{b} × (x^{b})^{b}"],
                    )

        else:
            a = random.randint(2, 4)
            b = random.randint(2, 3)
            ops = random.choice(["prodotto", "potenza", "divisione"])
            match ops:
                case "prodotto":
                    a1 = random.randint(2, 5)
                    a2 = random.randint(2, 4)
                    e1 = random.randint(1, 3)
                    e2 = random.randint(2, 3)
                    expr = a1 * x**e1 * a2 * x**e2
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Calcola: {a1}x^{e1} × {a2}x^{e2}",
                        solution=str(sol),
                        hints=["Somma gli esponenti delle lettere uguali."],
                    )
                case "potenza":
                    expr = (a * x**b) ** (b + 1)
                    sol = sp.expand(expr)
                    return Exercise(
                        question=f"Calcola: ({a}x^{b})^{b+1}",
                        solution=str(sol),
                        hints=[f"({a})^{b+1} × (x^{b})^{b+1}"],
                    )
                case "divisione":
                    e1 = random.randint(3, 5)
                    e2 = random.randint(1, e1 - 1)
                    a1 = a * random.randint(2, 4)
                    a2 = a
                    expr = (a1 * x**e1) / (a2 * x**e2)
                    sol = sp.simplify(expr)
                    return Exercise(
                        question=f"Dividi: ({a1}x^{e1}) ÷ ({a2}x^{e2})",
                        solution=str(sol),
                        hints=["Dividi i coefficienti e sottrai gli esponenti."],
                    )


register("monomi", MonomiGenerator())
