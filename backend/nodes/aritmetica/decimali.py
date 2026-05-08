import random

from .. import register
from ..base import Exercise, NodeGenerator


class DecimaliGenerator(NodeGenerator):
    def _rfloat(self, lo: int, hi: int, dec: int) -> float:
        return round(random.uniform(lo, hi), dec)

    def generate(self, level: int) -> Exercise:
        template = random.choice(["somma", "prodotto", "arrotonda"] if level > 1 else ["somma"])

        if level == 1:
            a = self._rfloat(1, 10, 1)
            b = self._rfloat(1, 10, 1)
            match template:
                case "somma":
                    val = round(a + b, 2)
                    return Exercise(
                        question=f"Quanto fa {a} + {b}?",
                        solution=str(val),
                        hints=["Allinea le virgole e somma."],
                    )
                case _:
                    val = round(a + b, 2)
                    return Exercise(
                        question=f"Quanto fa {a} + {b}?",
                        solution=str(val),
                        hints=["Allinea le virgole e somma."],
                    )

        elif level == 2:
            a = self._rfloat(1, 25, 2)
            b = self._rfloat(1, 10, 1)
            match template:
                case "somma":
                    val = round(a + b, 2)
                    return Exercise(
                        question=f"Calcola: {a} + {b}",
                        solution=str(val),
                        hints=["Allinea le cifre decimali e somma."],
                    )
                case "prodotto":
                    val = round(a * b, 2)
                    return Exercise(
                        question=f"Quanto fa {a} × {b}?",
                        solution=str(val),
                        hints=["Moltiplica ignorando la virgola, poi riposizionala."],
                    )
                case "arrotonda":
                    val = round(a, 1)
                    return Exercise(
                        question=f"Arrotonda {a} a 1 cifra decimale",
                        solution=str(val),
                        hints=["Guarda la seconda cifra decimale: se ≥ 5, arrotonda per eccesso."],
                    )

        else:
            a = self._rfloat(10, 100, 2)
            b = self._rfloat(1, 10, 2)
            match template:
                case "somma":
                    val = round(a + b, 2)
                    return Exercise(
                        question=f"{a} + {b} = ?",
                        solution=str(val),
                        hints=["Allinea in colonna e somma con attenzione."],
                    )
                case "prodotto":
                    val = round(a * b, 2)
                    return Exercise(
                        question=f"Moltiplica: {a} × {b}",
                        solution=str(val),
                        hints=["Calcola il prodotto e posiziona la virgola."],
                    )
                case "arrotonda":
                    aprec = round(a, random.randint(3, 5))
                    prec = random.choice([2, 3])
                    val = round(aprec, prec)
                    return Exercise(
                        question=f"Arrotonda {aprec} a {prec} cifre decimali",
                        solution=str(val),
                        hints=[f"Guarda la cifra alla posizione {prec+1}."],
                    )


register("decimali", DecimaliGenerator())
