from .base import Exercise, NodeGenerator

_registry: dict[str, NodeGenerator] = {}


def register(node_id: str, generator: NodeGenerator) -> None:
    _registry[node_id] = generator


def get_generator(node_id: str) -> NodeGenerator:
    gen = _registry.get(node_id)
    if gen is None:
        raise ValueError(f"No generator found for node: {node_id}")
    return gen


def list_nodes() -> list[str]:
    return list(_registry.keys())


from .aritmetica import addizione  # noqa: F401, E402
from .aritmetica import sottrazione  # noqa: F401, E402
from .aritmetica import moltiplicazione  # noqa: F401, E402
from .aritmetica import divisione  # noqa: F401, E402
from .algebra import equazioni  # noqa: F401, E402
from .informatica import algebra_booleana  # noqa: F401, E402
