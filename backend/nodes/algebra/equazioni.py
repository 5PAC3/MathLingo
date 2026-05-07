import random
import sympy as sp

from ..base import Exercise, NodeGenerator
from .. import register


class EquazioniPrimoGradoGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")

        if level == 1:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            c = random.randint(1, 20)
            # ax + b = c
            eq = sp.Eq(a * x + b, c)
            sol = sp.solve(eq, x)[0]
            question = f"Risolvi l'equazione: {a}*x + {b} = {c}"
            hints = [
                "Porta il termine noto dall'altra parte cambiando segno.",
                f"Dividi entrambi i membri per {a}.",
            ]

        elif level == 2:
            a = random.randint(1, 5)
            b = random.randint(1, 10)
            c = random.randint(1, 5)
            d = random.randint(1, 10)
            # ax + b = cx + d
            if a == c:
                c += 1
            eq = sp.Eq(a * x + b, c * x + d)
            sol = sp.solve(eq, x)[0]
            question = f"Risolvi l'equazione: {a}*x + {b} = {c}*x + {d}"
            hints = [
                "Porta i termini con x a sinistra e i numeri a destra.",
                "Raccogli la x e dividi.",
            ]

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 5)
            c = random.randint(1, 5)
            d = random.randint(1, 6)
            # a(bx + c) = d
            eq = sp.Eq(a * (b * x + c), d)
            sol = sp.solve(eq, x)[0]
            question = f"Risolvi l'equazione: {a}*({b}*x + {c}) = {d}"
            hints = [
                "Prima applica la proprietà distributiva.",
                "Poi porta i termini noti a destra.",
                "Infine dividi per il coefficiente della x.",
            ]

        solution = sp.latex(sol)

        return Exercise(
            question=question,
            solution=str(sol),
            hints=hints,
        )


register("equazioni-primo-grado", EquazioniPrimoGradoGenerator())
