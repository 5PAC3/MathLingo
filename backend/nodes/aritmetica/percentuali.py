import random

from .. import register
from ..base import Exercise, NodeGenerator


class PercentualiGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["base", "inversa", "delta"] if level > 1 else ["base"])

        if level == 1:
            pct = random.choice([10, 20, 25, 50, 75, 100])
            base = random.randint(2, 20) * (100 // pct) if pct < 100 else random.randint(1, 10)
            val = base * pct // 100

            match template:
                case "base":
                    return Exercise(
                        question=f"Quanto è il {pct}% di {base}?",
                        solution=str(val),
                        hints=[f"Calcola ({pct}/100) × {base}."],
                    )
                case "inversa":
                    return Exercise(
                        question=f"{val} è il {pct}% di quale numero?",
                        solution=str(base),
                        hints=[f"Dividi {val} per {pct} e moltiplica per 100."],
                    )

        elif level == 2:
            base = random.randint(20, 200)
            pct = random.choice([5, 10, 15, 20, 25, 30, 40, 50, 60, 75])
            val = base * pct // 100

            match template:
                case "base":
                    return Exercise(
                        question=f"Calcola il {pct}% di {base}",
                        solution=str(val),
                        hints=[f"{pct}% di {base} = ({pct}/100) × {base}"],
                    )
                case "inversa":
                    pct2 = random.choice([10, 20, 25, 50])
                    val2 = base * pct2 // 100
                    return Exercise(
                        question=f"{val2} rappresenta quale percentuale di {base}?",
                        solution=f"{pct2}%",
                        hints=[f"({val2}/{base}) × 100 = ?"],
                    )
                case "delta":
                    delta_pct = random.choice([10, 20, 30, 50])
                    increase = base * delta_pct // 100
                    new_val = base + increase
                    return Exercise(
                        question=f"Un valore passa da {base} a {new_val}. Qual è l'aumento percentuale?",
                        solution=f"{delta_pct}%",
                        hints=[f"Calcola: (({new_val} - {base}) / {base}) × 100"],
                    )

        else:
            base = random.randint(50, 500)
            pct = random.choice([5, 10, 15, 20, 25, 30, 40, 50, 75])

            match template:
                case "base":
                    val = round(base * pct / 100)
                    return Exercise(
                        question=f"Quanto vale il {pct}% di {base}?",
                        solution=str(val),
                        hints=[f"({pct}/100) × {base}"],
                    )
                case "inversa":
                    val = base * pct // 100
                    return Exercise(
                        question=f"{val} è il {pct}% di che numero?",
                        solution=str(base),
                        hints=[f"{val} ÷ {pct} × 100 = ?"],
                    )
                case "delta":
                    delta_pct = random.choice([5, 10, 15, 20, 25])
                    diff = round(base * delta_pct / 100)
                    if random.choice([True, False]):
                        new_val = base + diff
                        return Exercise(
                            question=f"{base} aumenta del {delta_pct}%. Quanto vale?",
                            solution=str(new_val),
                            hints=[f"Calcola il {delta_pct}% di {base} e aggiungilo."],
                        )
                    else:
                        new_val = base - diff
                        return Exercise(
                            question=f"{base} diminuisce del {delta_pct}%. Quanto vale?",
                            solution=str(new_val),
                            hints=[f"Calcola il {delta_pct}% di {base} e sottrailo."],
                        )


register("percentuali", PercentualiGenerator())
