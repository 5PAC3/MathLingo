import random

from .. import register
from ..base import Exercise, NodeGenerator


class AlgebraBooleanaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            a = random.choice(["Vero", "Falso"])
            b = random.choice(["Vero", "Falso"])
            op = random.choice(["AND", "OR"])

            va = a == "Vero"
            vb = b == "Vero"

            if op == "AND":
                result = va and vb
                question = f"Calcola: {a} AND {b}"
                hints = ["AND dà Vero solo se entrambi sono Vero."]
            else:
                result = va or vb
                question = f"Calcola: {a} OR {b}"
                hints = ["OR dà Vero se almeno uno è Vero."]

            solution = "Vero" if result else "Falso"

        elif level == 2:
            a = random.choice(["Vero", "Falso"])
            va = a == "Vero"

            sub = random.choice(["NOT", "NAND", "NOR"])

            if sub == "NOT":
                result = not va
                question = f"Calcola: NOT {a}"
                hints = ["NOT inverte il valore."]
                solution = "Vero" if result else "Falso"

            elif sub == "NAND":
                b = random.choice(["Vero", "Falso"])
                vb = b == "Vero"
                result = not (va and vb)
                question = f"Calcola: {a} NAND {b}"
                hints = ["NAND = NOT(A AND B). Calcola AND poi nega."]
                solution = "Vero" if result else "Falso"

            else:
                b = random.choice(["Vero", "Falso"])
                vb = b == "Vero"
                result = not (va or vb)
                question = f"Calcola: {a} NOR {b}"
                hints = ["NOR = NOT(A OR B). Calcola OR poi nega."]
                solution = "Vero" if result else "Falso"

        else:
            a = random.choice(["Vero", "Falso"])
            b = random.choice(["Vero", "Falso"])
            c = random.choice(["Vero", "Falso"])
            va = a == "Vero"
            vb = b == "Vero"
            vc = c == "Vero"

            expr_type = random.choice([
                ("(A AND B) OR C", lambda: (va and vb) or vc),
                ("A AND (B OR C)", lambda: va and (vb or vc)),
                ("NOT(A OR B) AND C", lambda: not (va or vb) and vc),
            ])

            desc, fn = expr_type
            result = fn()
            question = f"Calcola: {desc} con A={a}, B={b}, C={c}"
            hints = ["Risolvi prima le parentesi, passo per passo."]
            solution = "Vero" if result else "Falso"

        return Exercise(question=question, solution=solution, hints=hints)


register("algebra-booleana", AlgebraBooleanaGenerator())
