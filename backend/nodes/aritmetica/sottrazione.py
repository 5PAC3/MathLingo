import random

from .. import register
from ..base import Exercise, NodeGenerator


class SottrazioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice([
            "standard", "differenza", "completamento", "confronto"
        ] if level > 1 else ["standard", "completamento"])

        if level == 1:
            b = random.randint(1, 9)
            a = random.randint(b, 9)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} - {b}?",
                        solution=str(a - b),
                        hints=["Togli {b} da {a} contando all'indietro."],
                    )
                case "completamento":
                    diff = random.randint(1, 5)
                    a = b + diff + random.randint(0, 3)
                    return Exercise(
                        question=f"{a} - ? = {diff}",
                        solution=str(a - diff),
                        hints=["Quanto devi togliere per ottenere {diff}?"],
                    )

        elif level == 2:
            b = random.randint(1, 50)
            a = random.randint(b, 99)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} - {b}?",
                        solution=str(a - b),
                        hints=["Se necessario, fai il prestito dalla decina."],
                    )
                case "differenza":
                    diff = a - b
                    return Exercise(
                        question=f"Che differenza c'è tra {a} e {b}?",
                        solution=str(diff),
                        hints=["Sottrai il numero più piccolo dal più grande."],
                    )
                case "completamento":
                    diff = random.randint(1, 20)
                    b = random.randint(1, 50)
                    a = b + diff
                    return Exercise(
                        question=f"Quanto fa {a} - ? = {diff}",
                        solution=str(b),
                        hints=["Sottrai {diff} da {a}."],
                    )
                case "confronto":
                    diff = a - b
                    return Exercise(
                        question=f"Quanto è più grande {a} di {b}?",
                        solution=str(diff),
                        hints=["Fai la differenza tra i due numeri."],
                    )

        else:
            b = random.randint(1, 200)
            a = random.randint(b, 999)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} - {b}?",
                        solution=str(a - b),
                        hints=["Allinea in colonna e sottrai con prestiti."],
                    )
                case "differenza":
                    diff = a - b
                    return Exercise(
                        question=f"Calcola la differenza: {a} - {b}",
                        solution=str(diff),
                        hints=["Procedi con calma, prestito dopo prestito."],
                    )
                case "completamento":
                    diff = random.randint(10, 100)
                    b = random.randint(50, 300)
                    a = b + diff
                    return Exercise(
                        question=f"{a} - ? = {diff}  Trova il numero mancante.",
                        solution=str(b),
                        hints=["Sposta {diff} dall'altra parte."],
                    )
                case "confronto":
                    diff = a - b
                    return Exercise(
                        question=f"{a} supera {b} di quanto?",
                        solution=str(diff),
                        hints=["Calcola la differenza."],
                    )


register("sottrazione", SottrazioneGenerator())
