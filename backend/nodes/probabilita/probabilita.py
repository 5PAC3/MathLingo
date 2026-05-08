import random
import math

from .. import register
from ..base import Exercise, NodeGenerator


class ProbabilitaGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["moneta", "dado"] if level > 1 else ["moneta"])

        if level == 1:
            if template == "moneta":
                return Exercise(
                    question="Lanciando una moneta, qual è la probabilità di ottenere testa? (scrivi come frazione o decimale)",
                    solution="1/2",
                    hints=["La moneta ha 2 facce, una è testa."],
                )
            else:
                return Exercise(
                    question=f"Lanciando un dado a 6 facce, qual è la probabilità di ottenere 4? (scrivi 1/6 o 0.17)",
                    solution="1/6",
                    hints=["Il dado ha 6 facce, una è il 4."],
                )

        elif level == 2:
            match template:
                case "moneta":
                    n = random.randint(2, 4)
                    return Exercise(
                        question=f"Lanciando {n} monete, qual è la probabilità che escano tutte teste? (scrivi come frazione)",
                        solution=f"1/{2**n}",
                        hints=[f"Ogni moneta ha probabilità 1/2. La probabilità totale è (1/2)^{n} = 1/{2**n}."],
                    )
                case "dado":
                    target = random.randint(1, 6)
                    return Exercise(
                        question=f"Qual è la probabilità di ottenere un numero maggiore di {target} lanciando un dado? (frazione)",
                        solution=f"{6-target}/6",
                        hints=[f"I numeri maggiori di {target} sono: {', '.join(str(i) for i in range(target+1, 7))}"],
                    )

        else:
            if random.choice([True, False]):
                n = random.randint(2, 4)
                return Exercise(
                    question=f"Lanciando 2 dadi, qual è la probabilità che la somma sia 7? (frazione)",
                    solution="6/36",
                    hints=["Coppie possibili: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). Sono 6 su 36."],
                )
            else:
                total = random.choice([10, 20, 30])
                favorable = random.randint(1, total - 1)
                g = math.gcd(favorable, total)
                simp = f"{favorable//g}/{total//g}"
                return Exercise(
                    question=f"In un sacchetto ci sono {total} palline, di cui {favorable} rosse. Probabilità di estrarre una rossa? (frazione)",
                    solution=simp,
                    hints=[f"Casi favorevoli / casi possibili = {favorable}/{total}"],
                )


register("probabilita", ProbabilitaGenerator())
