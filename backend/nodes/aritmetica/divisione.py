import random

from .. import register
from ..base import Exercise, NodeGenerator


class DivisioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            b = random.randint(2, 9)
            a = b * random.randint(1, 9)
            remainder = 0
        elif level == 2:
            b = random.randint(2, 12)
            a = b * random.randint(2, 15)
            remainder = 0
        else:
            b = random.randint(2, 12)
            q = random.randint(5, 30)
            a = b * q + random.randint(0, b - 1)
            remainder = a % b

        if remainder:
            question = f"Quanto fa {a} ÷ {b}? (scrivi con resto)"
            solution = f"{a // b} resto {remainder}"
            hints = [
                "Trova il numero che moltiplicato per il divisore si avvicina al dividendo.",
                "Il resto deve essere minore del divisore.",
            ]
        else:
            question = f"Quanto fa {a} ÷ {b}?"
            solution = str(a // b)
            hints = ["Pensa: per quale numero devo moltiplicare il divisore?"]

        return Exercise(question=question, solution=solution, hints=hints)


register("divisione", DivisioneGenerator())
