import random

from .. import register
from ..base import Exercise, NodeGenerator


class StatisticaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["media", "mediana"] if level > 1 else ["media"])

        if level == 1:
            vals = [random.randint(1, 10) for _ in range(random.randint(3, 5))]
            media = sum(vals) // len(vals) if sum(vals) % len(vals) == 0 else round(sum(vals) / len(vals), 1)
            vals_str = ", ".join(str(v) for v in vals)

            match template:
                case "media":
                    return Exercise(
                        question=f"Calcola la media di: {vals_str}",
                        solution=str(int(media)) if isinstance(media, int) else str(media),
                        hints=[f"Somma = {sum(vals)}, diviso {len(vals)}"],
                    )
                case _:
                    return Exercise(
                        question=f"Calcola la media di: {vals_str}",
                        solution=str(int(media)) if isinstance(media, int) else str(media),
                        hints=[f"Somma = {sum(vals)}, diviso {len(vals)}"],
                    )

        elif level == 2:
            match template:
                case "media":
                    vals = [random.randint(5, 50) for _ in range(random.randint(3, 6))]
                    media = round(sum(vals) / len(vals), 1)
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Calcola la media aritmetica di: {vals_str} (arrotonda a 1 decimale)",
                        solution=str(media),
                        hints=[f"Somma = {sum(vals)}, n = {len(vals)}"],
                    )
                case "mediana":
                    n = random.choice([5, 7])
                    vals = sorted([random.randint(1, 50) for _ in range(n)])
                    mediana = vals[n // 2]
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Calcola la mediana di: {vals_str}",
                        solution=str(mediana),
                        hints=[f"Ordina i numeri e prendi il valore centrale (posizione {(n+1)//2}ª)."],
                    )

        else:
            match template:
                case "media":
                    vals = [random.randint(10, 100) for _ in range(random.randint(4, 7))]
                    media = round(sum(vals) / len(vals), 1)
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Media di: {vals_str} (1 decimale)",
                        solution=str(media),
                        hints=[f"Somma = {sum(vals)}, n = {len(vals)}"],
                    )
                case "mediana":
                    n = random.choice([7, 9])
                    vals = sorted([random.randint(10, 100) for _ in range(n)])
                    mediana = vals[n // 2]
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Mediana di: {vals_str}",
                        solution=str(mediana),
                        hints=[f"Posizione centrale: {(n+1)//2}ª su {n} numeri ordinati."],
                    )


register("statistica", StatisticaGenerator())
