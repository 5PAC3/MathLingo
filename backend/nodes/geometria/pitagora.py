import random

from .. import register
from ..base import Exercise, NodeGenerator


class PitagoraGenerator(NodeGenerator):
    def generate(self, level: int) -> Exercise:
        template = random.choice(["ipotenusa", "cateto"] if level > 1 else ["ipotenusa"])

        if level == 1:
            c1 = random.randint(3, 6)
            c2 = random.randint(3, 6)
            ip = int((c1**2 + c2**2) ** 0.5)
            if (c1**2 + c2**2) != ip**2:
                return self.generate(level)

            if True:
                return Exercise(
                    question=f"In un triangolo rettangolo, i cateti misurano {c1} e {c2}. Quanto misura l'ipotenusa?",
                    solution=str(ip),
                    hints=[f"{c1}² + {c2}² = {c1**2 + c2**2}. √? = {ip}"],
                )

        elif level == 2:
            ip = random.randint(5, 15)
            c1 = random.randint(3, 10)
            c2_sq = ip**2 - c1**2
            c2 = int(c2_sq ** 0.5)
            if c2_sq <= 0 or c2**2 != c2_sq:
                return self.generate(level)

            if random.choice([True, False]):
                return Exercise(
                    question=f"Ipotenusa = {ip}, un cateto = {c1}. Trova l'altro cateto.",
                    solution=str(c2),
                    hints=[f"{ip}² - {c1}² = {c2_sq}. √? = {c2}"],
                )
            else:
                return Exercise(
                    question=f"In un triangolo rettangolo, l'ipotenusa è {ip} e un cateto è {c1}. Quanto misura l'altro cateto?",
                    solution=str(c2),
                    hints=["Teorema di Pitagora: c² = a² - b²"],
                )

        else:
            c1 = random.randint(5, 12)
            ip = c1 + random.randint(3, 8)
            c2_sq = ip**2 - c1**2
            c2 = int(c2_sq ** 0.5)
            if c2_sq <= 0 or c2**2 != c2_sq:
                return self.generate(level)

            area = (c1 * c2) // 2
            perim = c1 + c2 + ip

            qtype = random.choice(["cateto", "area", "perimetro"])
            match qtype:
                case "cateto":
                    return Exercise(
                        question=f"Triangolo rettangolo: ipotenusa = {ip}, un cateto = {c1}. Trova l'altro cateto.",
                        solution=str(c2),
                        hints=["c² = ip² - cateto²"],
                    )
                case "area":
                    return Exercise(
                        question=f"Triangolo rettangolo con cateti {c1} e {c2}. Calcola l'area.",
                        solution=str(area),
                        hints=["Area = (cateto1 × cateto2) / 2"],
                    )
                case "perimetro":
                    return Exercise(
                        question=f"Cateti = {c1} e {c2}, ipotenusa = {ip}. Perimetro?",
                        solution=str(perim),
                        hints=["Somma tutti e tre i lati."],
                    )


register("teorema-pitagora", PitagoraGenerator())
