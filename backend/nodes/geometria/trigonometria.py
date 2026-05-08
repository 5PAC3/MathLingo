import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


_ANGLES = [(30, 0.5, math.sqrt(3)/2, 1/math.sqrt(3)),
           (45, math.sqrt(2)/2, math.sqrt(2)/2, 1),
           (60, math.sqrt(3)/2, 0.5, math.sqrt(3))]


class TrigonometriaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["seno", "coseno", "tangente"] if level > 1 else ["seno"])

        if level == 1:
            angle_deg, sin_v, cos_v, tan_v = random.choice(_ANGLES[:2])
            match template:
                case "seno":
                    return Exercise(
                        question=f"Quanto vale sin({angle_deg}°)? (scrivi come frazione o √, es: 1/2 o sqrt(3)/2)",
                        solution=f"sqrt(2)/2" if angle_deg == 45 else "1/2",
                        hints=[f"sin({angle_deg}°) = ? Ripassa i valori notevoli."],
                    )
                case "coseno":
                    return Exercise(
                        question=f"Quanto vale cos({angle_deg}°)?",
                        solution=f"sqrt(2)/2" if angle_deg == 45 else f"sqrt(3)/2",
                        hints=[f"cos({angle_deg}°) = ?"],
                    )
                case _:
                    return Exercise(
                        question=f"Quanto vale sin({angle_deg}°)?",
                        solution=f"sqrt(2)/2" if angle_deg == 45 else "1/2",
                        hints=[f"sin({angle_deg}°) = ?"],
                    )

        elif level == 2:
            angle_deg, sin_v, cos_v, tan_v = random.choice(_ANGLES)
            if random.choice([True, False]):
                return Exercise(
                    question=f"Calcola: sin({angle_deg}°)",
                    solution=f"sqrt(2)/2" if angle_deg == 45 else (
                        "1/2" if angle_deg == 30 else "sqrt(3)/2"
                    ),
                    hints=[f"sin({angle_deg}°) = ? Consulta la tabella dei valori notevoli."],
                )
            else:
                return Exercise(
                    question=f"Calcola: cos({angle_deg}°)",
                    solution=f"sqrt(2)/2" if angle_deg == 45 else (
                        "sqrt(3)/2" if angle_deg == 30 else "1/2"
                    ),
                    hints=[f"cos({angle_deg}°) = ?"],
                )

        else:
            if random.choice([True, False]):
                angle_deg, sin_v, cos_v, tan_v = random.choice(_ANGLES)
                return Exercise(
                    question=f"Calcola: tan({angle_deg}°)",
                    solution="1" if angle_deg == 45 else (
                        "sqrt(3)/3" if angle_deg == 30 else "sqrt(3)"
                    ),
                    hints=[f"tan = sin/cos. tan({angle_deg}°) = sin({angle_deg}°)/cos({angle_deg}°)"],
                )
            else:
                a = random.randint(1, 5)
                b = random.randint(1, 5)
                angle_choice = random.choice([30, 45, 60])
                sol_map = {30: "1/2", 45: "sqrt(2)/2", 60: "sqrt(3)/2"}
                return Exercise(
                    question=f"Risolvi: sin({angle_choice}°) × {a} + cos({angle_choice}°) × {b} (arrotonda a 2 decimali se serve)",
                    solution=str(round(
                        (0.5 if angle_choice == 30 else (math.sqrt(2)/2 if angle_choice == 45 else math.sqrt(3)/2)) * a +
                        (math.sqrt(3)/2 if angle_choice == 30 else (math.sqrt(2)/2 if angle_choice == 45 else 0.5)) * b, 2)),
                    hints=[f"Sostituisci i valori di sin e cos."],
                )


register("trigonometria", TrigonometriaGenerator())
