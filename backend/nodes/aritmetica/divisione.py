import random

from .. import register
from ..base import Exercise, NodeGenerator


class DivisioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice([
            "standard", "inversa", "resto", "meta"
        ] if level > 1 else ["standard", "inversa"])

        if level == 1:
            b = random.randint(2, 9)
            a = b * random.randint(1, 9)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} ÷ {b}?",
                        solution=str(a // b),
                        hints=[f"Pensa: per quale numero devo moltiplicare {b}?"],
                    )
                case "inversa":
                    q = random.randint(1, 9)
                    a = b * q
                    return Exercise(
                        question=f"{a} ÷ ? = {q}",
                        solution=str(b),
                        hints=[f"Dividi {a} per {q} per trovare il divisore."],
                    )

        elif level == 2:
            b = random.randint(2, 12)
            a = b * random.randint(2, 15)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} ÷ {b}?",
                        solution=str(a // b),
                        hints=[f"Quale numero × {b} dà {a}?"],
                    )
                case "inversa":
                    q = a // b
                    return Exercise(
                        question=f"{a} ÷ ? = {q}",
                        solution=str(b),
                        hints=[f"{q} × ? = {a}"],
                    )
                case "resto":
                    r = random.randint(1, b - 1)
                    a = b * random.randint(2, 12) + r
                    return Exercise(
                        question=f"Quanto fa {a} ÷ {b}? (scrivi con resto)",
                        solution=f"{a // b} resto {a % b}",
                        hints=["Trova il multiplo più vicino inferiore o uguale."],
                    )
                case "meta":
                    return Exercise(
                        question=f"Quanto è la metà di {a}?",
                        solution=str(a // 2),
                        hints=["Dividi per 2."],
                    )

        else:
            b = random.randint(2, 12)
            q = random.randint(5, 30)
            a = b * q + random.randint(0, b - 1)
            r = a % b
            match template:
                case "standard":
                    if r:
                        return Exercise(
                            question=f"Quanto fa {a} ÷ {b}? (con resto)",
                            solution=f"{a // b} resto {r}",
                            hints=[f"Quanto fa {b} × {a//b}? Il resto è ciò che avanza."],
                        )
                    else:
                        return Exercise(
                            question=f"Quanto fa {a} ÷ {b}?",
                            solution=str(a // b),
                            hints=[f"{b} × ? = {a}"],
                        )
                case "inversa":
                    return Exercise(
                        question=f"? × {b} = {a} (se c'è resto, scrivi quante volte + resto)",
                        solution=f"{a // b} resto {r}" if r else str(a // b),
                        hints=[f"Dividi {a} per {b}."],
                    )
                case "resto":
                    return Exercise(
                        question=f"Qual è il quoziente e il resto di {a} ÷ {b}?",
                        solution=f"{a // b} resto {r}",
                        hints=[f"{b} sta quante volte in {a}? Quanto avanza?"],
                    )
                case "meta":
                    a = b * random.randint(5, 30)
                    return Exercise(
                        question=f"Quanto è un mezzo di {a}?",
                        solution=str(a // 2),
                        hints=[f"Calcola {a} ÷ 2."],
                    )


register("divisione", DivisioneGenerator())
