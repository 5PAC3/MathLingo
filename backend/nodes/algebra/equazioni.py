import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class EquazioniPrimoGradoGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        template = random.choice(["standard", "parentesi", "frazioni"] if level > 1 else ["standard"])

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            c = random.randint(1, 20)
            match template:
                case "standard":
                    eq = sp.Eq(a * x + b, c)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: {a}x + {b} = {c}",
                        solution=str(sol),
                        hints=[f"Porta {b} a destra: {a}x = {c - b}", f"Dividi per {a}."],
                    )
                case _:
                    eq = sp.Eq(a * x + b, c)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: {a}x + {b} = {c}",
                        solution=str(sol),
                        hints=[f"Porta {b} a destra: {a}x = {c - b}", f"Dividi per {a}."],
                    )

        elif level == 2:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            c = random.randint(1, 5)
            d = random.randint(1, 10)
            match template:
                case "standard":
                    if a == c:
                        c += 1
                    eq = sp.Eq(a * x + b, c * x + d)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: {a}x + {b} = {c}x + {d}",
                        solution=str(sol),
                        hints=["Porta le x a sinistra e i numeri a destra.", f"{a - c}x = {d - b}", f"Dividi per {a - c}."],
                    )
                case "parentesi":
                    k = random.randint(2, 4)
                    eq = sp.Eq(k * (a * x + b), c)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: {k}({a}x + {b}) = {c}",
                        solution=str(sol),
                        hints=[f"Applica la proprietà distributiva: {k*a}x + {k*b} = {c}"],
                    )
                case "frazioni":
                    d1 = random.randint(2, 4)
                    eq = sp.Eq(a * x / d1 + b, c)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: ({a}x)/{d1} + {b} = {c}",
                        solution=str(sol),
                        hints=[f"Moltiplica tutto per {d1}: {a}x + {b*d1} = {c*d1}"],
                    )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 5)
            c = random.randint(1, 5)
            d = random.randint(1, 6)
            match template:
                case "standard":
                    eq = sp.Eq(a * (b * x + c), d)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: {a}({b}x + {c}) = {d}",
                        solution=str(sol),
                        hints=["Applica distributiva.", "Porta i termini noti a destra.", "Dividi per il coefficiente di x."],
                    )
                case "parentesi":
                    eq = sp.Eq((a * x + b) * (c * x + d) / (c * x + d), a * x + b)
                    # Simplify to just ask a direct equation
                    eq = sp.Eq(a * (b * x + c), d * x + a)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: {a}({b}x + {c}) = {d}x + {a}",
                        solution=str(sol),
                        hints=["Distribuisci, poi porta le x a sinistra."],
                    )
                case "frazioni":
                    d1 = random.randint(2, 4)
                    d2 = random.randint(3, 5)
                    eq = sp.Eq(a * x / d1 + b / d2, c)
                    sol = sp.solve(eq, x)[0]
                    return Exercise(
                        question=f"Risolvi: ({a}x)/{d1} + {b}/{d2} = {c}",
                        solution=str(sol),
                        hints=[f"Moltiplica per mcm({d1},{d2}) = {d1*d2}."],
                    )


register("equazioni-primo-grado", EquazioniPrimoGradoGenerator())
