import random

import sympy as sp

from .. import register
from ..base import Exercise, NodeGenerator


class IntegraliGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        x = sp.Symbol("x")
        if level == 1:
            a = random.randint(1, 5)
            n = random.randint(1, 4)
            integ = a * x**n
            result = sp.integrate(integ, x)
            return Exercise(
                question=f"∫ {str(integ)} dx",
                solution=f"{str(result)} + C",
                hints=[f"∫{a}x^{n} dx = {a}/({n+1}) × x^{n+1} + C"],
            )

        elif level == 2:
            a = random.randint(1, 4)
            b = random.randint(1, 5)
            n_low = random.randint(1, 3)
            a2 = random.randint(1, 4)
            n_high = random.randint(n_low + 1, n_low + 3)
            integ = a * x**n_low + a2 * x**n_high
            result = sp.integrate(integ, (x, b, b + 2))
            return Exercise(
                question=f"∫ₐ^{b+2} ({str(integ)}) dx, con a={b}",
                solution=str(int(result)) if result == int(result) else str(round(float(result), 2)),
                hints=[f"∫{str(integ)} dx = {str(sp.integrate(integ, x))}", f"Calcola F({b+2}) - F({b})"],
            )

        else:
            a = random.randint(1, 3)
            b = random.randint(1, 3)
            c = random.randint(1, 3)
            f = a * x
            g_deriv = sp.diff(sp.sin(c * x), x)
            result = sp.integrate(f * sp.sin(c * x), x)
            return Exercise(
                question=f"∫ {str(f)}·sin({c}x) dx",
                solution=f"{str(result)} + C",
                hints=["Usa integrazione per parti: ∫f·g' = f·g - ∫f'·g"],
            )


register("integrali", IntegraliGenerator())
