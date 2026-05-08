import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


class StatisticaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        templates = ["media", "mediana", "moda", "varianza"]
        available = templates[:2] if level == 1 else (templates[:3] if level == 2 else templates)
        template = random.choice(available)

        if level == 1:
            vals = [random.randint(1, 10) for _ in range(random.randint(3, 5))]
            media = sum(vals) // len(vals) if sum(vals) % len(vals) == 0 else round(sum(vals) / len(vals), 1)
            vals_str = ", ".join(str(v) for v in vals)
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
                case "moda":
                    n = random.randint(5, 8)
                    base = random.randint(1, 15)
                    vals = [base] * random.randint(2, 3) + [random.randint(1, 20) for _ in range(n)]
                    random.shuffle(vals)
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Calcola la moda di: {vals_str}",
                        solution=str(base),
                        hints=["La moda è il valore che compare più frequentemente."],
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
                case "moda":
                    n = random.randint(6, 10)
                    base = random.randint(5, 30)
                    vals = [base] * random.randint(2, 4) + [random.randint(1, 40) for _ in range(n)]
                    random.shuffle(vals)
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Moda di: {vals_str}",
                        solution=str(base),
                        hints=["La moda è il valore che compare con maggior frequenza."],
                    )
                case "varianza":
                    n = random.randint(4, 6)
                    vals = [random.randint(5, 20) for _ in range(n)]
                    media = sum(vals) / n
                    var = round(sum((v - media) ** 2 for v in vals) / n, 1)
                    vals_str = ", ".join(str(v) for v in vals)
                    return Exercise(
                        question=f"Varianza di: {vals_str} (1 decimale)",
                        solution=str(var),
                        hints=[f"Media = {round(media, 1)}", f"Varianza = Σ(xᵢ - μ)² / n"],
                    )


register("statistica", StatisticaGenerator())
