import random

from .. import register
from ..base import Exercise, NodeGenerator


class RadiciGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["standard", "inversa", "cubo"] if level > 1 else ["standard"])

        if level == 1:
            n = random.randint(1, 12)
            sq = n * n
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa \u221a{sq}?",
                        solution=str(n),
                        hints=[f"Quale numero al quadrato dà {sq}?"],
                    )
                case "inversa":
                    return Exercise(
                        question=f"La radice quadrata di 144 è 12. Quanto fa \u221a{sq}?",
                        solution=str(n),
                        hints=[f"{n} × {n} = {sq}"],
                    )

        elif level == 2:
            n = random.randint(1, 20)
            sq = n * n
            match template:
                case "standard":
                    return Exercise(
                        question=f"Calcola \u221a{sq}",
                        solution=str(n),
                        hints=[f"Quale numero intero al quadrato dà {sq}?"],
                    )
                case "inversa":
                    return Exercise(
                        question=f"\u221a? = {n}",
                        solution=str(sq),
                        hints=[f"{n} × {n} = ?"],
                    )
                case "cubo":
                    n = random.randint(2, 5)
                    cb = n**3
                    return Exercise(
                        question=f"Quanto fa \u00b3\u221a{cb}? (radice cubica)",
                        solution=str(n),
                        hints=[f"Quale numero × {n} × {n} dà {cb}?"],
                    )

        else:
            variants = ["perfetta", "semplifica", "cubo"]
            choice = random.choice(variants)
            if choice == "perfetta":
                n = random.randint(5, 30)
                sq = n * n
                return Exercise(
                    question=f"\u221a{sq} = ?",
                    solution=str(n),
                    hints=[f"Trova un numero il cui quadrato è {sq}."],
                )
            elif choice == "cubo":
                n = random.randint(2, 6)
                cb = n**3
                return Exercise(
                    question=f"Calcola la radice cubica: \u00b3\u221a{cb}",
                    solution=str(n),
                    hints=[f"Quale numero elevato alla 3ª dà {cb}?"],
                )
            else:
                n = random.randint(2, 6)
                m = random.randint(2, 5)
                sq = (n * n) * m
                return Exercise(
                    question=f"Semplifica \u221a{sq} (il risultato è n\u221am, scrivi n m)",
                    solution=f"{n}*sqrt({m})",
                    hints=[f"Trova un fattore quadrato perfetto di {sq}."],
                )


register("radici", RadiciGenerator())
