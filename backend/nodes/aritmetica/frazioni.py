import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


def _gcd(a: int, b: int) -> int:
    return math.gcd(a, b)


class FrazioniGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["somma", "semplifica", "prodotto"] if level > 1 else ["somma"])

        if level == 1:
            d = random.randint(2, 10)
            a = random.randint(1, d - 1)
            b = random.randint(1, d - 1)
            num = a + b
            den = d
            g = _gcd(num, den) if num > 0 else 1
            simp_num = num // g
            simp_den = den // g
            sol = str(simp_num) if simp_den == 1 else f"{simp_num}/{simp_den}"
            return Exercise(
                question=f"Quanto fa {a}/{d} + {b}/{d}?",
                solution=sol,
                hints=["Somma i numeratori, lascia lo stesso denominatore."],
            )

        elif level == 2:
            d1 = random.randint(2, 6)
            d2 = random.randint(3, 8)
            a = random.randint(1, d1 - 1)
            b = random.randint(1, d2 - 1)

            match template:
                case "somma":
                    num = a * d2 + b * d1
                    den = d1 * d2
                    g = math.gcd(num, den)
                    simp_num = num // g
                    simp_den = den // g
                    sol = f"{simp_num}/{simp_den}" if simp_den > 1 else str(simp_num)
                    return Exercise(
                        question=f"Quanto fa {a}/{d1} + {b}/{d2}?",
                        solution=sol,
                        hints=[f"Trova il denominatore comune tra {d1} e {d2}."],
                    )
                case "semplifica":
                    g = math.gcd(a, d1)
                    simp_a, simp_d = a // g, d1 // g
                    if simp_a == a and simp_d == d1:
                        a2 = a * 2
                        d1_2 = d1 * 2
                        g2 = math.gcd(a2, d1_2)
                        return Exercise(
                            question=f"Semplifica: {a2}/{d1_2}",
                            solution=f"{a2//g2}/{d1_2//g2}",
                            hints=[f"Dividi numeratore e denominatore per {g2}."],
                        )
                    return Exercise(
                        question=f"Semplifica: {a}/{d1}",
                        solution=f"{simp_a}/{simp_d}" if simp_d > 1 else str(simp_a),
                        hints=[f"Dividi sopra e sotto per {g}."],
                    )
                case "prodotto":
                    num = a * b
                    den = d1 * d2
                    g = math.gcd(num, den)
                    sol = f"{num//g}/{den//g}" if den//g > 1 else str(num//g)
                    return Exercise(
                        question=f"Quanto fa {a}/{d1} × {b}/{d2}?",
                        solution=sol,
                        hints=["Moltiplica numeratori tra loro e denominatori tra loro."],
                    )

        else:
            d1 = random.randint(2, 8)
            d2 = random.randint(2, 6)
            a = random.randint(1, d1 - 1)
            b = random.randint(1, d2 - 1)

            match template:
                case "somma":
                    num = a * d2 + b * d1
                    den = d1 * d2
                    g = math.gcd(num, den)
                    sol = f"{num//g}/{den//g}" if den//g > 1 else str(num//g)
                    return Exercise(
                        question=f"Calcola: {a}/{d1} + {b}/{d2} (riduci ai minimi termini)",
                        solution=sol,
                        hints=["Trova il denominatore comune, somma, poi semplifica."],
                    )
                case "semplifica":
                    num = a + random.randint(1, 3)
                    den = d1 + random.randint(1, 3)
                    g = math.gcd(num, den)
                    if g == 1:
                        num = a * 2
                        den = d1 * 2
                        g = math.gcd(num, den)
                    return Exercise(
                        question=f"Riduci ai minimi termini: {num}/{den}",
                        solution=f"{num//g}/{den//g}" if den//g > 1 else str(num//g),
                        hints=[f"Dividi per {g}."],
                    )
                case "prodotto":
                    num = a * b
                    den = d1 * d2
                    g = math.gcd(num, den)
                    sol = f"{num//g}/{den//g}" if den//g > 1 else str(num//g)
                    return Exercise(
                        question=f"Calcola {a}/{d1} × {b}/{d2} e riduci",
                        solution=sol,
                        hints=["Moltiplica in linea e poi semplifica."],
                    )


register("frazioni", FrazioniGenerator())
