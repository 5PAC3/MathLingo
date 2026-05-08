import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


class ProporzioniGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            a = random.randint(1, 10)
            b = random.randint(1, 10)
            c = random.randint(1, 10)
            d = b * c // a
            if random.choice([True, False]):
                return Exercise(
                    question=f"Trova x: {a} : {b} = {c} : x",
                    solution=str(d),
                    hints=[f"{a} : {b} = {c} : x → x = ({b} × {c}) / {a}"],
                )
            else:
                return Exercise(
                    question=f"Trova x: x : {a} = {b} : {c}",
                    solution=str(a * b // c),
                    hints=[f"x = ({a} × {b}) / {c}"],
                )

        elif level == 2:
            template = random.choice(["diretta", "inversa"])
            if template == "diretta":
                a = random.randint(2, 10)
                b = random.randint(2, 10) * a
                q = random.randint(2, 6)
                unit = b // a
                result = unit * q
                return Exercise(
                    question=f"Se {a} kg di mele costano {b}€, quanto costano {q} kg?",
                    solution=str(result),
                    hints=[f"Prezzo al kg = {b}/{a} = {unit}€", f"{q} × {unit} = {result}"],
                )
            else:
                a = random.randint(2, 6)
                b = random.randint(2, 6)
                prod = a * b
                c = random.choice([x for x in range(2, 12) if prod % x == 0 and x != a])
                d = prod // c
                return Exercise(
                    question=f"{a} operai completano un lavoro in {b} giorni. {c} operai in quanti giorni?",
                    solution=str(d),
                    hints=[f"Giorni-uomo: {a}×{b} = {prod}", f"{prod} / {c} = {d}"],
                )

        else:
            template = random.choice(["composta", "percentuale"])
            if template == "composta":
                a = random.randint(2, 4)
                b = random.randint(2, 4)
                c = a * b
                d = random.randint(2, 4)
                e = random.randint(2, 4)
                ratio = (a * d) // (c) if (a * d) % c == 0 else (a * d) / c
                return Exercise(
                    question=f"{a} operai in {b} ore producono {c} pezzi. Quanti pezzi producono {a+d} operai in {b+e} ore?",
                    solution=str(int(ratio)) if isinstance(ratio, int) else str(round(ratio, 1)),
                    hints=["Calcola i pezzi per operaio-ora, poi moltiplica."],
                )
            else:
                total = random.choice([50, 80, 100, 120, 200])
                pct = random.choice([10, 15, 20, 25, 30, 40, 50])
                val = total * pct // 100
                return Exercise(
                    question=f"Il {pct}% di {total} è uguale al 50% di quale numero?",
                    solution=str(val * 2),
                    hints=[f"{pct}% di {total} = {val}", f"50% di x = {val} → x = {val*2}"],
                )


register("proporzioni", ProporzioniGenerator())
