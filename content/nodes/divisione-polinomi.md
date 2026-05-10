# Divisione tra polinomi

## Divisione classica

Dati due polinomi $A(x)$ (dividendo) e $B(x)$ (divisore), con grado di $A$ $\ge$ grado di $B$, esistono unici $Q(x)$ (quoziente) e $R(x)$ (resto) tali che:

$$ A(x) = B(x) \cdot Q(x) + R(x) $$

dove il grado di $R$ è minore del grado di $B$.

## Regola di Ruffini

La regola di Ruffini permette di dividere velocemente un polinomio $P(x)$ per $(x - a)$.

### Procedimento

1. Disponi i coefficienti del polinomio $P(x)$ in ordine di grado decrescente
2. Abbassa il primo coefficiente
3. Moltiplica per $a$ e somma al coefficiente successivo
4. Ripeti fino alla fine
5. L'ultimo numero è il resto, gli altri sono i coefficienti del quoziente

### Esempio

Dividere $P(x) = 2x^3 - 3x^2 + 4x - 5$ per $(x - 2)$:

| Passo | Coefficienti |
|---|---|
| Inizio | $2, -3, 4, -5$ |
| Abbassa $2$ | $2$ |
| $2 \times 2 = 4$, somma a $-3$ | $1$ |
| $1 \times 2 = 2$, somma a $4$ | $6$ |
| $6 \times 2 = 12$, somma a $-5$ | $7$ |

Risultato: $Q(x) = 2x^2 + x + 6$, resto $R = 7$.

## Teorema del resto

Il resto della divisione di $P(x)$ per $(x - a)$ è uguale a $P(a)$.
