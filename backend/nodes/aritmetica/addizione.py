import random

from .. import register
from ..base import Exercise, NodeGenerator


class AddizioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice([
            "standard", "inversa", "tre_numeri", "decine_mancanti"
        ] if level > 1 else ["standard", "completamento"])

        if level == 1:
            a = random.randint(1, 9)
            b = random.randint(1, 9)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} + {b}?",
                        solution=str(a + b),
                        hints=["Conta partendo dal numero più grande."],
                    )
                case "completamento":
                    tot = a + random.randint(1, 9)
                    return Exercise(
                        question=f"{a} + ? = {tot}",
                        solution=str(tot - a),
                        hints=["Sottrai {a} da {tot}."],
                    )

        elif level == 2:
            a = random.randint(10, 99)
            b = random.randint(10, 99)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} + {b}?",
                        solution=str(a + b),
                        hints=["Somma prima le unità, poi le decine, e fai il riporto."],
                    )
                case "inversa":
                    tot = a + b
                    return Exercise(
                        question=f"Quale numero sommato a {a} dà {tot}?",
                        solution=str(b),
                        hints=["Sottrai {a} da {tot}."],
                    )
                case "tre_numeri":
                    c = random.randint(1, 9)
                    return Exercise(
                        question=f"Quanto fa {a} + {b} + {c}?",
                        solution=str(a + b + c),
                        hints=["Somma i primi due, poi aggiungi il terzo."],
                    )
                case "decine_mancanti":
                    target = ((a // 10) + 1) * 10
                    needed = target - a
                    return Exercise(
                        question=f"Quanto manca a {a} per arrivare a {target}?",
                        solution=str(needed),
                        hints=["Conta quanto ti serve per arrivare alla decina successiva."],
                    )

        else:
            a = random.randint(100, 999)
            b = random.randint(100, 999)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} + {b}?",
                        solution=str(a + b),
                        hints=["Allinea in colonna e somma partendo dalle unità."],
                    )
                case "inversa":
                    tot = a + b
                    return Exercise(
                        question=f"Quale numero sommato a {a} dà {tot}?",
                        solution=str(b),
                        hints=["Sottrai {a} da {tot}."],
                    )
                case "tre_numeri":
                    c = random.randint(10, 99)
                    return Exercise(
                        question=f"Calcola la somma: {a} + {b} + {c}",
                        solution=str(a + b + c),
                        hints=["Somma a due a due e poi aggiungi il terzo."],
                    )
                case "decine_mancanti":
                    target = a + random.randint(1, 9) * 10
                    needed = target - a
                    return Exercise(
                        question=f"Che numero aggiungere a {a} per ottenere {target}?",
                        solution=str(needed),
                        hints=["Sottrai {a} da {target}."],
                    )


register("addizione", AddizioneGenerator())
