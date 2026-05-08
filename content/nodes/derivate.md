# Derivate

La **derivata** di una funzione $f(x)$ in un punto $x_0$ misura il tasso di variazione istantaneo, cioè la pendenza della retta tangente.

## Definizione

$$ f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h} $$

## Derivate fondamentali

| $f(x)$ | $f'(x)$ |
|--------|---------|
| $k$ (costante) | $0$ |
| $x^n$ | $nx^{n-1}$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $e^x$ | $e^x$ |
| $\ln x$ | $\frac{1}{x}$ |

## Regole di derivazione

### Somma

$$ (f + g)' = f' + g' $$

### Prodotto

$$ (f \cdot g)' = f' \cdot g + f \cdot g' $$

### Quoziente

$$ \left(\frac{f}{g}\right)' = \frac{f' \cdot g - f \cdot g'}{g^2} $$

### Funzione composta (regola della catena)

$$ (f \circ g)' = f'(g(x)) \cdot g'(x) $$

## Retta tangente

La retta tangente a $f$ in $x_0$ ha equazione:

$$ y - f(x_0) = f'(x_0)(x - x_0) $$
