import random

from .. import register
from ..base import Exercise, NodeGenerator


class PotenzeGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["standard", "inversa", "base10"] if level > 1 else ["standard"])

        if level == 1:
            a = random.randint(2, 10)
            b = random.randint(2, 3)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Quanto fa {a}^{b}?",
                        solution=str(a**b),
                        hints=[f"Moltiplica {a} per sé stesso {b} volte."],
                    )
                case "inversa":
                    val = a**b
                    return Exercise(
                        question=f"Quale numero elevato a {b} dà {val}?",
                        solution=str(a),
                        hints=[f"Prova a fare la radice {b}-esima di {val}."],
                    )

        elif level == 2:
            a = random.randint(2, 6)
            b = random.randint(3, 5)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Calcola {a}^{b}",
                        solution=str(a**b),
                        hints=[f"Attenzione: {a}^{b} = {a} × {a} × ... ({b} volte)."],
                    )
                case "inversa":
                    val = a**b
                    return Exercise(
                        question=f"Quale numero alla {b}ª dà {val}?",
                        solution=str(a),
                        hints=[f"Prova scomposizione in fattori primi di {val}."],
                    )
                case "base10":
                    exp = random.randint(1, 6)
                    return Exercise(
                        question=f"Quanto fa 10^{exp}?",
                        solution=str(10**exp),
                        hints=[f"10^{exp} è 1 seguito da {exp} zeri."],
                    )

        else:
            a = random.randint(2, 12)
            b = random.randint(2, 4)
            match template:
                case "standard":
                    return Exercise(
                        question=f"Calcola {a}^{b}",
                        solution=str(a**b),
                        hints=[f"Calcola passo per passo: {a}^2 × {a}^({b-2})"],
                    )
                case "inversa":
                    val = a**b
                    return Exercise(
                        question=f"Trova x: x^{b} = {val}",
                        solution=str(a),
                        hints=[f"Prova interi: 1, 2, 3... fino a trovare la {b}ª potenza."],
                    )
                case "base10":
                    exp = random.randint(2, 8)
                    return Exercise(
                        question=f"Calcola 10^{exp}",
                        solution=str(10**exp),
                        hints=[f"1 con {exp} zeri."],
                    )


register("potenze", PotenzeGenerator())
