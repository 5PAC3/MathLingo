import random

from .. import register
from ..base import Exercise, NodeGenerator


class RettaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            x1 = random.randint(1, 5)
            y1 = random.randint(1, 5)
            x2 = random.randint(6, 10)
            y2 = random.randint(6, 10)
            m = (y2 - y1) / (x2 - x1)
            return Exercise(
                question=f"Calcola il coefficiente angolare della retta passante per ({x1},{y1}) e ({x2},{y2})",
                solution=str(int(m)) if m == int(m) else str(m),
                hints=[f"m = (y₂ - y₁)/(x₂ - x₁) = ({y2}-{y1})/({x2}-{x1})"],
            )

        elif level == 2:
            template = random.choice(["due_punti", "punto_pendenza"])
            if template == "due_punti":
                x1 = random.randint(1, 4)
                y1 = random.randint(1, 4)
                x2 = random.randint(5, 8)
                y2 = random.randint(5, 8)
                m = (y2 - y1) / (x2 - x1)
                q = y1 - m * x1
                expr = f"y = {int(m)}x + {int(q)}" if m == int(m) and q == int(q) else f"y = {m}x + {q}"
                return Exercise(
                    question=f"Equazione della retta passante per ({x1},{y1}) e ({x2},{y2})",
                    solution=expr,
                    hints=[f"m = ({y2}-{y1})/({x2}-{x1})", f"q = y - mx → {y1} - {m}×{x1}"],
                )
            else:
                m = random.randint(1, 4)
                x0 = random.randint(1, 5)
                y0 = random.randint(1, 5)
                q = y0 - m * x0
                return Exercise(
                    question=f"Retta con m={m} passante per ({x0},{y0}). Scrivi y = mx + q",
                    solution=f"y = {m}x + {int(q)}" if q == int(q) else f"y = {m}x + {q}",
                    hints=[f"y - {y0} = {m}(x - {x0})", f"q = {y0} - {m}×{x0} = {q}"],
                )

        else:
            m1 = random.randint(1, 4)
            q1 = random.randint(1, 5)
            x_test = random.randint(1, 5)
            y_test = m1 * x_test + q1
            m2 = -1 / m1
            return Exercise(
                question=f"Data la retta y = {m1}x + {q1}, trova m della retta perpendicolare. Quanto vale?",
                solution=str(int(m2)) if m2 == int(m2) else str(m2),
                hints=["Due rette sono perpendicolari se m₁ × m₂ = -1"],
            )


register("retta", RettaGenerator())
