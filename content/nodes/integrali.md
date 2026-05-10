# Integrali

## Integrale indefinito

L'**integrale indefinito** è l'operazione inversa della derivata. Se $F'(x) = f(x)$, allora:

$$ \int f(x) \, dx = F(x) + C $$

dove $C$ è la costante di integrazione.

## Integrali immediati

| $f(x)$ | $\int f(x) \, dx$ |
|--------|-------------------|
| $x^n$ ($n \neq -1$) | $\frac{x^{n+1}}{n+1} + C$ |
| $\frac{1}{x}$ | $\ln\|x\| + C$ |
| $e^x$ | $e^x + C$ |
| $\sin x$ | $-\cos x + C$ |
| $\cos x$ | $\sin x + C$ |
| $\frac{1}{\sqrt{1-x^2}}$ | $\arcsin x + C$ |

## Linearità dell'integrale

$$ \int (f(x) + g(x)) \, dx = \int f(x) \, dx + \int g(x) \, dx $$
$$ \int k \cdot f(x) \, dx = k \int f(x) \, dx $$

## Integrale definito

L'**integrale definito** da $a$ a $b$ rappresenta l'**area** sotto la curva $f(x)$ tra $x = a$ e $x = b$:

$$ \int_a^b f(x) \, dx = F(b) - F(a) $$

## Teorema fondamentale del calcolo

Se $F$ è una primitiva di $f$, allora:

$$ \int_a^b f(x) \, dx = F(b) - F(a) $$

## Integrazione per parti

$$ \int f(x) \cdot g'(x) \, dx = f(x) \cdot g(x) - \int f'(x) \cdot g(x) \, dx $$
