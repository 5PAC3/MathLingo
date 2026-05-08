# mcm e MCD

## MCD — Massimo Comun Divisore

Il più grande numero che divide due o più numeri senza resto.

### Come calcolarlo

1. Scomponi in fattori primi
2. Prendi i fattori **comuni** con l'esponente **minore**

$$ \text{MCD}(12, 18) = 6 $$

$$ 12 = 2^2 \times 3, \quad 18 = 2 \times 3^2 \Rightarrow 2^1 \times 3^1 = 6 $$

## mcm — minimo comune multiplo

Il più piccolo numero che è multiplo di due o più numeri.

### Come calcolarlo

1. Scomponi in fattori primi
2. Prendi tutti i fattori con l'esponente **maggiore**

$$ \text{mcm}(12, 18) = 36 $$

$$ 12 = 2^2 \times 3, \quad 18 = 2 \times 3^2 \Rightarrow 2^2 \times 3^2 = 36 $$

## Formula

$$ \text{MCD}(a, b) \times \text{mcm}(a, b) = a \times b $$
