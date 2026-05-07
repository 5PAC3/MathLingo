import random

from .. import register
from ..base import Exercise, NodeGenerator


class SottrazioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            b = random.randint(1, 9)
            a = random.randint(b, 9)
        elif level == 2:
            b = random.randint(1, 50)
            a = random.randint(b, 99)
        else:
            b = random.randint(1, 200)
            a = random.randint(b, 500)

        question = f"Quanto fa {a} - {b}?"
        solution = str(a - b)
        hints = ["Sottrai le unità, poi le decine."]
        if level > 1:
            hints.append("Se necessario, fai il prestito dalla decina.")

        return Exercise(question=question, solution=solution, hints=hints)


register("sottrazione", SottrazioneGenerator())
