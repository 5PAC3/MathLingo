'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import katex from 'katex'

function renderFormula(formula: string): string {
  try {
    return katex.renderToString(formula, { throwOnError: false, displayMode: true })
  } catch {
    return formula
  }
}

function renderInline(formula: string): string {
  try {
    return katex.renderToString(formula, { throwOnError: false, displayMode: false })
  } catch {
    return formula
  }
}

interface FormulaGroup {
  title: string
  formulas: { name: string; tex: string; desc?: string }[]
}

const SECTIONS: { category: string; color: string; groups: FormulaGroup[] }[] = [
  {
    category: 'Aritmetica',
    color: 'var(--cat-aritmetica)',
    groups: [
      {
        title: 'Operazioni fondamentali',
        formulas: [
          { name: 'Addizione', tex: 'a + b = c' },
          { name: 'Sottrazione', tex: 'a - b = c' },
          { name: 'Moltiplicazione', tex: 'a \\times b = c' },
          { name: 'Divisione', tex: 'a : b = c \\quad (b \\neq 0)' },
        ],
      },
      {
        title: 'Potenze',
        formulas: [
          { name: 'Definizione', tex: 'a^n = a \\times a \\times \\ldots \\times a \\;(n\\text{ volte})' },
          { name: 'Prodotto', tex: 'a^n \\times a^m = a^{n+m}' },
          { name: 'Quoziente', tex: 'a^n : a^m = a^{n-m}' },
          { name: 'Potenza di potenza', tex: '(a^n)^m = a^{n \\times m}' },
          { name: 'Potenza negativa', tex: 'a^{-n} = \\frac{1}{a^n}' },
        ],
      },
      {
        title: 'Radici',
        formulas: [
          { name: 'Radice quadrata', tex: '\\sqrt{a} = b \\iff b^2 = a' },
          { name: 'Radice ennesima', tex: '\\sqrt[n]{a} = b \\iff b^n = a' },
          { name: 'Prodotto di radici', tex: '\\sqrt{a} \\times \\sqrt{b} = \\sqrt{a \\times b}' },
        ],
      },
      {
        title: 'Frazioni',
        formulas: [
          { name: 'Addizione (stesso denom.)', tex: '\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}' },
          { name: 'Moltiplicazione', tex: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}' },
          { name: 'Divisione', tex: '\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}' },
        ],
      },
      {
        title: 'Proporzioni',
        formulas: [
          { name: 'Definizione', tex: 'a : b = c : d \\iff a \\times d = b \\times c' },
          { name: 'Proporzionalità diretta', tex: '\\frac{y}{x} = k \\implies y = kx' },
          { name: 'Proporzionalità inversa', tex: 'x \\times y = k' },
        ],
      },
      {
        title: 'Percentuali',
        formulas: [
          { name: 'Definizione', tex: 'p\\% = \\frac{p}{100}' },
          { name: 'Calcolo percentuale', tex: '\\frac{p}{100} \\times \\text{totale}' },
        ],
      },
      {
        title: 'mcm e MCD',
        formulas: [
          { name: 'MCD', tex: '\\gcd(a,b) = \\text{massimo divisore comune}' },
          { name: 'mcm', tex: '\\operatorname{lcm}(a,b) = \\frac{a \\times b}{\\gcd(a,b)}' },
        ],
      },
    ],
  },
  {
    category: 'Algebra',
    color: 'var(--cat-algebra)',
    groups: [
      {
        title: 'Prodotti notevoli',
        formulas: [
          { name: 'Quadrato binomio somma', tex: '(a + b)^2 = a^2 + 2ab + b^2' },
          { name: 'Quadrato binomio differenza', tex: '(a - b)^2 = a^2 - 2ab + b^2' },
          { name: 'Differenza di quadrati', tex: '(a + b)(a - b) = a^2 - b^2' },
          { name: 'Cubo binomio somma', tex: '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3' },
          { name: 'Cubo binomio differenza', tex: '(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3' },
        ],
      },
      {
        title: 'Scomposizione',
        formulas: [
          { name: 'Raccoglimento', tex: 'ax + bx = x(a + b)' },
          { name: 'Trinomio speciale', tex: 'x^2 + sx + p = (x + a)(x + b) \\;(a+b=s,\\, a\\times b=p)' },
          { name: 'Somma di cubi', tex: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)' },
          { name: 'Differenza di cubi', tex: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)' },
        ],
      },
      {
        title: 'Equazioni 1° grado',
        formulas: [
          { name: 'Forma generale', tex: 'ax + b = 0 \\implies x = -\\frac{b}{a} \\;(a \\neq 0)' },
        ],
      },
      {
        title: 'Equazioni 2° grado',
        formulas: [
          { name: 'Forma generale', tex: 'ax^2 + bx + c = 0' },
          { name: 'Formula risolutiva', tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
          { name: 'Delta (discriminante)', tex: '\\Delta = b^2 - 4ac' },
          { name: 'Delta > 0', tex: 'x_1 \\neq x_2 \\;\\text{(due soluzioni reali)}' },
          { name: 'Delta = 0', tex: 'x_1 = x_2 = -\\frac{b}{2a}' },
          { name: 'Delta < 0', tex: '\\text{nessuna soluzione reale}' },
        ],
      },
      {
        title: 'Disequazioni 2° grado',
        formulas: [
          { name: 'Regola del segno', tex: 'ax^2 + bx + c > 0 \\implies \\text{segno di }a\\text{ fuori dalle radici}' },
        ],
      },
      {
        title: 'Divisione polinomi (Ruffini)',
        formulas: [
          { name: 'Divisione', tex: 'P(x) : (x - a) \\implies Q(x) + \\frac{R}{x-a}' },
          { name: 'Teorema del resto', tex: 'R = P(a)' },
        ],
      },
      {
        title: 'Sistemi lineari',
        formulas: [
          { name: 'Forma generale 2×2', tex: '\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}' },
          { name: 'Regola di Cramer', tex: 'x = \\frac{ \\begin{vmatrix} c & b \\\\ f & e \\end{vmatrix} }{ \\begin{vmatrix} a & b \\\\ d & e \\end{vmatrix} }' },
        ],
      },
    ],
  },
  {
    category: 'Logica',
    color: 'var(--cat-logica)',
    groups: [
      {
        title: 'Algebra booleana',
        formulas: [
          { name: 'AND', tex: 'A \\land B = \\text{Vero solo se entrambi Vero}' },
          { name: 'OR', tex: 'A \\lor B = \\text{Vero se almeno uno Vero}' },
          { name: 'NOT', tex: '\\lnot A = \\text{inverte il valore}' },
          { name: 'NAND', tex: '\\lnot(A \\land B)' },
          { name: 'NOR', tex: '\\lnot(A \\lor B)' },
          { name: 'XOR', tex: 'A \\oplus B = \\text{Vero se diversi}' },
        ],
      },
    ],
  },
  {
    category: 'Geometria',
    color: 'var(--cat-geometria)',
    groups: [
      {
        title: 'Geometria piana',
        formulas: [
          { name: 'Area rettangolo', tex: 'A = b \\times h' },
          { name: 'Perimetro rettangolo', tex: 'P = 2(b + h)' },
          { name: 'Area triangolo', tex: 'A = \\frac{b \\times h}{2}' },
          { name: 'Area cerchio', tex: 'A = \\pi r^2' },
          { name: 'Circonferenza', tex: 'C = 2\\pi r' },
          { name: 'Area quadrato', tex: 'A = l^2' },
        ],
      },
      {
        title: 'Teorema di Pitagora',
        formulas: [
          { name: 'Ipotenusa', tex: 'i^2 = c_1^2 + c_2^2' },
          { name: 'Cateto', tex: 'c_1 = \\sqrt{i^2 - c_2^2}' },
        ],
      },
      {
        title: 'Geometria solida',
        formulas: [
          { name: 'Volume cubo', tex: 'V = l^3' },
          { name: 'Superficie cubo', tex: 'S = 6l^2' },
          { name: 'Volume parallelepipedo', tex: 'V = a \\times b \\times c' },
          { name: 'Volume cilindro', tex: 'V = \\pi r^2 h' },
          { name: 'Superficie cilindro', tex: 'S = 2\\pi r(r + h)' },
        ],
      },
      {
        title: 'Trigonometria',
        formulas: [
          { name: 'Seno', tex: '\\sin \\theta = \\frac{\\text{cateto opposto}}{\\text{ipotenusa}}' },
          { name: 'Coseno', tex: '\\cos \\theta = \\frac{\\text{cateto adiacente}}{\\text{ipotenusa}}' },
          { name: 'Tangente', tex: '\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}' },
          { name: 'Valori notevoli (30°)', tex: '\\sin 30^\\circ = \\frac{1}{2},\\; \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}' },
          { name: 'Valori notevoli (45°)', tex: '\\sin 45^\\circ = \\cos 45^\\circ = \\frac{\\sqrt{2}}{2}' },
          { name: 'Valori notevoli (60°)', tex: '\\sin 60^\\circ = \\frac{\\sqrt{3}}{2},\\; \\cos 60^\\circ = \\frac{1}{2}' },
        ],
      },
    ],
  },
  {
    category: 'Geometria Analitica',
    color: 'var(--cat-geometria-analitica)',
    groups: [
      {
        title: 'Retta',
        formulas: [
          { name: 'Equazione esplicita', tex: 'y = mx + q' },
          { name: 'Equazione implicita', tex: 'ax + by + c = 0' },
          { name: 'Coefficiente angolare', tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}' },
          { name: 'Rette parallele', tex: 'm_1 = m_2' },
          { name: 'Rette perpendicolari', tex: 'm_1 \\times m_2 = -1' },
          { name: 'Distanza punto-retta', tex: 'd = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}' },
        ],
      },
      {
        title: 'Parabola',
        formulas: [
          { name: 'Equazione', tex: 'y = ax^2 + bx + c' },
          { name: 'Vertice', tex: "V\\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right)" },
          { name: 'Fuoco', tex: "F\\left(-\\frac{b}{2a}, \\frac{1-\\Delta}{4a}\\right)" },
          { name: 'Direttrice', tex: 'y = -\\frac{1+\\Delta}{4a}' },
          { name: 'Asse di simmetria', tex: 'x = -\\frac{b}{2a}' },
        ],
      },
      {
        title: 'Circonferenza',
        formulas: [
          { name: 'Equazione', tex: 'x^2 + y^2 + ax + by + c = 0' },
          { name: 'Centro', tex: "C\\left(-\\frac{a}{2}, -\\frac{b}{2}\\right)" },
          { name: 'Raggio', tex: 'r = \\sqrt{\\left(\\frac{a}{2}\\right)^2 + \\left(\\frac{b}{2}\\right)^2 - c}' },
          { name: 'Equaz. centro-raggio', tex: '(x - x_C)^2 + (y - y_C)^2 = r^2' },
        ],
      },
    ],
  },
  {
    category: 'Analisi',
    color: 'var(--cat-analisi)',
    groups: [
      {
        title: 'Funzioni',
        formulas: [
          { name: 'Dominio (frazione)', tex: '\\text{denominatore} \\neq 0' },
          { name: 'Dominio (radice pari)', tex: '\\text{radicando} \\geq 0' },
          { name: 'Composizione', tex: '(f \\circ g)(x) = f(g(x))' },
        ],
      },
      {
        title: 'Limiti',
        formulas: [
          { name: 'Definizione', tex: '\\lim_{x \\to c} f(x) = L' },
          { name: 'Somma', tex: '\\lim (f+g) = \\lim f + \\lim g' },
          { name: 'Prodotto', tex: '\\lim (f \\cdot g) = \\lim f \\cdot \\lim g' },
          { name: 'Quoziente', tex: '\\lim \\frac{f}{g} = \\frac{\\lim f}{\\lim g}\\;(\\lim g \\neq 0)' },
        ],
      },
      {
        title: 'Derivate',
        formulas: [
          { name: 'Definizione', tex: "f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0+h) - f(x_0)}{h}" },
          { name: 'Derivata di xⁿ', tex: "\\frac{d}{dx}x^n = nx^{n-1}" },
          { name: 'Derivata costante', tex: "\\frac{d}{dx}k = 0" },
          { name: 'Regola del prodotto', tex: "(f \\cdot g)' = f' \\cdot g + f \\cdot g'" },
          { name: 'Regola del quoziente', tex: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}" },
          { name: 'Regola della catena', tex: "(f \\circ g)' = f'(g(x)) \\cdot g'(x)" },
          { name: 'Derivata di eˣ', tex: "\\frac{d}{dx}e^x = e^x" },
          { name: 'Derivata di ln x', tex: "\\frac{d}{dx}\\ln x = \\frac{1}{x}" },
          { name: 'Derivata di sin x', tex: "\\frac{d}{dx}\\sin x = \\cos x" },
          { name: 'Derivata di cos x', tex: "\\frac{d}{dx}\\cos x = -\\sin x" },
        ],
      },
      {
        title: 'Integrali',
        formulas: [
          { name: 'Integrale di xⁿ', tex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C\\;(n \\neq -1)' },
          { name: 'Integrale di 1/x', tex: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C' },
          { name: 'Integrale di eˣ', tex: '\\int e^x\\,dx = e^x + C' },
          { name: 'Integrale di sin x', tex: '\\int \\sin x\\,dx = -\\cos x + C' },
          { name: 'Integrale di cos x', tex: '\\int \\cos x\\,dx = \\sin x + C' },
          { name: 'Integrale definito', tex: '\\int_a^b f(x)\\,dx = F(b) - F(a)' },
          { name: 'Integrazione per parti', tex: "\\int f \\cdot g'\\,dx = f \\cdot g - \\int f' \\cdot g\\,dx" },
        ],
      },
    ],
  },
  {
    category: 'Probabilità e Statistica',
    color: 'var(--cat-probabilita)',
    groups: [
      {
        title: 'Probabilità',
        formulas: [
          { name: 'Definizione classica', tex: 'P(E) = \\frac{\\text{casi favorevoli}}{\\text{casi possibili}}' },
          { name: 'Probabilità condizionata', tex: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}' },
          { name: 'Eventi indipendenti', tex: 'P(A \\cap B) = P(A) \\times P(B)' },
        ],
      },
      {
        title: 'Statistica',
        formulas: [
          { name: 'Media aritmetica', tex: '\\bar{x} = \\frac{\\sum x_i}{n}' },
          { name: 'Mediana', tex: '\\text{valore centrale dei dati ordinati}' },
          { name: 'Moda', tex: '\\text{valore con frequenza maggiore}' },
          { name: 'Varianza', tex: '\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}' },
          { name: 'Deviazione standard', tex: '\\sigma = \\sqrt{\\sigma^2}' },
        ],
      },
      {
        title: 'Calcolo combinatorio',
        formulas: [
          { name: 'Permutazioni', tex: 'P_n = n!' },
          { name: 'Disposizioni semplici', tex: 'D_{n,k} = \\frac{n!}{(n-k)!}' },
          { name: 'Combinazioni', tex: 'C_{n,k} = \\frac{n!}{k!(n-k)!}' },
        ],
      },
    ],
  },
]

export default function FormularioPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '0.5rem', paddingBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          Formulario
        </h1>
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          Tutte le formule matematiche organizzate per argomento
        </p>

        {SECTIONS.map(section => (
          <div key={section.category} style={{ marginTop: '1.5rem' }}>
            <div
              className="card"
              style={{
                borderLeft: `4px solid ${section.color}`,
                marginBottom: '0.75rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  margin: 0,
                  color: section.color,
                }}
              >
                {section.category}
              </h2>
            </div>

            <div className="flex flex-wrap" style={{ gap: '0.75rem', width: '100%' }}>
              {section.groups.map(group => (
                <div
                  key={group.title}
                  className="card"
                  style={{
                    flex: '1 1 320px',
                    minWidth: 280,
                    maxWidth: '100%',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginTop: 0,
                      marginBottom: '0.75rem',
                      color: 'var(--fg)',
                      borderBottom: '1px solid var(--card-border)',
                      paddingBottom: '0.4rem',
                    }}
                  >
                    {group.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {group.formulas.map(f => (
                      <div key={f.name}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--fg-muted)',
                            marginBottom: '0.15rem',
                            opacity: 0.7,
                          }}
                        >
                          {f.name}
                        </div>
                        {mounted ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: renderFormula(f.tex) }}
                            style={{ fontSize: '0.95rem', lineHeight: 1.5 }}
                          />
                        ) : (
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              color: 'var(--fg-muted)',
                              padding: '0.25rem 0',
                            }}
                          >
                            {f.tex}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
