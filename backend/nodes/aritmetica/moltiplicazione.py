import random

from .. import register
from ..base import Exercise, NodeGenerator


class MoltiplicazioneGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice([
            "standard", "multiplo", "completamento", "triplo"
        ] if level > 1 else ["standard", "multiplo"])

        if level == 1:
            a = random.randint(2, 9)
            b = random.randint(2, 9)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} × {b}?",
                        solution=str(a * b),
                        hints=[f"Pensa alla tabellina del {a}."],
                    )
                case "multiplo":
                    return Exercise(
                        question=f"Qual è il {b}° multiplo di {a}?",
                        solution=str(a * b),
                        hints=[f"Moltiplica {a} per {b}."],
                    )

        elif level == 2:
            a = random.randint(10, 20)
            b = random.randint(2, 5)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} × {b}?",
                        solution=str(a * b),
                        hints=[f"Moltiplica {a} × {b}: {a} × {b} = ?"],
                    )
                case "multiplo":
                    return Exercise(
                        question=f"Trova il multiplo: {a} × {b}",
                        solution=str(a * b),
                        hints=[f"Scomponi {a} in decine e unità."],
                    )
                case "completamento":
                    prod = a * b
                    return Exercise(
                        question=f"? × {b} = {prod}",
                        solution=str(a),
                        hints=[f"Dividi {prod} per {b}."],
                    )
                case "triplo":
                    return Exercise(
                        question=f"Calcola il triplo di {a}",
                        solution=str(a * 3),
                        hints=["Il triplo significa moltiplicare per 3."],
                    )

        else:
            a = random.randint(10, 99)
            b = random.randint(2, 9)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a} × {b}?",
                        solution=str(a * b),
                        hints=["Moltiplica le unità, poi le decine, e somma."],
                    )
                case "multiplo":
                    return Exercise(
                        question=f"Trova il prodotto: {a} × {b}",
                        solution=str(a * b),
                        hints=["Applica la proprietà distributiva."],
                    )
                case "completamento":
                    prod = a * b
                    return Exercise(
                        question=f"{prod} ÷ {b} = ?",
                        solution=str(prod // b),
                        hints=["È l'operazione inversa della moltiplicazione."],
                    )
                case "triplo":
                    return Exercise(
                        question=f"{a} × {b} = ? (suggerimento: usa la scomposizione)",
                        solution=str(a * b),
                        hints=[f"Scomponi: {a} = {a//10*10} + {a%10}"],
                    )


register("moltiplicazione", MoltiplicazioneGenerator())
