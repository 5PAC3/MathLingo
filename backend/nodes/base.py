from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Exercise:
    question: str
    solution: str
    hints: list[str]


class NodeGenerator(ABC):
    @abstractmethod
    def generate(self, level: int) -> Exercise:
        pass
