import random

from .. import register
from ..base import Exercise, NodeGenerator


class MoltiplicazioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            a = random.randint(2, 9)
            b = random.randint(2, 9)
        elif level == 2:
            a = random.randint(10, 20)
            b = random.randint(2, 5)
        else:
            a = random.randint(10, 99)
            b = random.randint(2, 9)

        question = f"Quanto fa {a} × {b}?"
        solution = str(a * b)
        hints = ["Ricorda le tabelline."]
        if level > 1:
            hints.append("Moltiplica prima le unità, poi le decine.")

        return Exercise(question=question, solution=solution, hints=hints)


register("moltiplicazione", MoltiplicazioneGenerator())
