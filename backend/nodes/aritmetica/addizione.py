import random

from ..base import Exercise, NodeGenerator
from .. import register


class AddizioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            a = random.randint(1, 9)
            b = random.randint(1, 9)
        elif level == 2:
            a = random.randint(10, 99)
            b = random.randint(10, 99)
        else:
            a = random.randint(100, 500)
            b = random.randint(100, 500)
            c = random.randint(10, 99)

        if level <= 2:
            question = f"Quanto fa {a} + {b}?"
            solution = str(a + b)
            hints = ["Somma i due numeri partendo dalle unità."]
        else:
            question = f"Quanto fa {a} + {b} + {c}?"
            solution = str(a + b + c)
            hints = ["Somma i primi due numeri, poi aggiungi il terzo."]

        return Exercise(
            question=question,
            solution=solution,
            hints=hints,
        )


register("addizione", AddizioneGenerator())
