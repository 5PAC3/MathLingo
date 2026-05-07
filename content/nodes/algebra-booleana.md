# Algebra Booleana

L'algebra booleana lavora con soli **due valori**: **Vero** (True) e **Falso** (False).

## Operatori fondamentali

### AND (congiunzione)
Dà Vero **solo se** entrambi gli ingressi sono Vero.

| A | B | A AND B |
|---|---|---------|
| F | F | F |
| F | V | F |
| V | F | F |
| V | V | V |

### OR (disgiunzione)
Dà Vero se **almeno uno** degli ingressi è Vero.

| A | B | A OR B |
|---|---|--------|
| F | F | F |
| F | V | V |
| V | F | V |
| V | V | V |

### NOT (negazione)
Inverte il valore: Vero → Falso, Falso → Vero.

## Operatori derivati

- **NAND**: NOT(A AND B)
- **NOR**: NOT(A OR B)
- **XOR**: Vero se A e B sono diversi
