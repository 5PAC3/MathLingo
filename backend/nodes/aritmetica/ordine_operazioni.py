import random

from .. import register
from ..base import Exercise, NodeGenerator


class OrdineOperazioniGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["standard", "completamento"] if level > 1 else ["standard"])

        if level == 1:
            a = random.randint(2, 9)
            b = random.randint(2, 9)
            c = random.randint(2, 9)
            if random.choice([True, False]):
                expr = f"{a} + {b} \u00d7 {c}"
                val = a + b * c
                hints = ["Prima la moltiplicazione, poi l'addizione."]
            else:
                expr = f"{a} \u00d7 {b} - {c}"
                val = a * b - c
                hints = ["Prima la moltiplicazione, poi la sottrazione."]

            match template:
                case "standard":
                    return Exercise(question=f"Calcola: {expr}", solution=str(val), hints=hints)
                case "completamento":
                    return Exercise(
                        question=f"Quanto fa {expr}?",
                        solution=str(val),
                        hints=hints,
                    )

        elif level == 2:
            a = random.randint(2, 9)
            b = random.randint(2, 5)
            c = random.randint(2, 9)

            if random.choice([True, False]):
                expr = f"({a} + {b}) \u00d7 {c}"
                val = (a + b) * c
                hints = ["Prima calcola la parentesi, poi moltiplica."]
            else:
                expr = f"{a} \u00d7 ({b} + {c})"
                val = a * (b + c)
                hints = ["Prima la parentesi, poi la moltiplicazione."]

            if template == "standard":
                return Exercise(question=f"Calcola: {expr}", solution=str(val), hints=hints)
            else:
                return Exercise(
                    question=f"Quanto fa {expr}?",
                    solution=str(val),
                    hints=hints,
                )

        else:
            a = random.randint(2, 9)
            b = random.randint(2, 5)
            c = random.randint(2, 5)
            d = random.randint(2, 9)

            variants = [
                (f"({a} + {b}) \u00d7 {c} - {d}", (a + b) * c - d,
                 ["Calcola la parentesi, moltiplica, poi sottrai."]),
                (f"{a} \u00d7 ({b} + {c}) - {d}", a * (b + c) - d,
                 ["Priorità: parentesi, moltiplicazione, sottrazione."]),
                (f"({a} + {b} + {c}) \u00d7 {d}", (a + b + c) * d,
                 ["Somma dentro la parentesi, poi moltiplica."]),
                (f"{a} \u00d7 {b} - {c} \u00d7 {d}", a * b - c * d,
                 ["Calcola le moltiplicazioni separatamente, poi sottrai."]),
            ]
            expr, val, hints = random.choice(variants)

            return Exercise(question=f"Calcola: {expr}", solution=str(val), hints=hints)


register("ordine-operazioni", OrdineOperazioniGenerator())
