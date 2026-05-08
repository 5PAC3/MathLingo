import random

from .. import register
from ..base import Exercise, NodeGenerator


class GeometriaPianaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["rettangolo", "triangolo", "cerchio"] if level > 1 else ["rettangolo"])

        if level == 1:
            match template:
                case "rettangolo":
                    b = random.randint(2, 10)
                    h = random.randint(2, 10)
                    area = b * h
                    perim = 2 * (b + h)
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Area del rettangolo di base {b} e altezza {h}",
                            solution=str(area),
                            hints=["Area = base × altezza"],
                        )
                    else:
                        return Exercise(
                            question=f"Perimetro del rettangolo di base {b} e altezza {h}",
                            solution=str(perim),
                            hints=["Perimetro = 2 × (base + altezza)"],
                        )
                case _:
                    b = random.randint(2, 10)
                    h = random.randint(2, 10)
                    return Exercise(
                        question=f"Area del rettangolo di base {b} e altezza {h}",
                        solution=str(b * h),
                        hints=["Area = base × altezza"],
                    )

        elif level == 2:
            match template:
                case "rettangolo":
                    b = random.randint(3, 15)
                    h = random.randint(3, 12)
                    area = b * h
                    perim = 2 * (b + h)
                    qtype = random.choice(["area", "perimetro", "lato"])
                    if qtype == "area":
                        return Exercise(
                            question=f"Un rettangolo ha base {b} e area {area}. Quanto misura l'altezza?",
                            solution=str(h),
                            hints=[f"h = area / base = {area} / {b}"],
                        )
                    elif qtype == "perimetro":
                        return Exercise(
                            question=f"Perimetro del rettangolo di base {b} e altezza {h}",
                            solution=str(perim),
                            hints=["P = 2(b + h)"],
                        )
                    else:
                        other = b if random.choice([True, False]) else h
                        known = h if other == b else b
                        return Exercise(
                            question=f"Un rettangolo ha un lato di {known} e perimetro {2*(b+h)}. Quanto misura l'altro lato?",
                            solution=str(other),
                            hints=[f"P/2 - {known} = ?"],
                        )

                case "triangolo":
                    b = random.randint(3, 12)
                    h = random.randint(3, 10)
                    area = (b * h) // 2
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Area del triangolo di base {b} e altezza {h}",
                            solution=str(area),
                            hints=["Area = (base × altezza) / 2"],
                        )
                    else:
                        return Exercise(
                            question=f"Un triangolo ha area {area} e base {b}. Quanto misura l'altezza?",
                            solution=str(h),
                            hints=[f"h = (2 × area) / base = (2 × {area}) / {b}"],
                        )

                case "cerchio":
                    r = random.randint(2, 8)
                    area = r * r
                    circ = 2 * r
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Area del cerchio di raggio {r} (arrotonda π a 3, arrotonda all'intero)",
                            solution=str(3 * area),
                            hints=["A = πr² ≈ 3 × r²"],
                        )
                    else:
                        return Exercise(
                            question=f"Circonferenza di raggio {r} (π ≈ 3)",
                            solution=str(2 * 3 * r),
                            hints=["C = 2πr ≈ 2 × 3 × r"],
                        )

        else:
            match template:
                case "rettangolo":
                    b = random.randint(5, 25)
                    h = random.randint(5, 20)
                    area = b * h
                    perim = 2 * (b + h)
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Un rettangolo ha area {area} e base {b}. Trova il perimetro.",
                            solution=str(perim),
                            hints=[f"Trova h = {area}/{b}, poi P = 2(b+h)."],
                        )
                    else:
                        return Exercise(
                            question=f"Un rettangolo ha perimetro {perim} e base {b}. Trova l'area.",
                            solution=str(area),
                            hints=[f"h = {perim}/2 - {b} = ?", f"Poi A = b × h."],
                        )

                case "triangolo":
                    b = random.randint(4, 20)
                    h = random.randint(4, 15)
                    area = (b * h) // 2
                    return Exercise(
                        question=f"Triangolo: base = {b}, altezza = {h}. Calcola l'area.",
                        solution=str(area),
                        hints=["A = (b × h) / 2"],
                    )

                case "cerchio":
                    r = random.randint(3, 12)
                    area = 3 * r * r
                    circ = 2 * 3 * r
                    if random.choice([True, False]):
                        return Exercise(
                            question=f"Area del cerchio di raggio {r} (π ≈ 3)",
                            solution=str(area),
                            hints=["A = πr² ≈ 3r²"],
                        )
                    else:
                        return Exercise(
                            question=f"Circonferenza di raggio {r} (π ≈ 3). Poi, se raddoppio il raggio, quanto diventa?",
                            solution=str(circ),
                            hints=["C = 2πr, se r raddoppia, C raddoppia."],
                        )


register("geometria-piana", GeometriaPianaGenerator())
