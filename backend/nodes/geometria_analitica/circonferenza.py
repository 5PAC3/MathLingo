import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class CirconferenzaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        if level == 1:
            cx = random.randint(-3, 3)
            cy = random.randint(-3, 3)
            r = random.randint(2, 5)
            a = -2 * cx
            b = -2 * cy
            c = cx**2 + cy**2 - r**2
            return Exercise(
                question=f"Centro e raggio di: x² + y² + {a}x + {b}y + {c} = 0 (scrivi: cx,cy,r)",
                solution=f"{cx}, {cy}, {r}",
                hints=[f"C(-a/2, -b/2) = C({cx}, {cy})", f"r² = ({cx})² + ({cy})² - {c} = {r}²"],
            )

        elif level == 2:
            cx = random.randint(-3, 3)
            cy = random.randint(-3, 3)
            r = random.randint(2, 4)
            xp = random.randint(cx - r + 1, cx + r - 1)
            yp = random.randint(cy - r + 1, cy + r - 1)
            d2 = (xp - cx) ** 2 + (yp - cy) ** 2
            belongs = d2 == r**2
            answer = "si" if belongs else "no"
            return Exercise(
                question=f"Punto ({xp},{yp}) appartiene a cerchio centro ({cx},{cy}) raggio {r}? (si/no)",
                solution=answer,
                hints=[f"Distanza² = ({xp}-{cx})² + ({yp}-{cy})² = {d2}", f"r² = {r**2}"],
            )

        else:
            cx = random.randint(-2, 2)
            cy = random.randint(-2, 2)
            r = random.randint(3, 5)
            a = -2 * cx
            b = -2 * cy
            c = cx**2 + cy**2 - r**2
            m = random.randint(1, 3)
            q = random.randint(-3, 3)
            d = abs(m * cx - cy + q) / (m**2 + 1) ** 0.5
            position = "tangente" if abs(d - r) < 0.01 else ("secante" if d < r else "esterna")
            return Exercise(
                question=f"Retta y = {m}x + {q} rispetto a x²+y²+{a}x+{b}y+{c}=0? (secante/tangente/esterna)",
                solution=position,
                hints=[f"Centro ({cx},{cy}), raggio {r}", f"Distanza centro-retta = {d:.2f}"],
            )


register("circonferenza", CirconferenzaGenerator())
