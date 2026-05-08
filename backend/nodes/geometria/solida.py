import random

from .. import register
from ..base import Exercise, NodeGenerator


class SolidaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["cubo", "parallelepipedo", "cilindro"] if level > 1 else ["cubo"])

        if level == 1:
            l = random.randint(2, 6)
            match template:
                case "cubo":
                    vol = l**3
                    sup = 6 * l**2
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Volume di un cubo di lato {l}",
                            solution=str(vol),
                            hints=["V = l³"],
                        )
                    else:
                        return Exercise(
                            question=f"Superficie totale di un cubo di lato {l}",
                            solution=str(sup),
                            hints=["S = 6 × l²"],
                        )
                case _:
                    return Exercise(
                        question=f"Volume di un cubo di lato {l}",
                        solution=str(l**3),
                        hints=["V = l³"],
                    )

        elif level == 2:
            match template:
                case "cubo":
                    l = random.randint(3, 8)
                    vol = l**3
                    return Exercise(
                        question=f"Un cubo ha volume {vol}. Quanto misura il lato?",
                        solution=str(l),
                        hints=[f"l = ³√{vol} = ?", "Prova: 3³=27, 4³=64, 5³=125..."],
                    )
                case "parallelepipedo":
                    a = random.randint(2, 6)
                    b = random.randint(2, 5)
                    h = random.randint(2, 4)
                    vol = a * b * h
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Volume del parallelepipedo {a}×{b}×{h}",
                            solution=str(vol),
                            hints=["V = a × b × h"],
                        )
                    else:
                        return Exercise(
                            question=f"Un parallelepipedo ha volume {vol}, base {a}×{b}. Quanto misura l'altezza?",
                            solution=str(h),
                            hints=["h = V / (a × b)"],
                        )
                case "cilindro":
                    r = random.randint(2, 6)
                    h = random.randint(3, 8)
                    vol = 3 * r**2 * h
                    return Exercise(
                        question=f"Volume del cilindro: r={r}, h={h} (π ≈ 3)",
                        solution=str(vol),
                        hints=["V = πr²h ≈ 3 × r² × h"],
                    )

        else:
            match template:
                case "cubo":
                    l = random.randint(4, 10)
                    vol = l**3
                    sup = 6 * l**2
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Cubo di lato {l}: calcola il volume",
                            solution=str(vol),
                            hints=["V = l³"],
                        )
                    else:
                        return Exercise(
                            question=f"Cubo di lato {l}: calcola la superficie totale",
                            solution=str(sup),
                            hints=["S = 6l²"],
                        )
                case "parallelepipedo":
                    a = random.randint(3, 8)
                    b = random.randint(3, 6)
                    h = random.randint(3, 6)
                    vol = a * b * h
                    sup = 2 * (a * b + a * h + b * h)
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Parallelepipedo {a}×{b}×{h}: superficie totale",
                            solution=str(sup),
                            hints=["S = 2(ab + ah + bh)"],
                        )
                    else:
                        return Exercise(
                            question=f"Parallelepipedo {a}×{b}×{h}: volume",
                            solution=str(vol),
                            hints=["V = a × b × h"],
                        )
                case "cilindro":
                    r = random.randint(2, 6)
                    h = random.randint(4, 10)
                    vol = 3 * r**2 * h
                    sup = 2 * 3 * r * (r + h)
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Cilindro r={r}, h={h}: volume (π≈3)",
                            solution=str(vol),
                            hints=["V = πr²h"],
                        )
                    else:
                        return Exercise(
                            question=f"Cilindro r={r}, h={h}: superficie totale (π≈3)",
                            solution=str(sup),
                            hints=["S = 2πr(r + h) ≈ 6r(r+h)"],
                        )


register("geometria-solida", SolidaGenerator())
