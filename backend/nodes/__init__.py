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
from .aritmetica import ordine_operazioni  # noqa: F401, E402
from .aritmetica import potenze  # noqa: F401, E402
from .aritmetica import radici  # noqa: F401, E402
from .aritmetica import frazioni  # noqa: F401, E402
from .aritmetica import proporzioni  # noqa: F401, E402
from .aritmetica import decimali  # noqa: F401, E402
from .aritmetica import percentuali  # noqa: F401, E402
from .aritmetica import mcm_mcd  # noqa: F401, E402
from .aritmetica import numeri_primi  # noqa: F401, E402
from .algebra import equazioni  # noqa: F401, E402
from .algebra import espressioni  # noqa: F401, E402
from .algebra import monomi  # noqa: F401, E402
from .algebra import polinomi  # noqa: F401, E402
from .algebra import prodotti_notevoli  # noqa: F401, E402
from .algebra import scomposizione_polinomi  # noqa: F401, E402
from .algebra import divisione_polinomi  # noqa: F401, E402
from .algebra import equazioni_secondo_grado  # noqa: F401, E402
from .algebra import disequazioni_secondo_grado  # noqa: F401, E402
from .algebra import sistemi_lineari  # noqa: F401, E402
from .algebra import disequazioni  # noqa: F401, E402
from .algebra import equazioni_fratte  # noqa: F401, E402
from .informatica import algebra_booleana  # noqa: F401, E402
from .geometria import piana  # noqa: F401, E402
from .geometria import pitagora  # noqa: F401, E402
from .geometria_analitica import retta  # noqa: F401, E402
from .geometria_analitica import parabola  # noqa: F401, E402
from .geometria_analitica import circonferenza  # noqa: F401, E402
from .geometria import solida  # noqa: F401, E402
from .geometria import trigonometria  # noqa: F401, E402
from .analisi import funzioni  # noqa: F401, E402
from .analisi import limiti  # noqa: F401, E402
from .analisi import derivate  # noqa: F401, E402
from .analisi import integrali  # noqa: F401, E402
from .probabilita import probabilita  # noqa: F401, E402
from .probabilita import statistica  # noqa: F401, E402
from .probabilita import combinatoria  # noqa: F401, E402
